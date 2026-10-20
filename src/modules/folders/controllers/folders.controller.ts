import { type IPagination, Pagination } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HetArchiefIeObject, HetArchiefIeObjectLicense, PermissionName } from '@viaa/avo2-types';
import type { Request } from 'express';
import { compact, isNil, noop } from 'lodash';
import {
	ConsentToTrackOption,
	EmailTemplate,
} from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import {
	AddObjectsToFoldersDto,
	CreateFolderDto,
	CreateOrUpdateFolderDto,
	FolderObjectsQueryDto,
} from '~modules/folders/dto/folders.dto';
import {
	canWriteToFolder,
	getFolderOrganisationId,
	getFolderOwnerFilter,
} from '~modules/folders/helpers/folder-access';
import { FoldersService } from '~modules/folders/services/folders.service';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { customError } from '~shared/helpers/custom-error';
import { EventsHelper } from '~shared/helpers/events';
import { Locale } from '~shared/types/types';
import {
	type AddObjectsToFoldersResult,
	type Folder,
	type FolderShared,
	FolderStatus,
} from '../types';

@ApiTags('Folders')
@Controller('folders') // TODO rename this to folders, and also change this in the client
export class FoldersController {
	constructor(
		private foldersService: FoldersService,
		private eventsService: EventsService,
		private ieObjectsService: IeObjectsService,
		private campaignMonitorService: CampaignMonitorService,
		private userService: UsersService
	) {}

