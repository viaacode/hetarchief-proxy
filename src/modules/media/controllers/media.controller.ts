import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';

import { MediaQueryDto } from '../dto/media.dto';
import { MediaService } from '../services/media.service';

@Controller('media')
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(private mediaService: MediaService) {}

	@Post()
	public async getMedia(@Body() query: MediaQueryDto): Promise<any> {
		const media = await this.mediaService.findAll(query);
		return media;
	}

	@Get(':id')
	public async getMediaById(@Param('id') id: string): Promise<any> {
		return this.mediaService.findById(id);
	}

	@Post(':esIndex')
	public async getMediaOnIndex(
		@Body() query: MediaQueryDto,
		@Param('esIndex') esIndex: string
	): Promise<any> {
		const media = await this.mediaService.findAll(query, esIndex);
		return media;
	}

	@Get(':esIndex/:id')
	public async getMediaOnIndexById(
		@Param('id') id: string,
		@Param('esIndex') esIndex: string
	): Promise<any> {
		const media = await this.mediaService.findById(id, esIndex);
		return media;
	}
}
