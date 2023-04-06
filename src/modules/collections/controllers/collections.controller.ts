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
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { Request } from 'express';
import { isNil } from 'lodash';

import { Collection, CollectionShared, CollectionStatus } from '../types';

import {
	CollectionObjectsQueryDto,
	CreateOrUpdateCollectionDto,
} from '~modules/collections/dto/collections.dto';
import { CollectionsService } from '~modules/collections/services/collections.service';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { IeObject } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
	constructor(
		private collectionsService: CollectionsService,
		private eventsService: EventsService,
		private ieObjectsService: IeObjectsService
	) {}

	@Get()
	public async getCollections(
		@Headers('referer') referer: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Collection>> {
		// For Anonymous users it should return empty array
		if (isNil(user.getId())) {
			return Pagination<Collection>({
				items: [],
				page: 1,
				size: 10,
				total: 0,
			});
		}

		const collections = await this.collectionsService.findCollectionsByUser(
			user.getId(),
			referer,
			1,
			1000
		);

		// Limit access to the objects in the collections
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		collections.items.forEach((collection) => {
			collection.objects = (collection.objects ?? []).map((object) => {
				return this.ieObjectsService.limitObjectInFolder(
					object,
					user,
					visitorSpaceAccessInfo
				);
			});
		});

		return collections;
	}

	@Get(':collectionId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async getCollectionObjects(
		@Headers('referer') referer: string,
		@Param('collectionId', ParseUUIDPipe) collectionId: string,
		@Query() queryDto: CollectionObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const folderObjects: IPagination<Partial<IeObject>> =
			await this.collectionsService.findObjectsByCollectionId(
				collectionId,
				user.getId(),
				queryDto,
				referer
			);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		// Limit access to the objects in the collection
		folderObjects.items = (folderObjects.items ?? []).map((object) => {
			return this.ieObjectsService.limitObjectInFolder(object, user, visitorSpaceAccessInfo);
		});

		return folderObjects;
	}

	@Post()
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async createCollection(
		@Headers('referer') referer: string,
		@Body() createCollectionDto: CreateOrUpdateCollectionDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Collection> {
		const collection = await this.collectionsService.create(
			{
				name: createCollectionDto.name,
				user_profile_id: user.getId(),
				is_default: false,
			},
			referer
		);
		return collection;
	}

	@Patch(':collectionId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async updateCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Body() updateCollectionDto: CreateOrUpdateCollectionDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Collection> {
		const collection = await this.collectionsService.update(
			collectionId,
			user.getId(),
			updateCollectionDto,
			referer
		);
		return collection;
	}

	@Delete(':collectionId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async deleteCollection(
		@Param('collectionId') collectionId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const affectedRows = await this.collectionsService.delete(collectionId, user.getId());
		if (affectedRows > 0) {
			return { status: 'collection has been deleted' };
		} else {
			return { status: 'no collections found with that id' };
		}
	}

	@Post(':collectionId/objects/:objectId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async addObjectToCollection(
		@Req() request: Request,
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Param('objectId') objectSchemaIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<IeObject> & { collectionEntryCreatedAt: string }> {
		const collection = await this.collectionsService.findCollectionById(collectionId, referer);
		if (collection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only add objects to your own collections');
		}

		const collectionObject = await this.collectionsService.addObjectToCollection(
			collectionId,
			objectSchemaIdentifier,
			referer
		);

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.ITEM_BOOKMARK,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					schema_identifier: objectSchemaIdentifier,
					folder_id: collectionId,
				},
			},
		]);

		return collectionObject;
	}

	@Delete(':collectionId/objects/:objectId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async removeObjectFromCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Param('objectId') objectId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const collection = await this.collectionsService.findCollectionById(collectionId, referer);
		if (collection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only delete objects from your own collections');
		}
		const affectedRows = await this.collectionsService.removeObjectFromCollection(
			collectionId,
			objectId,
			user.getId()
		);
		if (affectedRows > 0) {
			return { status: 'object has been deleted' };
		} else {
			return { status: 'no object found with that id in that collection' };
		}
	}

	@Patch(':oldCollectionId/objects/:objectId/move')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async moveObjectToAnotherCollection(
		@Headers('referer') referer: string,
		@Param('oldCollectionId') oldCollectionId: string,
		@Param('objectId') objectSchemaIdentifier: string,
		@Query('newCollectionId') newCollectionId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Partial<IeObject> & { collectionEntryCreatedAt: string }> {
		// Check user is owner of both collections
		const [oldCollection, newCollection] = await Promise.all([
			this.collectionsService.findCollectionById(oldCollectionId, referer),
			this.collectionsService.findCollectionById(newCollectionId, referer),
		]);
		if (oldCollection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only move objects from your own collections');
		}
		if (newCollection.userProfileId !== user.getId()) {
			throw new ForbiddenException('You can only move objects to your own collections');
		}

		const collectionObject = await this.collectionsService.addObjectToCollection(
			newCollectionId,
			objectSchemaIdentifier,
			referer
		);
		await this.collectionsService.removeObjectFromCollection(
			oldCollectionId,
			objectSchemaIdentifier,
			user.getId()
		);
		return collectionObject;
	}

	@Post('/share/:collectionId')
	@UseGuards(LoggedInGuard)
	@RequireAllPermissions(Permission.MANAGE_FOLDERS)
	public async shareCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<CollectionShared> {
		const collection = await this.collectionsService.findCollectionById(collectionId, referer);

		if (collection?.userProfileId === user.getId()) {
			return {
				status: CollectionStatus.ALREADY_OWNER,
				folderId: collection.id,
				folderName: collection?.name,
			};
		}

		const createdCollection = await this.collectionsService.create(
			{
				name: collection?.name,
				user_profile_id: user.getId(),
				is_default: false,
			},
			referer
		);

		// Get all the objects from the original collection and add them to the new collection
		let folderObjects: IPagination<Partial<IeObject>>;
		try {
			folderObjects = await this.collectionsService.findObjectsByCollectionId(
				collectionId,
				collection?.userProfileId,
				{ size: 1000 },
				referer
			);
			await Promise.all(
				folderObjects?.items.map(async (item) => {
					await this.collectionsService.addObjectToCollection(
						createdCollection.id,
						item?.schemaIdentifier,
						referer
					);
				})
			);
		} catch (err) {
			if (err.name !== 'NotFoundException') {
				throw new InternalServerErrorException(
					'Failed to add object from original collection to shared collection'
				);
			}
		}

		return {
			status: CollectionStatus.ADDED,
			folderId: createdCollection?.id,
			folderName: createdCollection?.name,
		};
	}
}
