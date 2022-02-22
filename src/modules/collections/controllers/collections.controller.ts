import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
	Session,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { CollectionsService } from '../services/collections.service';
import { Collection } from '../types';

import { CreateOrUpdateCollectionDto } from '~modules/collections/dto/collections.dto';
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
		@Session() session: Record<string, any>
	): Promise<IPagination<Collection>> {
		const userInfo = SessionHelper.getArchiefUserInfo(session);
		const collections = await this.collectionsService.findByUser(userInfo.id);
		return collections;
	}

	@Get(':id')
	public async getCollectionById(
		@Param('id', ParseUUIDPipe) id: string,
		@Session() session: Record<string, any>
	): Promise<Collection> {
		const collection = await this.collectionsService.findById(id);
		const userInfo = SessionHelper.getArchiefUserInfo(session);
		if (!userInfo || userInfo.id !== collection.user_profile_id) {
			throw new UnauthorizedException(
				'This collection does not exist or you do not have access to it.'
			);
		}
		return collection;
	}

	@Post()
	public async createCollection(
		@Body() createCollectionDto: CreateOrUpdateCollectionDto,
		@Session() session: Record<string, any>
	): Promise<Collection> {
		const collection = await this.collectionsService.create({
			name: createCollectionDto.name,
			user_profile_id: SessionHelper.getArchiefUserInfo(session).id,
			is_default: false,
		});
		return collection;
	}

	@Put('/:collectionId')
	public async updateCollection(
		@Param('collectionId') collectionId: string,
		@Body() updateCollectionDto: CreateOrUpdateCollectionDto,
		@Session() session: Record<string, any>
	): Promise<Collection> {
		const collection = await this.collectionsService.update(
			collectionId,
			SessionHelper.getArchiefUserInfo(session).id,
			updateCollectionDto
		);
		return collection;
	}

	@Delete('/:collectionId')
	public async deleteCollection(
		@Param('collectionId') collectionId: string,
		@Session() session: Record<string, any>
	): Promise<{ status: string }> {
		const affectedRows = await this.collectionsService.delete(
			collectionId,
			SessionHelper.getArchiefUserInfo(session).id
		);
		if (affectedRows > 0) {
			return { status: 'collection has been deleted' };
		} else {
			return { status: 'no collections found with that id' };
		}
	}
}