	@Get()
	public async getFolders(
		@Referer() referer: string,
		@Ip() ip: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Folder>> {
		// For Anonymous users, it should return an empty array
		if (isNil(user?.getId())) {
			return Pagination<Folder>({
				items: [],
				page: 1,
				size: 10,
				total: 0,
			});
		}

		// Personal folders and, for users with the MANAGE_ORGANISATION_FOLDERS permission, the organisation folders
		const folders = await this.foldersService.findFoldersForUser(
			getFolderOwnerFilter(user.getId(), getFolderOrganisationId(user)),
			referer,
			ip,
			1,
			1000
		);

		// Limit access to the objects in the folders
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		for (const folder of folders.items) {
			folder.objects = compact(
				(folder.objects ?? []).map((object) => {
					if (!object) {
						return undefined; // ieObject in folder no longer exists
					}
					return this.ieObjectsService.limitObjectInFolder(object, user, visitorSpaceAccessInfo);
				})
			);
		}

		return folders;
	}

	@Get(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async getFolderObjects(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId', ParseUUIDPipe) folderId: string,
		@Query() queryDto: FolderObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<HetArchiefIeObject>>> {
		await this.getWritableFolder(folderId, user, referer, ip, 'You can only view your own folders');

		const folderObjects: IPagination<Partial<HetArchiefIeObject>> =
			await this.foldersService.findObjectsByFolderId(
				folderId,
				getFolderOwnerFilter(user.getId(), getFolderOrganisationId(user)),
				queryDto,
				referer,
				ip
			);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const isKeyUser = user.getIsKeyUser();

		// Limit access to the objects in the collection:
		// https://meemoo.atlassian.net/browse/ARC-1834
		folderObjects.items = (folderObjects.items ?? [])
			.filter((object) => {
				if (!object) {
					console.error(
						customError('Folder object returned null', null, {
							object,
							folderId: folderId,
						})
					);
					return false; // ieObject in folder no longer exists
				}
				// if user is no keyUser AND object has ONLY license INTRA_CP-CONTENT AND/OR INTRA_CP-METADATA_ALL, do not show object
				const hasOnlyIntraCpLicenses =
					(object.licenses || [])
						// Filter the licenses to only the ones we care about inside hetarchief.be. eg we don't care about VIAA-ONDERZOEK or VIAA-ONDERWIJS
						.filter((license) => Object.values(HetArchiefIeObjectLicense).includes(license))
						// Check if all relevant licenses are intra cp licenses
						.filter(
							(license) =>
								![
									HetArchiefIeObjectLicense.INTRA_CP_CONTENT,
									HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
								].includes(license)
						).length === 0;
				if (!isKeyUser && hasOnlyIntraCpLicenses) {
					return false;
				}
				// Return true for all the rest
				return true;
			})
			.map((object) => {
				return this.ieObjectsService.limitObjectInFolder(object, user, visitorSpaceAccessInfo);
			});

		return folderObjects;
	}

	@Post()
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async createFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Body() createFolderDto: CreateFolderDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Folder> {
		let owner: { user_profile_id: string | null; owner_organisation_id: string | null } = {
			user_profile_id: user?.getId(),
			owner_organisation_id: null,
		};
		if (createFolderDto.isOrganisation) {
			if (!user.has(PermissionName.MANAGE_ORGANISATION_FOLDERS)) {
				throw new ForbiddenException('You are not allowed to create organisation folders');
			}
			const organisationId = getFolderOrganisationId(user);
			if (!organisationId) {
				throw new BadRequestException(
					'You need to be linked to an organisation to create organisation folders'
				);
			}
			owner = { user_profile_id: null, owner_organisation_id: organisationId };
		}

		return this.foldersService.create(
			{
				name: createFolderDto.name,
				description: createFolderDto.description,
				...owner,
				is_default: false,
			},
			referer,
			ip
		);
	}

	@Patch(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async updateFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@Body() updateFolderDto: CreateOrUpdateFolderDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Folder> {
		await this.getWritableFolder(folderId, user, referer, ip, 'You can only edit your own folders');

		return await this.foldersService.update(
			folderId,
			getFolderOwnerFilter(user.getId(), getFolderOrganisationId(user)),
			{
				name: updateFolderDto.name,
				description: updateFolderDto.description,
			},
			referer,
			ip
		);
	}

	@Delete(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async deleteFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		await this.getWritableFolder(
			folderId,
			user,
			referer,
			ip,
			'You can only delete your own folders'
		);

		const affectedRows = await this.foldersService.delete(
			folderId,
			getFolderOwnerFilter(user.getId(), getFolderOrganisationId(user))
		);
		if (affectedRows > 0) {
			return { status: 'the folder has been deleted' };
		}
		return { status: 'no folders found with that id' };
	}

	@Post(':folderId/objects/:objectSchemaIdentifier')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async addObjectToFolder(
		@Req() request: Request,
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@Param('objectSchemaIdentifier') objectSchemaIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<HetArchiefIeObject> & { folderEntryCreatedAt: string }> {
		await this.getWritableFolder(
			folderId,
			user,
			referer,
			ip,
			'You can only add objects to your own folders'
		);

		const ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
			objectSchemaIdentifier,
			request
		);

		const folderObject = await this.foldersService.addObjectToFolder(
			folderId,
			ieObjectId,
			referer,
			ip
		);

		// Log event
		const ieObject = await this.ieObjectsService.findByIeObjectId(ieObjectId, false, referer, ip);
		this.eventsService
			.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: LogEventType.ITEM_BOOKMARK,
					source: request.path,
					subject: user?.getId(),
					time: new Date().toISOString(),
					data: {
						type: mapDcTermsFormatToSimpleType(ieObject.dctermsFormat),
						pid: ieObject.schemaIdentifier,
						fragment_id: objectSchemaIdentifier,
						folder_id: folderId,
						or_id: ieObject.maintainerId,
						...this.eventsService.mapUserToEventData(user?.getUser()),
					},
				},
			])
			.then(noop);

		return folderObject;
	}

	@Delete(':folderId/objects/:objectSchemaIdentifier')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async removeObjectFromFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@Param('objectSchemaIdentifier') objectSchemaIdentifier: string,
		@SessionUser() user: SessionUserEntity,
		@Req() request: Request
	): Promise<{ status: string }> {
		await this.getWritableFolder(
			folderId,
			user,
			referer,
			ip,
			'You can only delete objects from your own folders'
		);

		const ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
			objectSchemaIdentifier,
			request
		);

