import { DataService, type IPagination, Pagination } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
	HetArchiefIeObject,
	type HetArchiefIeObjectSector,
	type HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { format } from 'date-fns';
import type { Request } from 'express';
import { isEmpty, maxBy } from 'lodash';
import {
	FindFolderByIdDocument,
	type FindFolderByIdQuery,
	type FindFolderByIdQueryVariables,
	FindFolderIeObjectsByFolderIdDocument,
	type FindFolderIeObjectsByFolderIdQuery,
	type FindFolderIeObjectsByFolderIdQueryVariables,
	FindFoldersForUserDocument,
	type FindFoldersForUserQuery,
	type FindFoldersForUserQueryVariables,
	FindIeObjectInFolderDocument,
	type FindIeObjectInFolderQuery,
	type FindIeObjectInFolderQueryVariables,
	InsertFolderDocument,
	type InsertFolderMutation,
	type InsertFolderMutationVariables,
	InsertIeObjectIntoFolderDocument,
	type InsertIeObjectIntoFolderMutation,
	type InsertIeObjectIntoFolderMutationVariables,
	InsertIeObjectsIntoFoldersDocument,
	type InsertIeObjectsIntoFoldersMutation,
	type InsertIeObjectsIntoFoldersMutationVariables,
	RemoveObjectFromFolderDocument,
	type RemoveObjectFromFolderMutation,
	type RemoveObjectFromFolderMutationVariables,
	SoftDeleteFolderDocument,
	type SoftDeleteFolderMutation,
	type SoftDeleteFolderMutationVariables,
	UpdateFolderDocument,
	type UpdateFolderMutation,
	type UpdateFolderMutationVariables,
	UpdateIeObjectsInFoldersDocument,
	type UpdateIeObjectsInFoldersMutation,
	type UpdateIeObjectsInFoldersMutationVariables,
	type Users_Folder_Bool_Exp,
	type Users_Folder_Ie_Bool_Exp,
} from '~generated/graphql-db-types-hetarchief';
import { FolderObjectsQueryDto } from '~modules/folders/dto/folders.dto';

import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { VisitsService } from '~modules/visits/services/visits.service';
import { getSchemaName } from '~shared/helpers/get-schema-name';
import { PaginationHelper } from '~shared/helpers/pagination';
import type {
	Folder,
	FolderObjectLink,
	GqlFolder,
	GqlFolderWithIeObjects,
	GqlObject,
	GqlUpdateFolder,
} from '../types';

@Injectable()
export class FoldersService {
	private logger: Logger = new Logger(FoldersService.name, { timestamp: true });

	constructor(
		private dataService: DataService,
		private visitsService: VisitsService,
		private ieObjectsService: IeObjectsService
	) {}

