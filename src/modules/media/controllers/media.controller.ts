import { Body, Controller, Get, Headers, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { MediaQueryDto, PlayerTicketsQueryDto } from '../dto/media.dto';
import { MediaService } from '../services/media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(private mediaService: MediaService) {}

	// TODO comment this endpoint, since users always need to search inside one reading room
	@Post()
	public async getMedia(@Body() queryDto: MediaQueryDto): Promise<any> {
		const media = await this.mediaService.findAll(queryDto, null);
		return media;
	}

	@Get('player-ticket')
	public async getPlayableUrl(
		@Headers('referer') referer: string,
		@Query() playerTicketsQuery: PlayerTicketsQueryDto
	): Promise<string> {
		const url = await this.mediaService.getPlayableUrl(
			decodeURIComponent(playerTicketsQuery.id),
			referer
		);
		return url;
	}

	@Get(':id')
	public async getMediaById(@Param('id') id: string): Promise<any> {
		return this.mediaService.findBySchemaIdentifier(id);
	}

	@Get(':id/related/:meemooIdentifier')
	public async getRelated(
		@Param('id') id: string,
		@Param('meemooIdentifier') meemooIdentifier: string
	): Promise<any> {
		return this.mediaService.getRelated(id, meemooIdentifier);
	}

	@Get(':esIndex/:id/similar')
	public async getSimilar(
		@Param('id') id: string,
		@Param('esIndex') esIndex: string
	): Promise<any> {
		return this.mediaService.getSimilar(id, esIndex);
	}

	@Post(':esIndex')
	@ApiParam({ name: 'esIndex', example: 'or-154dn75' })
	public async getMediaOnIndex(
		@Body() queryDto: MediaQueryDto,
		@Param('esIndex')
		esIndex: string
	): Promise<any> {
		const media = await this.mediaService.findAll(queryDto, esIndex);
		return media;
	}
}
