import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Headers,
	Logger,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { MediaQueryDto, PlayerTicketsQueryDto, ThumbnailQueryDto } from '../dto/media.dto';
import { MediaService } from '../services/media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(private mediaService: MediaService, private configService: ConfigService) {}

	// Disabled in production since users always need to search inside one reading room
	// handy on local environment due to limited test data in a single index
	// Can be re-enabled in phase2 for cross-bezoekersruimte search
	@Post()
	public async getMedia(
		@Headers('referer') referer: string,
		@Body() queryDto: MediaQueryDto
	): Promise<any> {
		if (this.configService.get('environment') === 'production') {
			throw new ForbiddenException();
		}
		const media = await this.mediaService.findAll(queryDto, null, referer);
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

	@Get('thumbnail-ticket')
	public async getThumbnailUrl(
		@Headers('referer') referer: string,
		@Query() thumbnailQuery: ThumbnailQueryDto
	): Promise<string> {
		const url = await this.mediaService.getThumbnailUrl(thumbnailQuery.id, referer);
		return url;
	}

	@Get(':id')
	public async getMediaById(
		@Headers('referer') referer: string,
		@Param('id') id: string
	): Promise<any> {
		return this.mediaService.findBySchemaIdentifier(id, referer);
	}

	@Get(':esIndex/:schemaIdentifier/related/:meemooIdentifier')
	public async getRelated(
		@Param('esIndex') esIndex: string,
		@Param('schemaIdentifier') schemaIdentifier: string,
		@Param('meemooIdentifier') meemooIdentifier: string
	): Promise<any> {
		return this.mediaService.getRelated(esIndex, schemaIdentifier, meemooIdentifier);
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
		@Headers('referer') referer: string,
		@Body() queryDto: MediaQueryDto,
		@Param('esIndex') esIndex: string
	): Promise<any> {
		const media = await this.mediaService.findAll(queryDto, esIndex, referer);
		return media;
	}
}
