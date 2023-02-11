import { PlayerTicketService } from '@meemoo/admin-core-api';
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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Configuration } from '~config';

import {
	IeObjectMeemooIdentifiersQueryDto,
	IeObjectsQueryDto,
	PlayerTicketsQueryDto,
	ThumbnailQueryDto,
} from '../dto/ie-objects.dto';
import { checkAndFixFormatFilter } from '../helpers/check-and-fix-format-filter';
import { convertObjectToXml } from '../helpers/convert-objects-to-xml';
import { getVisitorSpaceAccessInfo } from '../helpers/get-visitor-space-access-info';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import { getLimitedMetadata, limitMetadata } from '../helpers/limit-metadata';
import { IeObject, IeObjectSeo, IeObjectsWithAggregations } from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus } from '~generated/graphql-db-types-hetarchief';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import OrganisationsService from '~modules/organisations/services/organisations.service';
import { TranslationsService } from '~modules/translations/services/translations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, Permission } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitStatus, VisitTimeframe } from '~modules/visits/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Ie Objects')
@Controller('ie-objects')
export class IeObjectsController {
	private logger: Logger = new Logger(IeObjectsController.name, { timestamp: true });

	constructor(
		private ieObjectsService: IeObjectsService,
		private configService: ConfigService<Configuration>,
		private translationsService: TranslationsService,
		private eventsService: EventsService,
		private visitsService: VisitsService,
		private playerTicketService: PlayerTicketService,
		private organisationService: OrganisationsService
	) {}

	@Get('player-ticket')
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
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
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
	public async getThumbnailUrl(
		@Headers('referer') referer: string,
		@Query() thumbnailQuery: ThumbnailQueryDto
	): Promise<string> {
		const url = await this.playerTicketService.getThumbnailUrl(thumbnailQuery.id, referer);
		return url;
	}

	// TODO: rework
	@Get(':id')
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
	public async getIeObjectById(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObject | Partial<IeObject>> {
		const object = await this.ieObjectsService.findBySchemaIdentifier(id, referer);

		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		const userHasAccessToSpace =
			canSearchInAllSpaces ||
			(await this.userHasAccessToVisitorSpaceOrId(user, object.maintainerId));

		if (!userHasAccessToSpace) {
			return getLimitedMetadata(object);
		}

		if (this.configService.get('IGNORE_OBJECT_LICENSES')) {
			return object;
		}

		const limitedObject = this.applyLicensesToObject(object, userHasAccessToSpace) as
			| IeObject
			| Partial<IeObject>;

		if (!limitedObject) {
			throw new NotFoundException(
				this.translationsService.t('modules/media/controllers/media___object-not-found')
			);
		}

		return limitedObject;
	}

	// TODO: rework
	@Get('seo/:id')
	public async getIeObjectSeoById(
		@Headers('referer') referer: string,
		@Param('id') id: string
	): Promise<IeObjectSeo> {
		const object = await this.ieObjectsService.findBySchemaIdentifier(id, referer);

		const limitedObject = this.applyLicensesToObject(object, false) as
			| IeObject
			| Partial<IeObject>;

		return {
			name: limitedObject?.name,
		};
	}

	@Get(':id/export')
	@Header('Content-Type', 'text/xml')
	@RequireAllPermissions(Permission.SEARCH_OBJECTS, Permission.EXPORT_OBJECT)
	public async export(
		@Param('id') id: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<string> {
		const objectMetadata = await this.ieObjectsService.findMetadataBySchemaIdentifier(id);

		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (
			!canSearchInAllSpaces &&
			(!objectMetadata.maintainerId ||
				!(await this.userHasAccessToVisitorSpaceOrId(user, objectMetadata.maintainerId)))
		) {
			throw new ForbiddenException(
				this.translationsService.t(
					'modules/media/controllers/media___you-do-not-have-access-to-the-visitor-space-of-this-object'
				)
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

		return convertObjectToXml(limitMetadata(objectMetadata));
	}

	// TODO: rework
	@Get(':esIndex/:schemaIdentifier/related/:meemooIdentifier')
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
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
			throw new ForbiddenException(
				this.translationsService.t(
					'modules/media/controllers/media___you-do-not-have-access-to-this-visitor-space'
				)
			);
		}

		// We use the esIndex as the maintainerId -- no need to lowercase
		return this.ieObjectsService.getRelated(
			maintainerId,
			schemaIdentifier,
			meemooIdentifier,
			referer
		);
	}

	@Get('related/count')
	public async countRelated(
		@Query() countRelatedQuery: IeObjectMeemooIdentifiersQueryDto
	): Promise<Record<string, number>> {
		return this.ieObjectsService.countRelated(countRelatedQuery.meemooIdentifiers);
	}

	// TODO: rework
	@Get(':esIndex/:id/similar')
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
	public async getSimilar(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@Param('esIndex') esIndex: string,
		@SessionUser() user: SessionUserEntity
	): Promise<any> {
		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (!canSearchInAllSpaces && !(await this.userHasAccessToVisitorSpaceOrId(user, esIndex))) {
			throw new ForbiddenException(
				this.translationsService.t(
					'modules/media/controllers/media___you-do-not-have-access-to-this-visitor-space'
				)
			);
		}

		return this.ieObjectsService.getSimilar(id, esIndex.toLowerCase(), referer);
	}

	@Post()
	public async getIeObjects(
		@Headers('referer') referer: string,
		@Body() queryDto: IeObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObjectsWithAggregations> {
		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		// Get sector from Organisation when user is part of CP_ADMIN Group
		let organisation = null;
		if (user.getGroupId() === Group.CP_ADMIN) {
			organisation = await this.organisationService.findOrganisationBySchemaIdentifier(
				user.getMaintainerId()
			);
		}

		// Get active visits for the current user
		// Need this to retrieve visitorSpaceAccessInfo
		const activeVisits = await this.visitsService.findAll(
			{
				page: 1,
				size: 100,
				timeframe: VisitTimeframe.ACTIVE,
				status: VisitStatus.APPROVED,
			},
			{
				userProfileId: user.getId(),
				visitorSpaceStatus: VisitorSpaceStatus.Active,
			}
		);
		const visitorSpaceAccessInfo = getVisitorSpaceAccessInfo(activeVisits.items);

		// Get elastic search result based on given parameters
		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			'_all',
			referer,
			user,
			visitorSpaceAccessInfo,
			organisation
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedSearchResult = {
			...searchResult,
			items: searchResult.items.map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId() || null,
					isKeyUser: user.getIsKeyUser() || false,
					sector: organisation?.sector || null,
					groupId: user.getGroupId() || null,
					maintainerId: user.getMaintainerId() || null,
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
			),
		};

		return licensedSearchResult;
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
}