	// TODO make resolving of thumbnails of items in folder optional
	// To increase the speed of the search page
	public async adaptIeObject(
		gqlIeObject: GqlObject | undefined,
		referer: string,
		ip: string
	): Promise<Partial<HetArchiefIeObject> | undefined> {
		if (!gqlIeObject) {
			return undefined;
		}

		const thumbnailUrl: string | undefined = await this.ieObjectsService.getThumbnailUrlWithToken(
			gqlIeObject?.schemaThumbnail?.schema_thumbnail_url?.[0],
			referer,
			ip
		);

		/* istanbul ignore next */
		return {
			iri: gqlIeObject?.id,
			schemaIdentifier: gqlIeObject?.schema_identifier, // Unique for each object
			maintainerId: gqlIeObject?.schemaMaintainer?.org_identifier,
			maintainerName: gqlIeObject?.schemaMaintainer?.skos_pref_label,
			maintainerSlug: gqlIeObject?.schemaMaintainer?.organizationSlug?.slug,
			sector: (gqlIeObject?.schemaMaintainer?.ha_org_sector as HetArchiefIeObjectSector) || null,
			description: gqlIeObject?.schema_description,
			dctermsFormat: gqlIeObject?.dctermsFormat?.[0]?.dcterms_format as HetArchiefIeObjectType,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			meemooLocalId: gqlIeObject?.premisIdentifier?.[0]?.meemoo_local_id,
			name: getSchemaName(gqlIeObject),
			thumbnailUrl,
			datePublished: gqlIeObject?.schema_date_published || null,
			duration: gqlIeObject?.schemaDuration?.schema_duration || null,
			licenses: gqlIeObject?.schemaLicense?.schema_license || null,
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
	 * Adapt a folder as returned by a typical graphQl response to our internal folder data model
	 */
	public async adaptFolder(
		gqlFolder: GqlFolder | undefined,
		referer: string,
		ip: string
	): Promise<Folder | undefined> {
		if (!gqlFolder) {
			return undefined;
		}

		let usedForLimitedAccessUntil: string | null;
		try {
			const visitsWithFolders: Date[] = await this.visitsService.findEndDatesByFolderId(
				gqlFolder.id
			);
			usedForLimitedAccessUntil = this.getLastEndAtDate(visitsWithFolders);
		} catch (error) {
			this.logger.error(`Visits by folder id ${gqlFolder.id} could not be retrieved`);
		}

		/* istanbul ignore next */
		return {
			id: gqlFolder.id,
			name: gqlFolder.name,
			description: gqlFolder.description,
			userProfileId: gqlFolder.user_profile_id || null,
			ownerOrganisationId: gqlFolder.owner_organisation_id || null,
			createdAt: gqlFolder.created_at,
			updatedAt: gqlFolder.updated_at,
			isDefault: gqlFolder.is_default,
			usedForLimitedAccessUntil: usedForLimitedAccessUntil || null,
			objects: await Promise.all(
				(gqlFolder as GqlFolderWithIeObjects).intellectualEntities
					? (gqlFolder as GqlFolderWithIeObjects).intellectualEntities.map((object) =>
							this.adaptFolderObjectLink(object, referer, ip)
						)
					: []
			),
		};
	}

	public async adaptFolderObjectLink(
		gqlFolderObjectLink: FolderObjectLink | undefined,
		referer: string,
		ip: string
	): Promise<(Partial<HetArchiefIeObject> & { folderEntryCreatedAt: string }) | undefined> {
		if (!gqlFolderObjectLink) {
			return undefined;
		}

		/* istanbul ignore next */
		// TODO: add union type
		const objectIe = await this.adaptIeObject(
			gqlFolderObjectLink?.intellectualEntity as GqlObject,
			referer,
			ip
		);
		if (!objectIe) {
			return null;
			// TODO in a future version see if we want to show a card that this item is no longer available
			// return {
			// 	id: gqlFolderObjectLink.ie_object_id,
			// };
		}
		return {
			folderEntryCreatedAt: gqlFolderObjectLink?.created_at,
			...objectIe,
		};
	}

	/**
	 * Find the personal folders of the user and the organisation folders the user has access to
	 * @param folderOwnerWhere filter on the owner of the folders, see getFolderOwnerFilter()
	 */
	public async findFoldersForUser(
		folderOwnerWhere: Users_Folder_Bool_Exp,
		referer: string,
		ip: string,
		page = 1,
		size = 1000
	): Promise<IPagination<Folder>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const foldersResponse = await this.dataService.execute<
			FindFoldersForUserQuery,
			FindFoldersForUserQueryVariables
		>(FindFoldersForUserDocument, {
			where: folderOwnerWhere,
			offset,
			limit,
		});

		return Pagination<Folder>({
			items: await Promise.all(
				foldersResponse.users_folder.map((folder: any) => this.adaptFolder(folder, referer, ip))
			),
			page,
			size,
			total: foldersResponse.users_folder_aggregate.aggregate.count,
		});
	}

	public async findFolderById(folderId: string, referer: string, ip: string): Promise<Folder> {
		const folderResponse = await this.dataService.execute<
			FindFolderByIdQuery,
			FindFolderByIdQueryVariables
		>(FindFolderByIdDocument, {
			folderId,
		});

		return this.adaptFolder(folderResponse.users_folder[0], referer, ip);
	}

	public async findObjectsByFolderId(
		folderId: string,
		folderOwnerWhere: Users_Folder_Bool_Exp,
		queryDto: FolderObjectsQueryDto,
		referer: string,
		ip: string
	): Promise<IPagination<Partial<HetArchiefIeObject> & { folderEntryCreatedAt: string }>> {
		const { query, page, size } = queryDto;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		let where: Users_Folder_Ie_Bool_Exp = {};
		if (query) {
			where = {
				_or: [
					{ intellectualEntity: { schema_name: { _ilike: query } } },
					{
						intellectualEntity: {
							schemaMaintainer: { skos_pref_label: { _ilike: query } },
						},
					},
					{
						intellectualEntity: {
							dctermsFormat: { dcterms_format: { _ilike: query } },
						},
					},
					{ intellectualEntity: { schema_identifier: { _ilike: query } } },
					{
						intellectualEntity: {
							schemaIsPartOf: {
								type: { _eq: 'serie' },
								collection: { schema_name: { _ilike: query } },
							},
						},
					},
					{
						intellectualEntity: {
							schemaIsPartOf: {
								type: { _eq: 'program' },
								collection: { schema_name: { _ilike: query } },
							},
						},
					},
				],
			};
		}
		const folderObjectsResponse = await this.dataService.execute<
			FindFolderIeObjectsByFolderIdQuery,
			FindFolderIeObjectsByFolderIdQueryVariables
		>(FindFolderIeObjectsByFolderIdDocument, {
			folderId,
			folderOwnerWhere,
			where,
			offset,
			limit,
		});
		const total = folderObjectsResponse.users_folder_ie_aggregate.aggregate.count;
		return {
			items: await Promise.all(
				folderObjectsResponse.users_folder_ie.map((folderObject) =>
					this.adaptFolderObjectLink(folderObject, referer, ip)
				)
			),
			page,
			size,
			total,
			pages: Math.ceil(total / size),
		};
	}

	public async create(
		folder: InsertFolderMutationVariables['object'],
		referer: string,
		ip: string
	): Promise<Folder> {
		const response = await this.dataService.execute<
			InsertFolderMutation,
			InsertFolderMutationVariables
		>(InsertFolderDocument, {
			object: folder,
		});
		const createdFolder = response.insert_users_folder.returning[0];

		return this.adaptFolder(createdFolder, referer, ip);
	}

	public async update(
		folderId: string,
		folderOwnerWhere: Users_Folder_Bool_Exp,
		folder: GqlUpdateFolder,
		referer: string,
		ip: string
	): Promise<Folder> {
		const response = await this.dataService.execute<
			UpdateFolderMutation,
			UpdateFolderMutationVariables
		>(UpdateFolderDocument, {
			folderId,
			folderOwnerWhere,
			folder,
		});

		const updatedFolder = response.update_users_folder.returning[0];

		return this.adaptFolder(updatedFolder, referer, ip);
	}

	public async delete(folderId: string, folderOwnerWhere: Users_Folder_Bool_Exp): Promise<number> {
		const response = await this.dataService.execute<
			SoftDeleteFolderMutation,
			SoftDeleteFolderMutationVariables
		>(SoftDeleteFolderDocument, {
			folderId,
			folderOwnerWhere,
		});

		return response.update_users_folder.affected_rows;
	}

	public async findObjectInFolderById(
		folderId: string,
		ieObjectId: string,
		referer: string,
		ip: string
	): Promise<(Partial<HetArchiefIeObject> & { folderEntryCreatedAt: string }) | null> {
		const response = await this.dataService.execute<
			FindIeObjectInFolderQuery,
			FindIeObjectInFolderQueryVariables
		>(FindIeObjectInFolderDocument, {
			folderId,
			ieObjectId,
		});

		/* istanbul ignore next */
		const foundObject = response?.users_folder_ie?.[0];

		return this.adaptFolderObjectLink(foundObject, referer, ip);
	}

	public async addObjectToFolder(
		folderId: string,
		ieObjectId: string,
		referer: string,
		ip: string
	): Promise<Partial<HetArchiefIeObject> & { folderEntryCreatedAt: string }> {
		const folderObject = await this.findObjectInFolderById(folderId, ieObjectId, referer, ip);
		if (folderObject) {
			throw new BadRequestException({
				code: 'OBJECT_ALREADY_EXISTS',
				message: 'Object already exists in folder',
			});
		}

		const objectInfo = await this.ieObjectsService.findByIeObjectId(ieObjectId, false, referer, ip);

		if (!objectInfo) {
			throw new CustomError(
				'Object with id was not found',
				null,
				{
					folderId,
					ieObjectId,
				},
				404
			);
		}

		const response = await this.dataService.execute<
			InsertIeObjectIntoFolderMutation,
			InsertIeObjectIntoFolderMutationVariables
		>(InsertIeObjectIntoFolderDocument, {
			folderId,
			ieObjectId,
		});
		const createdObject = response.insert_users_folder_ie.returning[0];

		return {
			folderEntryCreatedAt: createdObject.created_at,
			...objectInfo,
		};
	}

	public async removeObjectFromFolder(
		folderId: string,
		ieObjectId: string,
		folderOwnerWhere: Users_Folder_Bool_Exp
	) {
		const response = await this.dataService.execute<
			RemoveObjectFromFolderMutation,
			RemoveObjectFromFolderMutationVariables
		>(RemoveObjectFromFolderDocument, {
			folderId,
			ieObjectId,
			folderOwnerWhere,
		});

		return response.delete_users_folder_ie.affected_rows || 0;
	}

	/**
	 * Add all objects to all folders in one transaction
	 * Objects that are already in a folder are ignored, so retrying the same request is safe
	 * The caller is responsible for checking that the user has access to the folders
	 * @return the number of (folder, object) links that were newly created
	 */
	public async addObjectsToFolders(folderIds: string[], ieObjectIds: string[]): Promise<number> {
		const uniqueFolderIds = [...new Set(folderIds)];
		const uniqueIeObjectIds = [...new Set(ieObjectIds)];
		if (!uniqueFolderIds.length || !uniqueIeObjectIds.length) {
			return 0;
		}

		const response = await this.dataService.execute<
			InsertIeObjectsIntoFoldersMutation,
			InsertIeObjectsIntoFoldersMutationVariables
		>(InsertIeObjectsIntoFoldersDocument, {
			objects: uniqueFolderIds.flatMap((folderId) =>
				uniqueIeObjectIds.map((ieObjectId) => ({
					user_collection_id: folderId,
					ie_object_id: ieObjectId,
				}))
			),
		});

		// The insert ignores conflicts (update_columns: []), so `returning` only contains rows that were newly inserted
		return response.insert_users_folder_ie.returning.length;
	}

	/**
	 * Add all objects to some folders and remove them from other folders in one transaction
	 * Objects that are already in a folder are ignored, so retrying the same request is safe
	 * The caller is responsible for checking that the user has access to the folders
	 * @return the number of (folder, object) links that were newly created and the number that were removed
	 */
	public async updateObjectsInFolders(
		addToFolderIds: string[],
		removeFromFolderIds: string[],
		ieObjectIds: string[],
		folderOwnerWhere: Users_Folder_Bool_Exp
	): Promise<{ addedCount: number; removedCount: number }> {
		const uniqueAddToFolderIds = [...new Set(addToFolderIds)];
		const uniqueRemoveFromFolderIds = [...new Set(removeFromFolderIds)];
		const uniqueIeObjectIds = [...new Set(ieObjectIds)];
		if (
			(!uniqueAddToFolderIds.length && !uniqueRemoveFromFolderIds.length) ||
			!uniqueIeObjectIds.length
		) {
			return { addedCount: 0, removedCount: 0 };
		}

		// Hasura runs all root fields of one mutation in a single transaction
		// An empty insert or an empty _in filter does not touch any rows
		const response = await this.dataService.execute<
			UpdateIeObjectsInFoldersMutation,
			UpdateIeObjectsInFoldersMutationVariables
		>(UpdateIeObjectsInFoldersDocument, {
			objectsToInsert: uniqueAddToFolderIds.flatMap((folderId) =>
				uniqueIeObjectIds.map((ieObjectId) => ({
					user_collection_id: folderId,
					ie_object_id: ieObjectId,
				}))
			),
			removeFromFolderIds: uniqueRemoveFromFolderIds,
			ieObjectIds: uniqueIeObjectIds,
			folderOwnerWhere,
		});

		return {
			// The insert ignores conflicts (update_columns: []), so `returning` only contains rows that were newly inserted
			addedCount: response.insert_users_folder_ie?.returning.length || 0,
			removedCount: response.delete_users_folder_ie?.affected_rows || 0,
		};
	}
}
