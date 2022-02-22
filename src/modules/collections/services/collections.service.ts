import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import {
	Collection,
	CollectionObjectLink,
	GqlCollection,
	GqlCreateCollection,
	GqlUpdateCollection,
	IeObject,
} from '../types';

import {
	DELETE_COLLECTION,
	FIND_COLLECTION_BY_ID,
	FIND_COLLECTION_OBJECTS_BY_COLLECTION_ID,
	FIND_COLLECTIONS_BY_USER,
	INSERT_COLLECTION,
	INSERT_OBJECT_INTO_COLLECTION,
	REMOVE_OBJECT_FROM_COLLECTION,
	UPDATE_COLLECTION,
} from './queries.gql';

import { CollectionObjectsQueryDto } from '~modules/collections/dto/collections.dto';
import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class CollectionsService {
	private logger: Logger = new Logger(CollectionsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a collection as returned by a typical graphQl response to our internal collection data model
	 */
	public adaptCollection(gqlCollection: GqlCollection | undefined): Collection | undefined {
		if (!gqlCollection) {
			return undefined;
		}
		const { ies: gslLinkObjects, ...collection } = gqlCollection;
		return {
			id: collection.id,
			name: collection.name,
			userProfileId: collection.user_profile_id,
			createdAt: collection.created_at,
			updatedAt: collection.updated_at,
			isDefault: collection.is_default,
			objects: gslLinkObjects?.map((gqlLinkObject) => ({
				// TODO add maintainer once ARC-524 has been resolved
				// maintainer: gqlLinkObject?.intellectual_entity?.schema_maintainer,
				id: gqlLinkObject?.intellectual_entity?.schema_identifier,
				name: gqlLinkObject?.intellectual_entity?.schema_name,
				termsAvailable: gqlLinkObject?.intellectual_entity?.dcterms_available,
				creator: gqlLinkObject?.intellectual_entity?.schema_creator,
				format: gqlLinkObject?.intellectual_entity?.dcterms_format,
				numberOfPages: gqlLinkObject?.intellectual_entity?.schema_number_of_pages,
				thumbnailUrl: gqlLinkObject?.intellectual_entity?.schema_thumbnail_url,
				collectionEntryCreatedAt: gqlLinkObject?.created_at,
			})),
		};
	}

	public adaptCollectionObjectLink(
		gqlCollectionObjectLink: CollectionObjectLink | undefined
	): IeObject | undefined {
		if (!gqlCollectionObjectLink) {
			return undefined;
		}
		return {
			// TODO add maintainer once ARC-524 has been resolved
			// maintainer: gqlCollectionObjectLink?.intellectual_entity?.schema_maintainer,
			id: gqlCollectionObjectLink?.intellectual_entity?.schema_identifier,
			name: gqlCollectionObjectLink?.intellectual_entity?.schema_name,
			termsAvailable: gqlCollectionObjectLink?.intellectual_entity?.dcterms_available,
			creator: gqlCollectionObjectLink?.intellectual_entity?.schema_creator,
			format: gqlCollectionObjectLink?.intellectual_entity?.dcterms_format,
			numberOfPages: gqlCollectionObjectLink?.intellectual_entity?.schema_number_of_pages,
			thumbnailUrl: gqlCollectionObjectLink?.intellectual_entity?.schema_thumbnail_url,
			collectionEntryCreatedAt: gqlCollectionObjectLink?.created_at,
		};
	}

	public async findCollectionsByUser(
		userProfileId: string,
		page = 1,
		size = 1000
	): Promise<IPagination<Collection>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const collectionsResponse = await this.dataService.execute(FIND_COLLECTIONS_BY_USER, {
			userProfileId,
			offset,
			limit,
		});

		return Pagination<Collection>({
			items: collectionsResponse.data.users_collection.map((collection: any) =>
				this.adaptCollection(collection)
			),
			page,
			size,
			total: collectionsResponse.data.users_collection_aggregate.aggregate.count,
		});
	}

	public async findCollectionById(collectionId: string): Promise<Collection> {
		const collectionResponse = await this.dataService.execute(FIND_COLLECTION_BY_ID, {
			collectionId,
		});

		return this.adaptCollection(collectionResponse.data?.users_collection?.[0]);
	}

	public async findObjectsByCollectionId(
		collectionId: string,
		userProfileId: string,
		queryDto: CollectionObjectsQueryDto
	): Promise<IPagination<IeObject>> {
		const { query, page, size } = queryDto;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const where = { intellectual_entity: { schema_name: { _ilike: query } } };
		const collectionObjectsResponse = await this.dataService.execute(
			FIND_COLLECTION_OBJECTS_BY_COLLECTION_ID,
			{
				collectionId,
				userProfileId,
				where,
				offset,
				limit,
			}
		);
		if (!collectionObjectsResponse.data?.users_collection_ie) {
			throw new NotFoundException();
		}
		const total =
			collectionObjectsResponse.data?.users_collection_ie_aggregate?.aggregate?.count || 0;
		return {
			items: collectionObjectsResponse.data?.users_collection_ie.map(
				this.adaptCollectionObjectLink
			),
			page,
			size,
			total,
			pages: Math.ceil(total / size),
		};
	}

	public async create(collection: GqlCreateCollection): Promise<Collection> {
		const response = await this.dataService.execute(INSERT_COLLECTION, { object: collection });
		const createdCollection = response?.data?.insert_users_collection;
		this.logger.debug(`Collection ${createdCollection?.id} created`);

		return this.adaptCollection(createdCollection);
	}

	public async update(
		collectionId: string,
		userProfileId: string,
		collection: GqlUpdateCollection
	): Promise<Collection> {
		const response = await this.dataService.execute(UPDATE_COLLECTION, {
			collectionId,
			userProfileId,
			collection,
		});
		const updatedCollection = response?.data?.update_users_collection;
		this.logger.debug(`Collection ${updatedCollection.id} updated`);

		return this.adaptCollection(updatedCollection);
	}

	public async delete(collectionId: string, userProfileId: string): Promise<number> {
		const response = await this.dataService.execute(DELETE_COLLECTION, {
			collectionId,
			userProfileId,
		});
		this.logger.debug(`Collection ${collectionId} deleted`);

		return response?.data?.delete_users_collection?.affected_rows || 0;
	}

	public async addObjectToCollection(collectionId: string, objectId: string): Promise<IeObject> {
		const response = await this.dataService.execute(INSERT_OBJECT_INTO_COLLECTION, {
			collectionId,
			objectId,
		});
		const createdObject = response?.data?.insert_users_collection_ie;
		this.logger.debug(`Collection object ${objectId} created`);

		return this.adaptCollectionObjectLink(createdObject);
	}

	async removeObjectFromCollection(collectionId: string, objectId: string) {
		const response = await this.dataService.execute(REMOVE_OBJECT_FROM_COLLECTION, {
			collectionId,
			objectId,
		});
		this.logger.debug(`Collection object ${objectId} deleted`);

		return response?.data?.delete_users_collection_ie?.affected_rows;
	}
}
