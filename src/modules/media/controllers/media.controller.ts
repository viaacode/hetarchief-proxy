import { Body, Controller, Get, Headers, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { MediaQueryDto, PlayerTicketsQueryDto } from '../dto/media.dto';
import { MediaService } from '../services/media.service';

import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(
		private mediaService: MediaService,
		private playerTicketService: PlayerTicketService
	) {}

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
		const embedUrl = await this.playerTicketService.getEmbedUrl(
			decodeURIComponent(playerTicketsQuery.id)
		);
		const url = await this.playerTicketService.getPlayableUrl(embedUrl, referer);
		return url;
	}

	@Get(':id')
	public async getMediaById(@Param('id') id: string): Promise<any> {
		return this.mediaService.findBySchemaIdentifier(id);
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
