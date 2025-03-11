import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
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
import { Request } from 'express';
import { isNil } from 'lodash';

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
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';
import { getIpFromRequest } from '~shared/helpers/get-ip-from-request';
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
		@Headers('referer') referer: string,
		@Req() request: Request,
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

		const folders = await this.foldersService.findFoldersByUser(
			user.getId(),
			referer,
			getIpFromRequest(request),
			1,
			1000
		);

		// Limit access to the objects in the folders
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		folders.items.forEach((folder) => {
			folder.objects = (folder.objects ?? []).map((object) => {
				if (!object) {
					console.error(
						new CustomError(
							'Trying to limit metadata on null ie object in folder',
							null,
							{
								object,
								folderId: folder.id,
								folderName: folder.name,
							}
						)
					);
					return {}; // ieObject in folder no longer exists
				}
				return this.ieObjectsService.limitObjectInFolder(
					object,
					user,
					visitorSpaceAccessInfo
				);
			});
		});

		return folders;
	}

	@Get(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async getFolderObjects(
		@Headers('referer') referer: string,
		@Param('folderId', ParseUUIDPipe) folderId: string,
		@Query() queryDto: FolderObjectsQueryDto,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const folderObjects: IPagination<Partial<IeObject>> =
			await this.foldersService.findObjectsByFolderId(
				folderId,
				user.getId(),
				queryDto,
				referer,
				getIpFromRequest(request)
			);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const isKeyUser = user.getIsKeyUser();

		// Limit access to the objects in the collection:
		// https://meemoo.atlassian.net/browse/ARC-1834
		folderObjects.items = (folderObjects.items ?? [])
			.filter((object) => {
				// if user is no keyUser AND object has ONLY license INTRA_CP-CONTENT AND/OR INTRA_CP-METADATA_ALL, do not show object
				const hasOnlyIntraCpLicenses =
					(object.licenses || [])
						// Filter the licenses to only the ones we care about inside hetarchief.be. eg we don't care about VIAA-ONDERZOEK or VIAA-ONDERWIJS
						.filter((license) => Object.values(IeObjectLicense).includes(license))
						// Check if all relevant licenses are intra cp licenses
						.filter(
							(license) =>
								![
									IeObjectLicense.INTRA_CP_CONTENT,
									IeObjectLicense.INTRA_CP_METADATA_ALL,
								].includes(license)
						).length === 0;
				if (!isKeyUser && hasOnlyIntraCpLicenses) {
					return false;
				} else {
					return true;
				}
			})
			.map((object) => {
				return this.ieObjectsService.limitObjectInFolder(
					object,
					user,
					visitorSpaceAccessInfo
				);
			});

		return folderObjects;
	}

	@Post()
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async createFolder(
		@Headers('referer') referer: string,
		@Req() request: Request,
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
			getIpFromRequest(request)
		);
	}

	@Patch(':folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async updateFolder(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Param('folderId') folderId: string,
		@Body() updateFolderDto: CreateOrUpdateFolderDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Folder> {
		return await this.foldersService.update(
			folderId,
			user.getId(),
			updateFolderDto,
			referer,
			getIpFromRequest(request)
		);
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
		} else {
			return { status: 'no folders found with that id' };
		}
	}

	@Post(':folderId/objects/:objectId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async addObjectToFolder(
		@Req() request: Request,
		@Headers('referer') referer: string,
		@Param('folderId') folderId: string,
		@Param('objectId') objectSchemaIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		const collection = await this.foldersService.findFolderById(
			folderId,
			referer,
			getIpFromRequest(request)
		);
		if (collection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only add objects to your own folders');
		}

		const folderObject = await this.foldersService.addObjectToFolder(
			folderId,
			objectSchemaIdentifier,
			referer,
			getIpFromRequest(request)
		);

		// Log event
		const ieObjects = await this.ieObjectsService.findByIeObjectId(
			convertSchemaIdentifierToId(objectSchemaIdentifier),
			referer,
			getIpFromRequest(request)
		);
		const ieObject = ieObjects[0];
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

	@Delete(':folderId/objects/:objectId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async removeObjectFromFolder(
		@Headers('referer') referer: string,
		@Param('folderId') folderId: string,
		@Param('objectId') objectId: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const collection = await this.foldersService.findFolderById(
			folderId,
			referer,
			getIpFromRequest(request)
		);
		if (collection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only delete objects from your own folders');
		}
		const affectedRows = await this.foldersService.removeObjectFromFolder(
			folderId,
			objectId,
			user.getId()
		);
		if (affectedRows > 0) {
			return { status: 'the object has been deleted' };
		} else {
			return { status: 'no object found with that id in that folder' };
		}
	}

	@Patch(':oldFolderId/objects/:objectId/move')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async moveObjectToAnotherFolder(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Param('oldFolderId') oldFolderId: string,
		@Param('objectId') objectSchemaIdentifier: string,
		@Query('newFolderId') newFolderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		// Check user is owner of both folders
		const [oldFolder, newFolder] = await Promise.all([
			this.foldersService.findFolderById(oldFolderId, referer, getIpFromRequest(request)),
			this.foldersService.findFolderById(newFolderId, referer, getIpFromRequest(request)),
		]);
		if (oldFolder.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only move objects from your own folders');
		}
		if (newFolder.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only move objects to your own folders');
		}

		const folderObject = await this.foldersService.addObjectToFolder(
			newFolderId,
			objectSchemaIdentifier,
			referer,
			getIpFromRequest(request)
		);
		await this.foldersService.removeObjectFromFolder(
			oldFolderId,
			objectSchemaIdentifier,
			user.getId()
		);
		return folderObject;
	}

	@Post('/share/:folderId/create')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async createSharedFolder(
		@Req() request: Request,
		@Body() emailInfo: { to: string },
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ message: 'success' }> {
		const folder = await this.foldersService.findFolderById(
			folderId,
			request.headers.referer,
			getIpFromRequest(request)
		);

		//if the to user already exists we take his preferred language otherwise we take the language of the person wo is sending the email
		const toUser = await this.userService.getUserByEmail(emailInfo.to);

		const preferredLang = toUser ? toUser.language : user.getLanguage() || Locale.Nl;

		const shareUrl = {
			nl: `${process.env.CLIENT_HOST}/account/map-delen/${folderId}`,
			en: `${process.env.CLIENT_HOST}/account/map-share/${folderId}`,
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

	@Post('/share/:folderId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async acceptSharedFolder(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Param('folderId') folderId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<FolderShared> {
		const folder = await this.foldersService.findFolderById(
			folderId,
			referer,
			getIpFromRequest(request)
		);

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
			getIpFromRequest(request)
		);

		// Get all the objects from the original collection and add them to the new collection
		let folderObjects: IPagination<Partial<IeObject>>;
		try {
			folderObjects = await this.foldersService.findObjectsByFolderId(
				folderId,
				folder?.userProfileId,
				{ size: 1000 },
				referer,
				getIpFromRequest(request)
			);
			// TODO: make it possible to insert all objects to the new collection at once
			await promiseUtils.mapLimit(folderObjects?.items, 20, async (item) => {
				await this.foldersService.addObjectToFolder(
					createdFolder.id,
					item?.schemaIdentifier,
					referer,
					getIpFromRequest(request)
				);
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
