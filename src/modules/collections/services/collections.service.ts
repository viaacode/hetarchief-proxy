import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get } from 'lodash';

import {
	Collection,
	CollectionObjectLink,
	GqlCollection,
	GqlCollectionWithObjects,
	GqlObject,
	GqlUpdateCollection,
	IeObject,
} from '../types';

import {
	DeleteCollectionDocument,
	DeleteCollectionMutation,
	FindCollectionByIdDocument,
	FindCollectionByIdQuery,
	FindCollectionObjectsByCollectionIdDocument,
	FindCollectionObjectsByCollectionIdQuery,
	FindCollectionsByUserDocument,
	FindCollectionsByUserQuery,
	FindObjectBySchemaIdentifierDocument,
	FindObjectBySchemaIdentifierQuery,
	FindObjectInCollectionDocument,
	FindObjectInCollectionQuery,
	InsertCollectionsDocument,
	InsertCollectionsMutation,
	InsertCollectionsMutationVariables,
	InsertObjectIntoCollectionDocument,
	InsertObjectIntoCollectionMutation,
	RemoveObjectFromCollectionDocument,
	RemoveObjectFromCollectionMutation,
	UpdateCollectionDocument,
	UpdateCollectionMutation,
} from '~generated/graphql-db-types-hetarchief';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { CollectionObjectsQueryDto } from '~modules/collections/dto/collections.dto';
import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class CollectionsService {
	private logger: Logger = new Logger(CollectionsService.name, { timestamp: true });

	constructor(
		protected dataService: DataService,
		protected playerTicketService: PlayerTicketService
	) {}

	public adaptIeObject(gqlIeObject: GqlObject | undefined): IeObject | undefined {
		if (!gqlIeObject) {
			return undefined;
		}

		/* istanbul ignore next */
		return {
			maintainerId: gqlIeObject?.maintainer?.schema_identifier,
			maintainerName: gqlIeObject?.maintainer?.schema_name,
			readingRoomId: gqlIeObject?.maintainer?.visitor_space?.id,
			creator: gqlIeObject?.schema_creator,
			description: gqlIeObject?.schema_description,
			format: gqlIeObject?.dcterms_format,
			schemaIdentifier: gqlIeObject?.schema_identifier, // Unique for each object
			meemooIdentifier: gqlIeObject?.meemoo_identifier,
			name: gqlIeObject?.schema_name,
			numberOfPages: gqlIeObject?.schema_number_of_pages,
			termsAvailable: gqlIeObject?.dcterms_available,
			thumbnailUrl: gqlIeObject?.schema_thumbnail_url,
			series: gqlIeObject?.schema_is_part_of?.serie || [],
			programs: gqlIeObject?.schema_is_part_of?.programma || [],
			datePublished: gqlIeObject?.schema_date_published || null,
			dateCreatedLowerBound: gqlIeObject?.schema_date_created_lower_bound || null,
		};
	}

	/**
	 * Adapt a collection as returned by a typical graphQl response to our internal collection data model
	 */
	public async adaptCollection(
		gqlCollection: GqlCollection | undefined,
		referer: string
	): Promise<Collection | undefined> {
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
			objects: await Promise.all(
				(gqlCollection as GqlCollectionWithObjects).ies
					? (gqlCollection as GqlCollectionWithObjects).ies.map((object) =>
							this.adaptCollectionObjectLink(object, referer)
					  )
					: []
			),
		};
	}

	public async adaptCollectionObjectLink(
		gqlCollectionObjectLink: CollectionObjectLink | undefined,
		referer: string
	): Promise<IeObject | undefined> {
		if (!gqlCollectionObjectLink) {
			return undefined;
		}

		/* istanbul ignore next */
		const objectIe = this.adaptIeObject(gqlCollectionObjectLink?.ie as GqlObject);
		const resolvedThumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
			objectIe.thumbnailUrl,
			referer
		);
		return {
			collectionEntryCreatedAt: get(gqlCollectionObjectLink, 'created_at'),
			...objectIe,
			thumbnailUrl: resolvedThumbnailUrl,
		};
	}

	public async findCollectionsByUser(
		userProfileId: string,
		referer: string,
		page = 1,
		size = 1000
	): Promise<IPagination<Collection>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const collectionsResponse = await this.dataService.execute<FindCollectionsByUserQuery>(
			FindCollectionsByUserDocument,
			{
				userProfileId,
				offset,
				limit,
			}
		);

		return Pagination<Collection>({
			items: await Promise.all(
				collectionsResponse.data.users_folder.map((collection: any) =>
					this.adaptCollection(collection, referer)
				)
			),
			page,
			size,
			total: collectionsResponse.data.users_folder_aggregate.aggregate.count,
		});
	}

	public async findCollectionById(collectionId: string, referer: string): Promise<Collection> {
		const collectionResponse = await this.dataService.execute<FindCollectionByIdQuery>(
			FindCollectionByIdDocument,
			{
				collectionId,
			}
		);

		return this.adaptCollection(collectionResponse.data.users_folder[0], referer);
	}

	public async findObjectsByCollectionId(
		collectionId: string,
		userProfileId: string,
		queryDto: CollectionObjectsQueryDto,
		referer: string
	): Promise<IPagination<IeObject>> {
		const { query, page, size } = queryDto;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const where = { ie: { schema_name: { _ilike: query } } };
		const collectionObjectsResponse =
			await this.dataService.execute<FindCollectionObjectsByCollectionIdQuery>(
				FindCollectionObjectsByCollectionIdDocument,
				{
					collectionId,
					userProfileId,
					where,
					offset,
					limit,
				}
			);
		if (!collectionObjectsResponse.data.users_folder_ie[0]) {
			throw new NotFoundException();
		}
		const total = collectionObjectsResponse.data.users_folder_ie_aggregate.aggregate.count;
		return {
			items: await Promise.all(
				collectionObjectsResponse.data.users_folder_ie.map((collectionObject) =>
					this.adaptCollectionObjectLink(collectionObject, referer)
				)
			),
			page,
			size,
			total,
			pages: Math.ceil(total / size),
		};
	}

	public async create(
		collection: InsertCollectionsMutationVariables['object'],
		referer: string
	): Promise<Collection> {
		const response = await this.dataService.execute<InsertCollectionsMutation>(
			InsertCollectionsDocument,
			{
				object: collection,
			}
		);
		const createdCollection = response.data.insert_users_folder.returning[0];
		this.logger.debug(`Collection ${createdCollection.id} created`);

		return this.adaptCollection(createdCollection, referer);
	}

	public async update(
		collectionId: string,
		userProfileId: string,
		collection: GqlUpdateCollection,
		referer: string
	): Promise<Collection> {
		const response = await this.dataService.execute<UpdateCollectionMutation>(
			UpdateCollectionDocument,
			{
				collectionId,
				userProfileId,
				collection,
			}
		);

		const updatedCollection = response.data.update_users_folder.returning[0];
		this.logger.debug(`Collection ${updatedCollection.id} updated`);

		return this.adaptCollection(updatedCollection, referer);
	}

	public async delete(collectionId: string, userProfileId: string): Promise<number> {
		const response = await this.dataService.execute<DeleteCollectionMutation>(
			DeleteCollectionDocument,
			{
				collectionId,
				userProfileId,
			}
		);
		this.logger.debug(`Collection ${collectionId} deleted`);

		return response.data.delete_users_folder.affected_rows;
	}

	public async findObjectInCollectionBySchemaIdentifier(
		collectionId: string,
		objectSchemaIdentifier: string,
		referer: string
	): Promise<IeObject | null> {
		const response = await this.dataService.execute<FindObjectInCollectionQuery>(
			FindObjectInCollectionDocument,
			{
				collectionId,
				objectSchemaIdentifier,
			}
		);

		/* istanbul ignore next */
		const foundObject = response?.data?.users_folder_ie?.[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier} in ${collectionId}`);

		return this.adaptCollectionObjectLink(foundObject, referer);
	}

	public async findObjectBySchemaIdentifier(
		objectSchemaIdentifier: string
	): Promise<IeObject | null> {
		const response = await this.dataService.execute<FindObjectBySchemaIdentifierQuery>(
			FindObjectBySchemaIdentifierDocument,
			{
				objectSchemaIdentifier,
			}
		);
		const foundObject = response.data.object_ie[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier}`);

		return this.adaptIeObject(foundObject);
	}

	public async addObjectToCollection(
		collectionId: string,
		objectSchemaIdentifier: string,
		referer: string
	): Promise<IeObject> {
		const collectionObject = await this.findObjectInCollectionBySchemaIdentifier(
			collectionId,
			objectSchemaIdentifier,
			referer
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

		const response = await this.dataService.execute<InsertObjectIntoCollectionMutation>(
			InsertObjectIntoCollectionDocument,
			{
				collectionId,
				objectSchemaIdentifier,
			}
		);
		const createdObject = response.data.insert_users_folder_ie.returning[0];
		this.logger.debug(`Collection object ${objectSchemaIdentifier} created`);

		return this.adaptCollectionObjectLink(createdObject, referer);
	}

	public async removeObjectFromCollection(
		collectionId: string,
		objectSchemaIdentifier: string,
		userProfileId: string
	) {
		const response = await this.dataService.execute<RemoveObjectFromCollectionMutation>(
			RemoveObjectFromCollectionDocument,
			{
				collectionId,
				objectSchemaIdentifier,
				userProfileId,
			}
		);
		this.logger.debug(`Collection object ${objectSchemaIdentifier} deleted`);

		return response.data.delete_users_folder_ie.affected_rows || 0;
	}
}
