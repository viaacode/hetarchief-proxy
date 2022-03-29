import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get } from 'lodash';

import {
	DeleteCollectionDocument,
	FindCollectionByIdDocument,
	FindCollectionObjectsByCollectionIdDocument,
	FindCollectionsByUserDocument,
	FindObjectBySchemaIdentifierDocument,
	FindObjectInCollectionDocument,
	InsertCollectionsDocument,
	InsertObjectIntoCollectionDocument,
	RemoveObjectFromCollectionDocument,
	UpdateCollectionDocument,
} from '../../../generated/graphql';
import {
	Collection,
	CollectionObjectLink,
	GqlCollection,
	GqlCollectionWithObjects,
	GqlCreateCollection,
	GqlObject,
	GqlUpdateCollection,
	IeObject,
} from '../types';

import { CollectionObjectsQueryDto } from '~modules/collections/dto/collections.dto';
import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class CollectionsService {
	private logger: Logger = new Logger(CollectionsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public adaptIeObject(gqlIeObject: GqlObject | undefined): IeObject | undefined {
		if (!gqlIeObject) {
			return undefined;
		}
		console.info(gqlIeObject);
		return {
			maintainerId: get(gqlIeObject, 'maintainer.schema_identifier'),
			maintainerName: get(gqlIeObject, 'maintainer.schema_name'),
			readingRoomId: get(gqlIeObject, 'maintainer.space.id'),
			creator: get(gqlIeObject, 'schema_creator'),
			description: get(gqlIeObject, 'schema_description'),
			format: get(gqlIeObject, 'dcterms_format'),
			schemaIdentifier: get(gqlIeObject, 'schema_identifier'), // Unique for each object
			meemooIdentifier: get(gqlIeObject, 'meemoo_identifier'),
			name: get(gqlIeObject, 'schema_name'),
			numberOfPages: get(gqlIeObject, 'schema_number_of_pages'),
			termsAvailable: get(gqlIeObject, 'dcterms_available'),
			thumbnailUrl: get(gqlIeObject, 'schema_thumbnail_url'),
			series: get(gqlIeObject, 'schema_is_part_of', { serie: [] }).serie,
			programs: get(gqlIeObject, 'schema_is_part_of', { programma: [] }).programma,
			datePublished: get(gqlIeObject, 'schema_date_published', null),
			dateCreatedLowerBound: get(gqlIeObject, 'schema_date_created_lower_bound', null),
		};
	}

	/**
	 * Adapt a collection as returned by a typical graphQl response to our internal collection data model
	 */
	public adaptCollection(gqlCollection: GqlCollection | undefined): Collection | undefined {
		if (!gqlCollection) {
			return undefined;
		}
		return {
			id: gqlCollection.id,
			name: gqlCollection.name,
			userProfileId: gqlCollection.user_profile_id,
			createdAt: gqlCollection.created_at,
			updatedAt: gqlCollection.updated_at,
			isDefault: gqlCollection.is_default,
			objects: (gqlCollection as GqlCollectionWithObjects).ies?.map(
				this.adaptCollectionObjectLink
			),
		};
	}

	public adaptCollectionObjectLink = (
		gqlCollectionObjectLink: CollectionObjectLink | undefined
	): IeObject | undefined => {
		if (!gqlCollectionObjectLink) {
			return undefined;
		}
		const func = this.adaptIeObject;
		const objectIe = func(get(gqlCollectionObjectLink, 'ie'));
		return {
			collectionEntryCreatedAt: get(gqlCollectionObjectLink, 'created_at'),
			...objectIe,
		};
	};

	public async findCollectionsByUser(
		userProfileId: string,
		page = 1,
		size = 1000
	): Promise<IPagination<Collection>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const collectionsResponse = await this.dataService.execute(FindCollectionsByUserDocument, {
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
		const collectionResponse = await this.dataService.execute(FindCollectionByIdDocument, {
			collectionId,
		});

		return this.adaptCollection(collectionResponse.data.users_collection[0]);
	}

	public async findObjectsByCollectionId(
		collectionId: string,
		userProfileId: string,
		queryDto: CollectionObjectsQueryDto
	): Promise<IPagination<IeObject>> {
		const { query, page, size } = queryDto;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const where = { ie: { schema_name: { _ilike: query } } };
		const collectionObjectsResponse = await this.dataService.execute(
			FindCollectionObjectsByCollectionIdDocument,
			{
				collectionId,
				userProfileId,
				where,
				offset,
				limit,
			}
		);
		if (!collectionObjectsResponse.data.users_collection_ie) {
			throw new NotFoundException();
		}
		const total = collectionObjectsResponse.data.users_collection_ie_aggregate.aggregate.count;
		return {
			items: collectionObjectsResponse.data.users_collection_ie.map(
				this.adaptCollectionObjectLink
			),
			page,
			size,
			total,
			pages: Math.ceil(total / size),
		};
	}

	public async create(collection: GqlCreateCollection): Promise<Collection> {
		const response = await this.dataService.execute(InsertCollectionsDocument, {
			object: collection,
		});
		const createdCollection = response.data.insert_users_collection.returning[0];
		this.logger.debug(`Collection ${createdCollection.id} created`);

		return this.adaptCollection(createdCollection);
	}

	public async update(
		collectionId: string,
		userProfileId: string,
		collection: GqlUpdateCollection
	): Promise<Collection> {
		const response = await this.dataService.execute(UpdateCollectionDocument, {
			collectionId,
			userProfileId,
			collection,
		});

		const updatedCollection = response.data.update_users_collection.returning[0];
		this.logger.debug(`Collection ${updatedCollection.id} updated`);

		return this.adaptCollection(updatedCollection);
	}

	public async delete(collectionId: string, userProfileId: string): Promise<number> {
		const response = await this.dataService.execute(DeleteCollectionDocument, {
			collectionId,
			userProfileId,
		});
		this.logger.debug(`Collection ${collectionId} deleted`);

		return response.data.delete_users_collection.affected_rows;
	}

	public async findObjectInCollectionBySchemaIdentifier(
		collectionId: string,
		objectSchemaIdentifier: string
	): Promise<IeObject | null> {
		const response = await this.dataService.execute(FindObjectInCollectionDocument, {
			collectionId,
			objectSchemaIdentifier,
		});
		const foundObject = response.data.users_collection_ie[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier} in ${collectionId}`);

		return this.adaptCollectionObjectLink(foundObject);
	}

	public async findObjectBySchemaIdentifier(
		objectSchemaIdentifier: string
	): Promise<IeObject | null> {
		const response = await this.dataService.execute(FindObjectBySchemaIdentifierDocument, {
			objectSchemaIdentifier,
		});
		const foundObject = response.data.object_ie[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier}`);

		return this.adaptIeObject(foundObject);
	}

	public async addObjectToCollection(
		collectionId: string,
		objectSchemaIdentifier: string
	): Promise<IeObject> {
		const collectionObject = await this.findObjectInCollectionBySchemaIdentifier(
			collectionId,
			objectSchemaIdentifier
		);
		if (collectionObject) {
			throw new BadRequestException({
				code: 'OBJECT_ALREADY_EXISTS',
				message: 'Object already exists in collection',
			});
		}

		const objectInfo = await this.findObjectBySchemaIdentifier(objectSchemaIdentifier);

		if (!objectInfo) {
			throw new NotFoundException(
				`Object with schema identifier ${objectSchemaIdentifier} was not found`
			);
		}

		const response = await this.dataService.execute(InsertObjectIntoCollectionDocument, {
			collectionId,
			objectSchemaIdentifier,
		});
		const createdObject = response.data.insert_users_collection_ie.returning[0];
		this.logger.debug(`Collection object ${objectSchemaIdentifier} created`);

		return this.adaptCollectionObjectLink(createdObject);
	}

	async removeObjectFromCollection(
		collectionId: string,
		objectSchemaIdentifier: string,
		userProfileId: string
	) {
		const response = await this.dataService.execute(RemoveObjectFromCollectionDocument, {
			collectionId,
			objectSchemaIdentifier,
			userProfileId,
		});
		this.logger.debug(`Collection object ${objectSchemaIdentifier} deleted`);

		return response.data.delete_users_collection_ie.affected_rows || 0;
	}
}
