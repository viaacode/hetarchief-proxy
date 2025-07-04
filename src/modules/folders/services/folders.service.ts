import { DataService } from '@meemoo/admin-core-api';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { format } from 'date-fns';
import { isEmpty, maxBy } from 'lodash';

import type {
	Folder,
	FolderObjectLink,
	GqlFolder,
	GqlFolderWithIeObjects,
	GqlObject,
	GqlUpdateFolder,
} from '../types';

import {
	FindFolderByIdDocument,
	type FindFolderByIdQuery,
	type FindFolderByIdQueryVariables,
	FindFolderIeObjectsByFolderIdDocument,
	type FindFolderIeObjectsByFolderIdQuery,
	type FindFolderIeObjectsByFolderIdQueryVariables,
	FindFoldersByUserDocument,
	type FindFoldersByUserQuery,
	type FindFoldersByUserQueryVariables,
	FindIeObjectBySchemaIdentifierDocument,
	type FindIeObjectBySchemaIdentifierQuery,
	type FindIeObjectBySchemaIdentifierQueryVariables,
	FindIeObjectInFolderDocument,
	type FindIeObjectInFolderQuery,
	type FindIeObjectInFolderQueryVariables,
	InsertFolderDocument,
	type InsertFolderMutation,
	type InsertFolderMutationVariables,
	InsertIeObjectIntoFolderDocument,
	type InsertIeObjectIntoFolderMutation,
	type InsertIeObjectIntoFolderMutationVariables,
	RemoveObjectFromFolderDocument,
	type RemoveObjectFromFolderMutation,
	type RemoveObjectFromFolderMutationVariables,
	SoftDeleteFolderDocument,
	type SoftDeleteFolderMutation,
	type SoftDeleteFolderMutationVariables,
	UpdateFolderDocument,
	type UpdateFolderMutation,
	type UpdateFolderMutationVariables,
	type Users_Folder_Ie_Bool_Exp,
} from '~generated/graphql-db-types-hetarchief';
import { FolderObjectsQueryDto } from '~modules/folders/dto/folders.dto';
import type { IeObject, IeObjectSector, IeObjectType } from '~modules/ie-objects/ie-objects.types';

import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';

import { VisitsService } from '~modules/visits/services/visits.service';
import { PaginationHelper } from '~shared/helpers/pagination';

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
	): Promise<Partial<IeObject> | undefined> {
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
			maintainerSlug: gqlIeObject?.schemaMaintainer?.visitorSpace?.slug,
			sector: (gqlIeObject?.schemaMaintainer?.ha_org_sector as IeObjectSector) || null,
			description: gqlIeObject?.schema_description,
			dctermsFormat: gqlIeObject?.dctermsFormat?.[0]?.dcterms_format as IeObjectType,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			meemooLocalId: gqlIeObject?.premisIdentifier?.[0]?.meemoo_local_id,
			name: gqlIeObject?.schema_name,
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

		let usedForLimitedAccessUntil: string | null = undefined;
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
			userProfileId: gqlFolder.user_profile_id,
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
	): Promise<(Partial<IeObject> & { folderEntryCreatedAt: string }) | undefined> {
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

	public async findFoldersByUser(
		userProfileId: string,
		referer: string,
		ip: string,
		page = 1,
		size = 1000
	): Promise<IPagination<Folder>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const foldersResponse = await this.dataService.execute<
			FindFoldersByUserQuery,
			FindFoldersByUserQueryVariables
		>(FindFoldersByUserDocument, {
			userProfileId,
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
		userProfileId: string,
		queryDto: FolderObjectsQueryDto,
		referer: string,
		ip: string
	): Promise<IPagination<Partial<IeObject> & { folderEntryCreatedAt: string }>> {
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
			userProfileId,
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
		userProfileId: string,
		folder: GqlUpdateFolder,
		referer: string,
		ip: string
	): Promise<Folder> {
		const response = await this.dataService.execute<
			UpdateFolderMutation,
			UpdateFolderMutationVariables
		>(UpdateFolderDocument, {
			folderId,
			userProfileId,
			folder,
		});

		const updatedFolder = response.update_users_folder.returning[0];

		return this.adaptFolder(updatedFolder, referer, ip);
	}

	public async delete(folderId: string, userProfileId: string): Promise<number> {
		const response = await this.dataService.execute<
			SoftDeleteFolderMutation,
			SoftDeleteFolderMutationVariables
		>(SoftDeleteFolderDocument, {
			folderId,
			userProfileId,
		});

		return response.update_users_folder.affected_rows;
	}

	public async findObjectInFolderById(
		folderId: string,
		ieObjectId: string,
		referer: string,
		ip: string
	): Promise<(Partial<IeObject> & { folderEntryCreatedAt: string }) | null> {
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

	public async findObjectById(
		ieObjectId: string,
		referer: string,
		ip: string
	): Promise<Partial<IeObject> | null> {
		const response = await this.dataService.execute<
			FindIeObjectBySchemaIdentifierQuery,
			FindIeObjectBySchemaIdentifierQueryVariables
		>(FindIeObjectBySchemaIdentifierDocument, {
			ieObjectId,
		});
		const foundObject = response.graph_intellectual_entity[0];

		return this.adaptIeObject(foundObject, referer, ip);
	}

	public async addObjectToFolder(
		folderId: string,
		ieObjectId: string,
		referer: string,
		ip: string
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		const folderObject = await this.findObjectInFolderById(folderId, ieObjectId, referer, ip);
		if (folderObject) {
			throw new BadRequestException({
				code: 'OBJECT_ALREADY_EXISTS',
				message: 'Object already exists in folder',
			});
		}

		const objectInfo = await this.findObjectById(ieObjectId, referer, ip);

		if (!objectInfo) {
			throw new NotFoundException(`Object with id ${ieObjectId} was not found`);
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

	public async removeObjectFromFolder(folderId: string, ieObjectId: string, userProfileId: string) {
		const response = await this.dataService.execute<
			RemoveObjectFromFolderMutation,
			RemoveObjectFromFolderMutationVariables
		>(RemoveObjectFromFolderDocument, {
			folderId,
			ieObjectId,
			userProfileId,
		});

		return response.delete_users_folder_ie.affected_rows || 0;
	}
}
