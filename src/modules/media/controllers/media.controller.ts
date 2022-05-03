import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Header,
	Headers,
	Logger,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { find, intersection } from 'lodash';

import { getConfig } from '~config';

import {
	MediaQueryDto,
	PlayerTicketsQueryDto,
	SearchFilter,
	ThumbnailQueryDto,
} from '../dto/media.dto';
import { MediaService } from '../services/media.service';
import { License, Media, MediaFormat } from '../types';

import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { EventsHelper } from '~shared/helpers/events';
import i18n from '~shared/i18n';

@ApiTags('Media')
@Controller('media')
@RequireAllPermissions(Permission.SEARCH_OBJECTS)
export class MediaController {
	private logger: Logger = new Logger(MediaController.name, { timestamp: true });

	constructor(
		private mediaService: MediaService,
		private playerTicketService: PlayerTicketService,
		private eventsService: EventsService,
		private configService: ConfigService,
		private visitsService: VisitsService
	) {}

	// Disabled in production since users always need to search inside one reading room
	// handy on local environment due to limited test data in a single index
	// Can be re-enabled in phase2 for cross-bezoekersruimte search
	@Post()
	public async getMedia(
		@Headers('referer') referer: string,
		@Body() queryDto: MediaQueryDto
	): Promise<any> {
		if (getConfig(this.configService, 'environment') === 'production') {
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
		const embedUrl = await this.playerTicketService.getEmbedUrl(
			decodeURIComponent(playerTicketsQuery.id)
		);
		const url = await this.playerTicketService.getPlayableUrl(embedUrl, referer);
		return url;
	}

	@Get('thumbnail-ticket')
	public async getThumbnailUrl(
		@Headers('referer') referer: string,
		@Query() thumbnailQuery: ThumbnailQueryDto
	): Promise<string> {
		const url = await this.playerTicketService.getThumbnailUrl(thumbnailQuery.id, referer);
		return url;
	}

	@Get(':id')
	public async getMediaById(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Media | Partial<Media>> {
		const object = await this.mediaService.findBySchemaIdentifier(id, referer);

		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		// check licenses
		if (
			!object.license ||
			intersection(object.license, [
				License.BEZOEKERTOOL_CONTENT,
				License.BEZOEKERTOOL_METADATA_ALL,
			]).length === 0
		) {
			this.logger.debug(`Object ${id} has no valid license`);
			// no valid license throws a not found exception(ARC-670)
			throw new NotFoundException(i18n.t('Object not found'));
		}

		// no access to visitor space == limited metadata
		if (
			!canSearchInAllSpaces &&
			!(await this.userHasAccessToVisitorSpaceOrId(user, object.maintainerId))
		) {
			this.logger.debug(
				`User has no access to visitor space ${object.maintainerId}, only limited metadata allowed`
			);
			return this.mediaService.getLimitedMetadata(object);
		}

		if (!object.license?.includes(License.BEZOEKERTOOL_CONTENT)) {
			// unset representations - user not allowed to view essence
			this.logger.debug(`Object ${id} has no content license, only metadata is returned`);
			delete object.representations;
		}

		return object;
	}

	@Get(':id/export')
	@Header('Content-Type', 'text/xml')
	@RequireAllPermissions(Permission.EXPORT_OBJECT)
	public async export(
		@Param('id') id: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<string> {
		const objectMetadata = await this.mediaService.findMetadataBySchemaIdentifier(id);

		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (
			!canSearchInAllSpaces &&
			(!objectMetadata.maintainerId ||
				!(await this.userHasAccessToVisitorSpaceOrId(user, objectMetadata.maintainerId)))
		) {
			throw new ForbiddenException(
				i18n.t('You do not have access to the visitor space of this object')
			);
		}

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.METADATA_EXPORT,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
			},
		]);

		return this.mediaService.convertObjectToXml(objectMetadata);
	}

	@Get(':esIndex/:schemaIdentifier/related/:meemooIdentifier')
	public async getRelated(
		@Headers('referer') referer: string,
		@Param('esIndex') maintainerId: string,
		@Param('schemaIdentifier') schemaIdentifier: string,
		@Param('meemooIdentifier') meemooIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<any> {
		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (
			!canSearchInAllSpaces &&
			!(await this.userHasAccessToVisitorSpaceOrId(user, maintainerId))
		) {
			throw new ForbiddenException(i18n.t('You do not have access to this visitor space'));
		}

		// We use the esIndex as the maintainerId -- no need to lowercase
		return this.mediaService.getRelated(
			maintainerId,
			schemaIdentifier,
			meemooIdentifier,
			referer
		);
	}

	@Get(':esIndex/:id/similar')
	public async getSimilar(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@Param('esIndex') esIndex: string,
		@SessionUser() user: SessionUserEntity
	): Promise<any> {
		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (!canSearchInAllSpaces && !(await this.userHasAccessToVisitorSpaceOrId(user, esIndex))) {
			throw new ForbiddenException(i18n.t('You do not have access to this visitor space'));
		}

		return this.mediaService.getSimilar(id, esIndex.toLowerCase(), referer);
	}

	@Post(':esIndex')
	@ApiParam({ name: 'esIndex', example: 'or-154dn75' })
	public async getMediaOnIndex(
		@Headers('referer') referer: string,
		@Body() queryDto: MediaQueryDto,
		@Param('esIndex') esIndex: string,
		@SessionUser() user: SessionUserEntity
	): Promise<any> {
		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (!canSearchInAllSpaces && !(await this.userHasAccessToVisitorSpaceOrId(user, esIndex))) {
			throw new ForbiddenException(i18n.t('You do not have access to this visitor space'));
		}

		// Filter on format video should also include film format
		this.checkAndFixFormatFilter(queryDto);

		const media = await this.mediaService.findAll(queryDto, esIndex.toLowerCase(), referer);
		return media;
	}

	/**
	 * Helper function to return if the user has access to a visitor space (or-id) / esIndex
	 * The user is either a maintainer of the specified esIndex
	 * Or the user has an approved visit request for the current timestamp
	 */
	protected async userHasAccessToVisitorSpaceOrId(
		user: SessionUserEntity,
		esIndex: string
	): Promise<boolean> {
		const isMaintainer =
			esIndex &&
			user.getMaintainerId() &&
			user.getMaintainerId().toLowerCase() === esIndex.toLowerCase();

		return isMaintainer || (await this.visitsService.hasAccess(user.getId(), esIndex));
	}

	public checkAndFixFormatFilter(queryDto: MediaQueryDto): MediaQueryDto {
		const formatFilter = find(queryDto.filters, { field: 'format' }) as SearchFilter;
		if (formatFilter && formatFilter.value === MediaFormat.VIDEO) {
			// change to multivalue with video and film
			formatFilter.multiValue = ['video', 'film'];
			delete formatFilter.value;
		} else if (
			// multiValue case
			formatFilter &&
			formatFilter.multiValue &&
			formatFilter.multiValue.includes(MediaFormat.VIDEO)
		) {
			formatFilter.multiValue.push('film');
		}
		return queryDto;
	}
}
