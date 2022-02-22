import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import { Collection, GqlCollection, GqlCreateCollection, GqlUpdateCollection } from '../types';

import {
	DELETE_COLLECTION,
	FIND_COLLECTION_BY_ID,
	FIND_COLLECTIONS_BY_USER,
	INSERT_COLLECTION,
	UPDATE_COLLECTION,
} from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class CollectionsService {
	private logger: Logger = new Logger(CollectionsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a collection as returned by a typical graphQl response to our internal collection data model
	 */
	public adapt(gqlCollection: GqlCollection | undefined): Collection | undefined {
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

	public async findByUser(
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
				this.adapt(collection)
			),
			page,
			size,
			total: collectionsResponse.data.users_collection_aggregate.aggregate.count,
		});
	}

	public async findById(collectionId: string): Promise<Collection> {
		const collectionResponse = await this.dataService.execute(FIND_COLLECTION_BY_ID, {
			collectionId,
		});
		if (!collectionResponse.data.users_collection[0]) {
			throw new NotFoundException();
		}
		return this.adapt(collectionResponse.data.users_collection[0]);
	}

	public async create(collection: GqlCreateCollection): Promise<Collection> {
		const response = await this.dataService.execute(INSERT_COLLECTION, { object: collection });
		const createdCollection = response?.data?.insert_users_collection;
		this.logger.debug(`Collection ${createdCollection?.id} created`);

		return this.adapt(createdCollection);
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

		return this.adapt(updatedCollection);
	}

	public async delete(collectionId: string, userProfileId: string): Promise<number> {
		const response = await this.dataService.execute(DELETE_COLLECTION, {
			collectionId,
			userProfileId,
		});
		this.logger.debug(`Collection ${collectionId} deleted`);

		return response?.data?.delete_users_collection?.affected_rows || 0;
	}
}
