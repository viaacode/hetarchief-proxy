import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Logger,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Session,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { Collection, IeObject } from '../types';

import {
	CollectionObjectsQueryDto,
	CreateOrUpdateCollectionDto,
} from '~modules/collections/dto/collections.dto';
import { CollectionsService } from '~modules/collections/services/collections.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
	private logger: Logger = new Logger(CollectionsController.name, { timestamp: true });

	constructor(private collectionsService: CollectionsService) {}

	@Get()
	public async getCollections(
		@Headers('referer') referer: string,
		@Session() session: Record<string, any>
	): Promise<IPagination<Collection>> {
		const userInfo = SessionHelper.getArchiefUserInfo(session);
		const collections = await this.collectionsService.findCollectionsByUser(
			userInfo.id,
			referer,
			1,
			1000
		);
		return collections;
	}

	@Get(':collectionId')
	public async getCollectionObjects(
		@Headers('referer') referer: string,
		@Param('collectionId', ParseUUIDPipe) collectionId: string,
		@Query() queryDto: CollectionObjectsQueryDto,
		@Session() session: Record<string, any>
	): Promise<IPagination<IeObject>> {
		const userInfo = SessionHelper.getArchiefUserInfo(session);
		const collectionObjects = await this.collectionsService.findObjectsByCollectionId(
			collectionId,
			userInfo.id,
			queryDto,
			referer
		);
		return collectionObjects;
	}

	@Post()
	public async createCollection(
		@Headers('referer') referer: string,
		@Body() createCollectionDto: CreateOrUpdateCollectionDto,
		@Session() session: Record<string, any>
	): Promise<Collection> {
		const collection = await this.collectionsService.create(
			{
				name: createCollectionDto.name,
				user_profile_id: SessionHelper.getArchiefUserInfo(session).id,
				is_default: false,
			},
			referer
		);
		return collection;
	}

	@Patch(':collectionId')
	public async updateCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Body() updateCollectionDto: CreateOrUpdateCollectionDto,
		@Session() session: Record<string, any>
	): Promise<Collection> {
		const collection = await this.collectionsService.update(
			collectionId,
			SessionHelper.getArchiefUserInfo(session).id,
			updateCollectionDto,
			referer
		);
		return collection;
	}

	@Delete(':collectionId')
	public async deleteCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Session() session: Record<string, any>
	): Promise<{ status: string }> {
		const affectedRows = await this.collectionsService.delete(
			collectionId,
			SessionHelper.getArchiefUserInfo(session).id,
			referer
		);
		if (affectedRows > 0) {
			return { status: 'collection has been deleted' };
		} else {
			return { status: 'no collections found with that id' };
		}
	}

	@Post(':collectionId/objects/:objectId')
	public async addObjectToCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Param('objectId') objectSchemaIdentifier: string,
		@Session() session: Record<string, any>
	): Promise<IeObject> {
		const collection = await this.collectionsService.findCollectionById(collectionId, referer);
		const user = SessionHelper.getArchiefUserInfo(session);
		if (collection.userProfileId !== user.id) {
			throw new UnauthorizedException('You can only add objects to your own collections');
		}

		const collectionObject = await this.collectionsService.addObjectToCollection(
			collectionId,
			objectSchemaIdentifier,
			referer
		);
		return collectionObject;
	}

	@Delete(':collectionId/objects/:objectId')
	public async removeObjectFromCollection(
		@Headers('referer') referer: string,
		@Param('collectionId') collectionId: string,
		@Param('objectId') objectId: string,
		@Session() session: Record<string, any>
	): Promise<{ status: string }> {
		const collection = await this.collectionsService.findCollectionById(collectionId, referer);
		const user = SessionHelper.getArchiefUserInfo(session);
		if (collection.userProfileId !== user.id) {
			throw new UnauthorizedException(
				'You can only delete objects from your own collections'
			);
		}
		const affectedRows = await this.collectionsService.removeObjectFromCollection(
			collectionId,
			objectId,
			user.id
		);
		if (affectedRows > 0) {
			return { status: 'object has been deleted' };
		} else {
			return { status: 'no object found with that id in that collection' };
		}
	}

	@Patch(':oldCollectionId/objects/:objectId/move')
	public async moveObjectToAnotherCollection(
		@Headers('referer') referer: string,
		@Param('oldCollectionId') oldCollectionId: string,
		@Param('objectId') objectSchemaIdentifier: string,
		@Query('newCollectionId') newCollectionId: string,
		@Session() session: Record<string, any>
	): Promise<IeObject> {
		// Check user is owner of both collections
		const [oldCollection, newCollection] = await Promise.all([
			this.collectionsService.findCollectionById(oldCollectionId, referer),
			this.collectionsService.findCollectionById(newCollectionId, referer),
		]);
		const user = SessionHelper.getArchiefUserInfo(session);
		if (oldCollection.userProfileId !== user.id) {
			throw new UnauthorizedException('You can only move objects from your own collections');
		}
		if (newCollection.userProfileId !== user.id) {
			throw new UnauthorizedException('You can only move objects to your own collections');
		}

		const collectionObject = await this.collectionsService.addObjectToCollection(
			newCollectionId,
			objectSchemaIdentifier,
			referer
		);
		await this.collectionsService.removeObjectFromCollection(
			oldCollectionId,
			objectSchemaIdentifier,
			user.id
		);
		return collectionObject;
	}
}
