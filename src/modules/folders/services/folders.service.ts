import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { format } from 'date-fns';
import { isEmpty, maxBy } from 'lodash';

import {
	type Folder,
	type FolderObjectLink,
	type GqlFolder,
	type GqlFolderWithIeObjects,
	type GqlObject,
	type GqlUpdateFolder,
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
import { type FolderObjectsQueryDto } from '~modules/folders/dto/folders.dto';
import {
	type IeObject,
	type IeObjectSector,
	type IeObjectType,
} from '~modules/ie-objects/ie-objects.types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class FoldersService {
	private logger: Logger = new Logger(FoldersService.name, { timestamp: true });

	constructor(
		private dataService: DataService,
		protected playerTicketService: PlayerTicketService,
		protected visitsService: VisitsService
	) {}

	public adaptIeObject(gqlIeObject: GqlObject | undefined): Partial<IeObject> | undefined {
		if (!gqlIeObject) {
			return undefined;
		}

		/* istanbul ignore next */
		return {
			maintainerId: gqlIeObject?.schemaMaintainer?.org_identifier,
			maintainerName: gqlIeObject?.schemaMaintainer?.skos_pref_label,
			maintainerSlug: gqlIeObject?.schemaMaintainer?.visitorSpace?.slug,
			sector: (gqlIeObject?.schemaMaintainer?.ha_org_sector as IeObjectSector) || null,
			creator: gqlIeObject?.schema_creator?.[0],
			description: gqlIeObject?.schema_description,
			dctermsFormat: gqlIeObject?.dcterms_format as IeObjectType,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			schemaIdentifier: gqlIeObject?.schema_identifier, // Unique for each object
			meemooLocalId: gqlIeObject?.meemoo_local_id?.[0],
			name: gqlIeObject?.schema_name,
			numberOfPages: gqlIeObject?.schema_number_of_pages,
			thumbnailUrl: gqlIeObject?.schema_thumbnail_url?.[0] || null,
			isPartOf: gqlIeObject?.schema_is_part_of || null,
			datePublished: gqlIeObject?.schema_date_published || null,
			dateCreated: gqlIeObject?.schema_date_created || null,
			duration: gqlIeObject?.schema_duration || null,
			licenses: gqlIeObject?.schema_license || null,
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
			this.logger.debug(`Visits by folder id ${gqlFolder.id} could not be retrieved`);
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
		const objectIe = this.adaptIeObject(gqlFolderObjectLink?.intellectualEntity as GqlObject);
		if (!objectIe) {
			return null;
		}
		const resolvedThumbnailUrl: string = await this.playerTicketService.resolveThumbnailUrl(
			objectIe?.thumbnailUrl,
			referer,
			ip
		);
		return {
			folderEntryCreatedAt: gqlFolderObjectLink?.created_at,
			...objectIe,
			thumbnailUrl: resolvedThumbnailUrl,
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
				foldersResponse.users_folder.map((folder: any) =>
					this.adaptFolder(folder, referer, ip)
				)
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
					{ intellectualEntity: { dcterms_format: { _ilike: query } } },
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
		if (isEmpty(folderObjectsResponse.users_folder_ie)) {
			throw new NotFoundException();
		}
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
		this.logger.debug(`Folder ${createdFolder.id} created`);

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
		this.logger.debug(`Folder ${updatedFolder.id} updated`);

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
		this.logger.debug(`Folder ${folderId} deleted`);

		return response.update_users_folder.affected_rows;
	}

	public async findObjectInFolderBySchemaIdentifier(
		folderId: string,
		objectSchemaIdentifier: string,
		referer: string,
		ip: string
	): Promise<(Partial<IeObject> & { folderEntryCreatedAt: string }) | null> {
		const response = await this.dataService.execute<
			FindIeObjectInFolderQuery,
			FindIeObjectInFolderQueryVariables
		>(FindIeObjectInFolderDocument, {
			folderId,
			objectSchemaIdentifier,
		});

		/* istanbul ignore next */
		const foundObject = response?.users_folder_ie?.[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier} in ${folderId}`);

		return this.adaptFolderObjectLink(foundObject, referer, ip);
	}

	public async findObjectBySchemaIdentifier(
		objectSchemaIdentifier: string
	): Promise<Partial<IeObject> | null> {
		const response = await this.dataService.execute<
			FindIeObjectBySchemaIdentifierQuery,
			FindIeObjectBySchemaIdentifierQueryVariables
		>(FindIeObjectBySchemaIdentifierDocument, {
			objectSchemaIdentifier,
		});
		const foundObject = response.graph__intellectual_entity[0];
		this.logger.debug(`Found object ${objectSchemaIdentifier}`);

		return this.adaptIeObject(foundObject);
	}

	public async addObjectToFolder(
		folderId: string,
		ieObjectSchemaIdentifier: string,
		referer: string,
		ip: string
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		const folderObject = await this.findObjectInFolderBySchemaIdentifier(
			folderId,
			ieObjectSchemaIdentifier,
			referer,
			ip
		);
		if (folderObject) {
			throw new BadRequestException({
				code: 'OBJECT_ALREADY_EXISTS',
				message: 'Object already exists in folder',
			});
		}

		const objectInfo = await this.findObjectBySchemaIdentifier(ieObjectSchemaIdentifier);

		if (!objectInfo) {
			throw new NotFoundException(
				`Object with schema identifier ${ieObjectSchemaIdentifier} was not found`
			);
		}

		const response = await this.dataService.execute<
			InsertIeObjectIntoFolderMutation,
			InsertIeObjectIntoFolderMutationVariables
		>(InsertIeObjectIntoFolderDocument, {
			folderId,
			ieObjectSchemaIdentifier,
		});
		const createdObject = response.insert_users_folder_ie.returning[0];
		this.logger.debug(`Folder object ${ieObjectSchemaIdentifier} created`);

		return this.adaptFolderObjectLink(createdObject, referer, ip);
	}

	public async removeObjectFromFolder(
		folderId: string,
		objectSchemaIdentifier: string,
		userProfileId: string
	) {
		const response = await this.dataService.execute<
			RemoveObjectFromFolderMutation,
			RemoveObjectFromFolderMutationVariables
		>(RemoveObjectFromFolderDocument, {
			folderId,
			objectSchemaIdentifier,
			userProfileId,
		});
		this.logger.debug(`Folder object ${objectSchemaIdentifier} deleted`);

		return response.delete_users_folder_ie.affected_rows || 0;
	}
}
