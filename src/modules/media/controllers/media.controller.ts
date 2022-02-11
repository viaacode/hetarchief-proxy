import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MediaQueryDto } from '../dto/media.dto';
import { MediaService } from '../services/media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(private mediaService: MediaService) {}

	@Post()
	public async getMedia(@Body() queryDto: MediaQueryDto): Promise<any> {
		const media = await this.mediaService.findAll(queryDto);
		return media;
	}

	@Get(':id')
	public async getMediaById(@Param('id') id: string): Promise<any> {
		return this.mediaService.findById(id);
	}

	@Post(':esIndex')
	public async getMediaOnIndex(
		@Body() queryDto: MediaQueryDto,
		@Param('esIndex') esIndex: string
	): Promise<any> {
		const media = await this.mediaService.findAll(queryDto, esIndex);
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
