import { Body, Controller, Get, Logger, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { IPagination } from '@studiohyperdrive/pagination';

import { MediaQueryDto } from '../dto/media.dto';
import { MediaService } from '../services/media.service';
import { Media } from '../types';

@Controller('media')
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(private mediaService: MediaService) {}

	@Post()
	public async getMedia(@Body() query: MediaQueryDto): Promise<IPagination<Media>> {
		const media = await this.mediaService.findAll(query);
		return media;
	}

	@Get(':id')
	public async getMediaById(@Param('id') id: string): Promise<Media> {
		return this.mediaService.findById(id);
	}

	@Post(':esIndex')
	public async getMediaOnIndex(
		@Body() query: MediaQueryDto,
		@Param('esIndex') esIndex: string
	): Promise<IPagination<Media>> {
		const media = await this.mediaService.findAll(query, esIndex);
		return media;
	}

	@Get(':esIndex/:id')
	public async getMediaOnIndexById(
		@Param('esIndex') esIndex: string,
		@Param('id') id: string
	): Promise<IPagination<Media>> {
		const media = await this.mediaService.findById(id, esIndex);
		return media;
	}
}
