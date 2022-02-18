import { Controller, Get, Logger, Param, ParseUUIDPipe, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { CollectionsService } from '../services/collections.service';
import { Collection } from '../types';

import { SessionHelper } from '~modules/auth/session-helper';

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
	public async getCollectionById(@Param('id', ParseUUIDPipe) id: string): Promise<Collection> {
		const collection = await this.collectionsService.findById(id);
		return collection;
	}
}
