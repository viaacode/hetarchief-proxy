import { Body, Controller, Get, Headers, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MediaQueryDto, PlayerTicketsQueryDto, ThumbnailQueryDto } from '../dto/media.dto';
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

	@Get('player-ticket')
	public async getPlayableUrl(
		@Headers('referer') referer: string,
		@Query() playerTicketsQuery: PlayerTicketsQueryDto
	): Promise<string> {
		const url = await this.mediaService.getPlayableUrl(playerTicketsQuery.id, referer);
		return url;
	}

	@Get('thumbnail-ticket')
	public async getThumbnailUrl(
		@Headers('referer') referer: string,
		@Query() thumbnailQuery: ThumbnailQueryDto
	): Promise<string> {
		const url = await this.mediaService.getThumbnailUrl(thumbnailQuery.id, referer);
		return url;
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
}
