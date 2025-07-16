import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	InternalServerErrorException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import * as promiseUtils from 'blend-promise-utils';
import type { Request } from 'express';
import { compact, isNil } from 'lodash';

import { type Folder, type FolderShared, FolderStatus } from '../types';

import { EmailTemplate } from '~modules/campaign-monitor/campaign-monitor.types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { CreateOrUpdateFolderDto, FolderObjectsQueryDto } from '~modules/folders/dto/folders.dto';

import { FoldersService } from '~modules/folders/services/folders.service';
import { convertSchemaIdentifierToId } from '~modules/ie-objects/helpers/convert-schema-identifier-to-id';
import { type IeObject, IeObjectLicense } from '~modules/ie-objects/ie-objects.types';

import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';

import { UsersService } from '~modules/users/services/users.service';
import { Permission } from '~modules/users/types';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { customError } from '~shared/helpers/custom-error';
import { EventsHelper } from '~shared/helpers/events';
import { Locale } from '~shared/types/types';

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
		if (isNil(user.getId())) {
			return Pagination<Folder>({
				items: [],
				page: 1,
				size: 10,
				total: 0,
			});
		}

		const folders = await this.foldersService.findFoldersByUser(user.getId(), referer, ip, 1, 1000);

		// Limit access to the objects in the folders
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		for (const folder of folders.items) {
			folder.objects = compact(
				(folder.objects ?? []).map((object) => {
					if (!object) {
						console.error(
							customError('Folder object returned null', null, {
								object,
								folderId: folder.id,
								folderName: folder.name,
							})
						);
						return {}; // ieObject in folder no longer exists
					}
					return this.ieObjectsService.limitObjectInFolder(object, user, visitorSpaceAccessInfo);
				})
			);
		}

		return folders;
	}

	@Get(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async getFolderObjects(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId', ParseUUIDPipe) folderId: string,
		@Query() queryDto: FolderObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const folderObjects: IPagination<Partial<IeObject>> =
			await this.foldersService.findObjectsByFolderId(
				folderId,
				user.getId(),
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
						.filter((license) => Object.values(IeObjectLicense).includes(license))
						// Check if all relevant licenses are intra cp licenses
						.filter(
							(license) =>
								![IeObjectLicense.INTRA_CP_CONTENT, IeObjectLicense.INTRA_CP_METADATA_ALL].includes(
									license
								)
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
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async createFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Body() createFolderDto: CreateOrUpdateFolderDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Folder> {
		return this.foldersService.create(
			{
				name: createFolderDto.name,
				description: createFolderDto.description,
				user_profile_id: user.getId(),
				is_default: false,
			},
			referer,
			ip
		);
	}

	@Patch(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async updateFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@Body() updateFolderDto: CreateOrUpdateFolderDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Folder> {
		return await this.foldersService.update(folderId, user.getId(), updateFolderDto, referer, ip);
	}

	@Delete(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async deleteFolder(
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const affectedRows = await this.foldersService.delete(folderId, user.getId());
		if (affectedRows > 0) {
			return { status: 'the folder has been deleted' };
		}
		return { status: 'no folders found with that id' };
	}

	@Post(':folderId/objects/:objectSchemaIdentifier')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async addObjectToFolder(
		@Req() request: Request,
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@Param('objectSchemaIdentifier') objectSchemaIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		const collection = await this.foldersService.findFolderById(folderId, referer, ip);
		if (collection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only add objects to your own folders');
		}

		const ieObjectId = convertSchemaIdentifierToId(objectSchemaIdentifier);
		const folderObject = await this.foldersService.addObjectToFolder(
			folderId,
			ieObjectId,
			referer,
			ip
		);

		// Log event
		const ieObject = await this.ieObjectsService.findByIeObjectId(ieObjectId, referer, ip);
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.ITEM_BOOKMARK,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					type: ieObject.dctermsFormat,
					pid: ieObject.schemaIdentifier,
					fragment_id: objectSchemaIdentifier,
					folder_id: folderId,
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					or_id: ieObject.maintainerId,
				},
			},
		]);

		return folderObject;
	}

	@Delete(':folderId/objects/:objectSchemaIdentifier')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async removeObjectFromFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@Param('objectSchemaIdentifier') objectSchemaIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const collection = await this.foldersService.findFolderById(folderId, referer, ip);
		if (collection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only delete objects from your own folders');
		}
		const affectedRows = await this.foldersService.removeObjectFromFolder(
			folderId,
			convertSchemaIdentifierToId(objectSchemaIdentifier),
			user.getId()
		);
		if (affectedRows > 0) {
			return { status: 'the object has been deleted' };
		}
		return { status: 'no object found with that id in that folder' };
	}

	@Patch(':oldFolderId/objects/:objectSchemaIdentifier/move')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async moveObjectToAnotherFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('oldFolderId') oldFolderId: string,
		@Param('objectSchemaIdentifier') objectSchemaIdentifier: string,
		@Query('newFolderId') newFolderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		// Check user is owner of both folders
		const [oldFolder, newFolder] = await Promise.all([
			this.foldersService.findFolderById(oldFolderId, referer, ip),
			this.foldersService.findFolderById(newFolderId, referer, ip),
		]);
		if (oldFolder.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only move objects from your own folders');
		}
		if (newFolder.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only move objects to your own folders');
		}

		const folderObject = await this.foldersService.addObjectToFolder(
			newFolderId,
			convertSchemaIdentifierToId(objectSchemaIdentifier),
			referer,
			ip
		);
		await this.foldersService.removeObjectFromFolder(
			oldFolderId,
			convertSchemaIdentifierToId(objectSchemaIdentifier),
			user.getId()
		);
		return folderObject;
	}

	/**
	 * Create an invite to share a folder
	 * @param referer
	 * @param ip
	 * @param request
	 * @param emailInfo
	 * @param folderId
	 * @param user
	 */
	@Post('/share/:folderId/create')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async createSharedFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Body() emailInfo: { to: string },
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ message: 'success' }> {
		const folder = await this.foldersService.findFolderById(folderId, referer, ip);

		// If the "to" user already exists we take their preferred language otherwise we take the language of the person who is sending the "share folder" email
		const toUser = await this.userService.getUserByEmail(emailInfo.to);

		const preferredLang = toUser ? toUser.language : user.getLanguage() || Locale.Nl;

		const shareUrl = {
			nl: `${process.env.CLIENT_HOST}/account/map-delen/${folderId}`,
			en: `${process.env.CLIENT_HOST}/account/share-folder/${folderId}`,
		};
		await this.campaignMonitorService.sendTransactionalMail(
			{
				template: EmailTemplate.SHARE_FOLDER,
				data: {
					to: emailInfo.to,
					consentToTrack: 'unchanged',
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
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async acceptSharedFolder(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<FolderShared> {
		const folder = await this.foldersService.findFolderById(folderId, referer, ip);

		if (folder?.userProfileId === user.getId()) {
			return {
				status: FolderStatus.ALREADY_OWNER,
				folderId: folder.id,
				folderName: folder?.name,
			};
		}

		const createdFolder = await this.foldersService.create(
			{
				name: folder?.name,
				user_profile_id: user.getId(),
				is_default: false,
			},
			referer,
			ip
		);

		// Get all the objects from the original collection and add them to the new collection
		let folderObjects: IPagination<Partial<IeObject>>;
		try {
			folderObjects = await this.foldersService.findObjectsByFolderId(
				folderId,
				folder?.userProfileId,
				{ size: 1000 },
				referer,
				ip
			);
			// TODO: make it possible to insert all objects to the new collection at once
			await promiseUtils.mapLimit(folderObjects?.items, 20, async (item) => {
				try {
					const ieObjectId = item.iri;
					await this.foldersService.addObjectToFolder(createdFolder.id, ieObjectId, referer, ip);
				} catch (err) {
					console.error(
						customError('Failed to add object from original folder to shared folder', null, {
							item,
							folderId: folder.id,
							folderName: folder.name,
							createdFolderId: createdFolder.id,
							createdFolderName: createdFolder.name,
						})
					);
				}
			});
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
}
