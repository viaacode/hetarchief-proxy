import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { format } from 'date-fns';
import { isEmpty, maxBy } from 'lodash';

import {
	Collection,
	CollectionObjectLink,
	GqlCollection,
	GqlCollectionWithObjects,
	GqlObject,
	GqlUpdateCollection,
} from '../types';

import {
	DeleteCollectionDocument,
	DeleteCollectionMutation,
	DeleteCollectionMutationVariables,
	FindCollectionByIdDocument,
	FindCollectionByIdQuery,
	FindCollectionByIdQueryVariables,
	FindCollectionObjectsByCollectionIdDocument,
	FindCollectionObjectsByCollectionIdQuery,
	FindCollectionObjectsByCollectionIdQueryVariables,
	FindCollectionsByUserDocument,
	FindCollectionsByUserQuery,
	FindCollectionsByUserQueryVariables,
	FindObjectBySchemaIdentifierDocument,
	FindObjectBySchemaIdentifierQuery,
	FindObjectBySchemaIdentifierQueryVariables,
	FindObjectInCollectionDocument,
	FindObjectInCollectionQuery,
	FindObjectInCollectionQueryVariables,
	InsertCollectionsDocument,
	InsertCollectionsMutation,
	InsertCollectionsMutationVariables,
	InsertObjectIntoCollectionDocument,
	InsertObjectIntoCollectionMutation,
	InsertObjectIntoCollectionMutationVariables,
	RemoveObjectFromCollectionDocument,
	RemoveObjectFromCollectionMutation,
	RemoveObjectFromCollectionMutationVariables,
	UpdateCollectionDocument,
	UpdateCollectionMutation,
	UpdateCollectionMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { CollectionObjectsQueryDto } from '~modules/collections/dto/collections.dto';
import { IeObject, IeObjectSector } from '~modules/ie-objects/ie-objects.types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class CollectionsService {
	private logger: Logger = new Logger(CollectionsService.name, { timestamp: true });

	constructor(
		protected dataService: DataService,
		protected playerTicketService: PlayerTicketService,
		protected visitsService: VisitsService
	) {}

	public adaptIeObject(gqlIeObject: GqlObject | undefined): Partial<IeObject> | undefined {
		if (!gqlIeObject) {
			return undefined;
		}

		/* istanbul ignore next */
		return {
			maintainerId: gqlIeObject?.maintainer?.schema_identifier,
			maintainerName: gqlIeObject?.maintainer?.schema_name,
			maintainerSlug: gqlIeObject?.maintainer?.visitor_space?.slug,
			creator: gqlIeObject?.schema_creator,
			description: gqlIeObject?.schema_description,
			dctermsFormat: gqlIeObject?.dcterms_format,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			schemaIdentifier: gqlIeObject?.schema_identifier, // Unique for each object
			meemooIdentifier: gqlIeObject?.meemoo_identifier,
			meemooLocalId: gqlIeObject?.meemoo_local_id,
			name: gqlIeObject?.schema_name,
			numberOfPages: gqlIeObject?.schema_number_of_pages,
			dateCreated: undefined,
			thumbnailUrl: gqlIeObject?.schema_thumbnail_url,
			series: gqlIeObject?.schema_is_part_of?.serie || [],
			programs: gqlIeObject?.schema_is_part_of?.programma || [],
			alternativeName: gqlIeObject?.schema_is_part_of?.alternatief || null,
			datePublished: gqlIeObject?.schema_date_published || null,
			dateCreatedLowerBound: gqlIeObject?.schema_date_created_lower_bound || null,
			duration: gqlIeObject?.schema_duration || null,
			licenses: gqlIeObject?.schema_license || null,
			sector: gqlIeObject?.maintainer?.information?.haorg_organization_type as IeObjectSector,
		};
	}

	public getLastEndAtDate(visitEndDates: Date[]): string | null {
		if (isEmpty(visitEndDates)) {
			return null;
		}

		const lastEndDate = maxBy(visitEndDates, (visitEndDate) => visitEndDate.getTime());

		return format(lastEndDate, 'yyyy-MM-dd');
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

		let usedForLimitedAccessUntil: string | null = undefined;
		try {
			const visitsWithFolders: Date[] = await this.visitsService.findEndDatesByFolderId(
				gqlCollection.id
			);
			usedForLimitedAccessUntil = this.getLastEndAtDate(visitsWithFolders);
		} catch (error) {
			this.logger.debug(`Visits by folder id ${gqlCollection.id} could not be retrieved`);
		}

		/* istanbul ignore next */
		return {
			id: gqlCollection.id,
			name: gqlCollection.name,
			userProfileId: gqlCollection.user_profile_id,
			createdAt: gqlCollection.created_at,
			updatedAt: gqlCollection.updated_at,
			isDefault: gqlCollection.is_default,
			usedForLimitedAccessUntil: usedForLimitedAccessUntil || null,
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
	): Promise<(Partial<IeObject> & { collectionEntryCreatedAt: string }) | undefined> {
		if (!gqlCollectionObjectLink) {
			return undefined;
		}

		/* istanbul ignore next */
		// TODO: add union type
		const objectIe = this.adaptIeObject(gqlCollectionObjectLink?.ie as GqlObject);
		const resolvedThumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
			objectIe.thumbnailUrl,
			referer
		);
		return {
			collectionEntryCreatedAt: gqlCollectionObjectLink?.created_at,
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
		const collectionsResponse = await this.dataService.execute<
			FindCollectionsByUserQuery,
			FindCollectionsByUserQueryVariables
		>(FindCollectionsByUserDocument, {
			userProfileId,
			offset,
			limit,
		});

		return Pagination<Collection>({
			items: await Promise.all(
				collectionsResponse.users_folder.map((collection: any) =>
					this.adaptCollection(collection, referer)
				)
			),
			page,
			size,
			total: collectionsResponse.users_folder_aggregate.aggregate.count,
		});
	}

	public async findCollectionById(collectionId: string, referer: string): Promise<Collection> {
		const collectionResponse = await this.dataService.execute<
			FindCollectionByIdQuery,
			FindCollectionByIdQueryVariables
		>(FindCollectionByIdDocument, {
			collectionId,
		});

		return this.adaptCollection(collectionResponse.users_folder[0], referer);
	}

	public async findObjectsByCollectionId(
		collectionId: string,
		userProfileId: string,
		queryDto: CollectionObjectsQueryDto,
		referer: string
	): Promise<IPagination<Partial<IeObject> & { collectionEntryCreatedAt: string }>> {
		const { query, page, size } = queryDto;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		let where = {};
		if (query) {
			where = {
				_or: [
					{ ie: { schema_name: { _ilike: query } } },
					{ ie: { maintainer: { schema_name: { _ilike: query } } } },
					{ ie: { dcterms_format: { _ilike: query } } },
					{ ie: { meemoo_identifier: { _ilike: query } } },
					{ ie: { schema_identifier: { _ilike: query } } },
					{
						ie: {
							_schema_is_part_of: {
								schema_is_part_of: {},
								_and: {
									schema_is_part_of: { _eq: 'serie' },
									value: { _ilike: query },
								},
							},
						},
					},
					{
						ie: {
							_schema_is_part_of: {
								schema_is_part_of: {},
								_and: {
									schema_is_part_of: { _eq: 'programma' },
									value: { _ilike: query },
								},
							},
						},
					},
				],
			};
		}
		const collectionObjectsResponse = await this.dataService.execute<
			FindCollectionObjectsByCollectionIdQuery,
			FindCollectionObjectsByCollectionIdQueryVariables
		>(FindCollectionObjectsByCollectionIdDocument, {
			collectionId,
			userProfileId,
			where,
			offset,
			limit,
		});
		if (isEmpty(collectionObjectsResponse.users_folder_ie)) {
			throw new NotFoundException();
		}
		const total = collectionObjectsResponse.users_folder_ie_aggregate.aggregate.count;
		return {
			items: await Promise.all(
				collectionObjectsResponse.users_folder_ie.map((collectionObject) =>
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
		const response = await this.dataService.execute<
			InsertCollectionsMutation,
			InsertCollectionsMutationVariables
		>(InsertCollectionsDocument, {
			object: collection,
		});
		const createdCollection = response.insert_users_folder.returning[0];
		this.logger.debug(`Collection ${createdCollection.id} created`);

		return this.adaptCollection(createdCollection, referer);
	}

	public async update(
		collectionId: string,
		userProfileId: string,
		collection: GqlUpdateCollection,
		referer: string
	): Promise<Collection> {
		const response = await this.dataService.execute<
			UpdateCollectionMutation,
			UpdateCollectionMutationVariables
		>(UpdateCollectionDocument, {
			collectionId,
			userProfileId,
			collection,
		});

		const updatedCollection = response.update_users_folder.returning[0];
		this.logger.debug(`Collection ${updatedCollection.id} updated`);

		return this.adaptCollection(updatedCollection, referer);
	}

	public async delete(collectionId: string, userProfileId: string): Promise<number> {
		const response = await this.dataService.execute<
			DeleteCollectionMutation,
			DeleteCollectionMutationVariables
		>(DeleteCollectionDocument, {
			collectionId,
			userProfileId,
		});
		this.logger.debug(`Collection ${collectionId} deleted`);

		return response.delete_users_folder.affected_rows;
	}

	public async findObjectInCollectionBySchemaIdentifier(
		collectionId: string,
		objectSchemaIdentifier: string,
		referer: string
	): Promise<(Partial<IeObject> & { collectionEntryCreatedAt: string }) | null> {
		const response = await this.dataService.execute<
			FindObjectInCollectionQuery,
			FindObjectInCollectionQueryVariables
		>(FindObjectInCollectionDocument, {
			collectionId,
			objectSchemaIdentifier,
		});

		/* istanbul ignore next */
		const foundObject = response?.users_folder_ie?.[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier} in ${collectionId}`);

		return this.adaptCollectionObjectLink(foundObject, referer);
	}

	public async findObjectBySchemaIdentifier(
		objectSchemaIdentifier: string
	): Promise<Partial<IeObject> | null> {
		const response = await this.dataService.execute<
			FindObjectBySchemaIdentifierQuery,
			FindObjectBySchemaIdentifierQueryVariables
		>(FindObjectBySchemaIdentifierDocument, {
			objectSchemaIdentifier,
		});
		const foundObject = response.object_ie[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier}`);

		return this.adaptIeObject(foundObject);
	}

	public async addObjectToCollection(
		collectionId: string,
		objectSchemaIdentifier: string,
		referer: string
	): Promise<Partial<IeObject> & { collectionEntryCreatedAt: string }> {
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

		const response = await this.dataService.execute<
			InsertObjectIntoCollectionMutation,
			InsertObjectIntoCollectionMutationVariables
		>(InsertObjectIntoCollectionDocument, {
			collectionId,
			objectSchemaIdentifier,
		});
		const createdObject = response.insert_users_folder_ie.returning[0];
		this.logger.debug(`Collection object ${objectSchemaIdentifier} created`);

		return this.adaptCollectionObjectLink(createdObject, referer);
	}

	public async removeObjectFromCollection(
		collectionId: string,
		objectSchemaIdentifier: string,
		userProfileId: string
	) {
		const response = await this.dataService.execute<
			RemoveObjectFromCollectionMutation,
			RemoveObjectFromCollectionMutationVariables
		>(RemoveObjectFromCollectionDocument, {
			collectionId,
			objectSchemaIdentifier,
			userProfileId,
		});
		this.logger.debug(`Collection object ${objectSchemaIdentifier} deleted`);

		return response.delete_users_folder_ie.affected_rows || 0;
	}
}