		const affectedRows = await this.foldersService.removeObjectFromFolder(
			folderId,
			ieObjectId,
			getFolderOwnerFilter(user.getId(), getFolderOrganisationId(user))
		);
		if (affectedRows > 0) {
			return { status: 'the object has been deleted' };
		}
		return { status: 'no object found with that id in that folder' };
	}

	@Patch(':oldFolderId/objects/:objectSchemaIdentifier/move')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async moveObjectToAnotherFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('oldFolderId') oldFolderId: string,
		@Param('objectSchemaIdentifier') objectSchemaIdentifier: string,
		@Query('newFolderId') newFolderId: string,
		@SessionUser() user: SessionUserEntity,
		@Req() request: Request
	): Promise<Partial<HetArchiefIeObject> & { folderEntryCreatedAt: string }> {
		// Check user has access to both folders
		await Promise.all([
			this.getWritableFolder(
				oldFolderId,
				user,
				referer,
				ip,
				'You can only move objects from your own folders'
			),
			this.getWritableFolder(
				newFolderId,
				user,
				referer,
				ip,
				'You can only move objects to your own folders'
			),
		]);

		const ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
			objectSchemaIdentifier,
			request
		);

		const folderObject = await this.foldersService.addObjectToFolder(
			newFolderId,
			ieObjectId,
			referer,
			ip
		);
		await this.foldersService.removeObjectFromFolder(
			oldFolderId,
			ieObjectId,
			getFolderOwnerFilter(user.getId(), getFolderOrganisationId(user))
		);
		return folderObject;
	}

	/**
	 * Add multiple objects to multiple folders at once, eg: from the multiselect on the search page
	 * Objects that are already in a folder are skipped, so the request can safely be retried
	 */
	@Post('objects')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async addObjectsToFolders(
		@Req() request: Request,
		@Referer() referer: string,
		@Ip() ip: string,
		@Body() addObjectsToFoldersDto: AddObjectsToFoldersDto,
		@SessionUser() user: SessionUserEntity
	): Promise<AddObjectsToFoldersResult> {
		const folderIds = [...new Set(addObjectsToFoldersDto.folderIds)];
		const objectSchemaIdentifiers = [...new Set(addObjectsToFoldersDto.objectSchemaIdentifiers)];

		// Check the user has access to all folders before inserting anything
		await Promise.all(
			folderIds.map((folderId) =>
				this.getWritableFolder(
					folderId,
					user,
					referer,
					ip,
					'You can only add objects to your own folders'
				)
			)
		);

		// Objects that no longer exist are skipped, instead of failing the whole selection
		const resolvedIeObjectIds = await Promise.all(
			objectSchemaIdentifiers.map((objectSchemaIdentifier) =>
				this.ieObjectsService
					.getIeObjectIdFromObjectSchemaIdentifier(objectSchemaIdentifier, request)
					.catch((): null => null)
			)
		);
		const notFoundSchemaIdentifiers = objectSchemaIdentifiers.filter(
			(_, index) => !resolvedIeObjectIds[index]
		);
		const ieObjectIds = compact(resolvedIeObjectIds);
		if (!ieObjectIds.length) {
			throw new NotFoundException({
				message: 'None of the objects were found',
				notFoundSchemaIdentifiers,
			});
		}

		const addedCount = await this.foldersService.addObjectsToFolders(folderIds, ieObjectIds);

		// Log one bookmark event per (object, folder) pair, without delaying the response
		this.logBookmarkEvents(request, user, folderIds, ieObjectIds, referer, ip).then(noop);

		return {
			folderIds,
			objectSchemaIdentifiers: objectSchemaIdentifiers.filter(
				(objectSchemaIdentifier) => !notFoundSchemaIdentifiers.includes(objectSchemaIdentifier)
			),
			notFoundSchemaIdentifiers,
			addedCount,
		};
	}

	/**
	 * Create an invitation to receive a shared folder
	 * @param referer
	 * @param ip
	 * @param emailInfo
	 * @param folderId
	 * @param user
	 */
	@Post('/share/:folderId/create')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async createSharedFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Body() emailInfo: { to: string },
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ message: 'success' }> {
		const folder = await this.getWritableFolder(
			folderId,
			user,
			referer,
			ip,
			'You can only share your own folders'
		);
		if (folder.ownerOrganisationId) {
			throw new BadRequestException('Organisation folders cannot be shared');
		}

		// If the "to" user already exists we take their preferred language otherwise we take the language of the person who is sending the "share folder" email
		const toUser = await this.userService.getUserByEmail(emailInfo.to);

		const preferredLang = toUser ? toUser.language : user.getLanguage() || Locale.Nl;

		const shareUrl = {
			nl: `${process.env.CLIENT_HOST}/account/map-delen/${folderId}`,
			en: `${process.env.CLIENT_HOST}/account/share-folder/${folderId}`,
		};
		await this.campaignMonitorService.sendTransactionalMail(
			{
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_SHARE_FOLDER,
				data: {
					to: emailInfo.to,
					replyTo: user.getMail(),
					consentToTrack: ConsentToTrackOption.UNCHANGED,
					data: {
						sharer_email: user.getMail(),
						sharer_name: user.getFullName(),
						folder_name: folder.name,
						folder_sharelink: shareUrl[preferredLang],
						user_hasaccount: !!toUser,
						user_firstname: '',
					},
				},
			},
			preferredLang
		);

		return { message: 'success' };
	}

	/**
	 * Accept a folder invite and copy the shared folder to the current user
	 * @param referer
	 * @param ip
	 * @param folderId
	 * @param user
	 */
	@Post('/share/:folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(PermissionName.MANAGE_FOLDERS)
	public async acceptSharedFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<FolderShared> {
		const folder = await this.foldersService.findFolderById(folderId, referer, ip);

		if (!folder) {
			throw new NotFoundException('The shared folder was not found');
		}

		if (folder.ownerOrganisationId) {
			throw new BadRequestException('Organisation folders cannot be shared');
		}

		if (folder.userProfileId === user?.getId()) {
			return {
				status: FolderStatus.ALREADY_OWNER,
				folderId: folder.id,
				folderName: folder?.name,
			};
		}

		const createdFolder = await this.foldersService.create(
			{
				name: folder?.name,
				user_profile_id: user?.getId(),
				is_default: false,
			},
			referer,
			ip
		);

		// Get all the objects from the original collection and add them to the new collection
		let folderObjects: IPagination<Partial<HetArchiefIeObject>>;
		try {
			folderObjects = await this.foldersService.findObjectsByFolderId(
				folderId,
				getFolderOwnerFilter(folder.userProfileId, null),
				{ size: 1000 },
				referer,
				ip
			);
			const itemsWithoutIri = (folderObjects?.items ?? []).filter((item) => !item?.iri);
			if (itemsWithoutIri.length) {
				console.error(
					new CustomError(
						'Failed to add some objects to accepted shared folder, since the iri is missing',
						null,
						{
							folderId,
							profileId: user?.getId(),
							items: itemsWithoutIri,
						}
					)
				);
			}
			await this.foldersService.addObjectsToFolders(
				[createdFolder.id],
				compact((folderObjects?.items ?? []).map((item) => item?.iri))
			);
		} catch (err) {
			if (err?.name !== 'NotFoundException') {
				throw new InternalServerErrorException({
					message: 'Failed to add object from original folder to shared folder',
					error: err,
				});
			}
		}

		return {
			status: FolderStatus.ADDED,
			folderId: createdFolder?.id,
			folderName: createdFolder?.name,
		};
	}

	/**
	 * Fetch the folder and check the user can read and write it (personal folder of the user or organisation folder of their organisation)
	 */
	private async getWritableFolder(
		folderId: string,
		user: SessionUserEntity,
		referer: string,
		ip: string,
		forbiddenMessage: string
	): Promise<Folder> {
		const folder = await this.foldersService.findFolderById(folderId, referer, ip);
		if (!folder) {
			throw new NotFoundException('Folder not found');
		}
		if (!canWriteToFolder(folder, user)) {
			throw new ForbiddenException(forbiddenMessage);
		}
		return folder;
	}

	private async logBookmarkEvents(
		request: Request,
		user: SessionUserEntity,
		folderIds: string[],
		ieObjectIds: string[],
		referer: string,
		ip: string
	): Promise<void> {
		try {
			const ieObjects = await Promise.all(
				ieObjectIds.map((ieObjectId) =>
					this.ieObjectsService.findByIeObjectId(ieObjectId, false, referer, ip)
				)
			);
			await this.eventsService.insertEvents(
				compact(ieObjects).flatMap((ieObject) =>
					folderIds.map((folderId) => ({
						id: EventsHelper.getEventId(request),
						type: LogEventType.ITEM_BOOKMARK,
						source: request.path,
						subject: user?.getId(),
						time: new Date().toISOString(),
						data: {
							type: mapDcTermsFormatToSimpleType(ieObject.dctermsFormat),
							pid: ieObject.schemaIdentifier,
							fragment_id: ieObject.schemaIdentifier,
							folder_id: folderId,
							or_id: ieObject.maintainerId,
							...this.eventsService.mapUserToEventData(user?.getUser()),
						},
					}))
				)
			);
		} catch (err) {
			console.error(
				customError('Failed to log bookmark events for adding objects to folders', err, {
					folderIds,
					ieObjectIds,
				})
			);
		}
	}
}
