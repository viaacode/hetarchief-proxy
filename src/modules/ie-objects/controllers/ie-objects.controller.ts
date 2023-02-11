import { PlayerTicketService } from '@meemoo/admin-core-api';
import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Header,
	Headers,
	Logger,
	Param,
	Post,
	Query,
	Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { Request } from 'express';

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
import { limitMetadata } from '../helpers/limit-metadata';
import {
	IeObject,
	IeObjectLicense,
	IeObjectSeo,
	IeObjectsVisitorSpaceInfo,
	IeObjectsWithAggregations,
} from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus } from '~generated/graphql-db-types-hetarchief';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { Organisation } from '~modules/organisations/organisations.types';
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
		private translationsService: TranslationsService,
		private eventsService: EventsService,
		private visitsService: VisitsService,
		private playerTicketService: PlayerTicketService,
		private organisationService: OrganisationsService
	) {}

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
	public async getIeObjectById(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObject | Partial<IeObject>> {
		const object = await this.ieObjectsService.findBySchemaIdentifier(id, referer);

		const { organisation, visitorSpaceAccessInfo } =
			await this.getVistorSpaceAccessInfoAndOrganisation(user);

		const limitedObject = limitAccessToObjectDetails(object, {
			userId: user.getId(),
			isKeyUser: user.getIsKeyUser(),
			sector: organisation?.sector || null,
			groupId: user.getGroupId(),
			maintainerId: user.getMaintainerId() || null,
			accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
			accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
		});

		return limitedObject;
	}

	@Get('seo/:id')
	public async getIeObjectSeoById(
		@Headers('referer') referer: string,
		@Param('id') id: string
	): Promise<IeObjectSeo> {
		const ieObject = await this.ieObjectsService.findBySchemaIdentifier(id, referer);

		const hasPublicAccess = ieObject?.licenses.some((license: IeObjectLicense) =>
			[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL].includes(
				license
			)
		);
		return {
			name: hasPublicAccess ? ieObject?.name : null,
		};
	}

	@Get(':id/export')
	@Header('Content-Type', 'text/xml')
	@RequireAllPermissions(Permission.EXPORT_OBJECT)
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

	@Get(':schemaIdentifier/related/:meemooIdentifier')
	public async getRelated(
		@Headers('referer') referer: string,
		@Param('schemaIdentifier') schemaIdentifier: string,
		@Param('meemooIdentifier') meemooIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const { organisation, visitorSpaceAccessInfo } =
			await this.getVistorSpaceAccessInfoAndOrganisation(user);

		// We use the esIndex as the maintainerId -- no need to lowercase
		const relatedIeObjects = await this.ieObjectsService.getRelated(
			schemaIdentifier,
			meemooIdentifier,
			referer
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedRelatedIeObjects = {
			...relatedIeObjects,
			items: relatedIeObjects.items.map((item) =>
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

		return licensedRelatedIeObjects;
	}

	@Get('related/count')
	public async countRelated(
		@Query() countRelatedQuery: IeObjectMeemooIdentifiersQueryDto
	): Promise<Record<string, number>> {
		return this.ieObjectsService.countRelated(countRelatedQuery.meemooIdentifiers);
	}

	@Get(':id/similar')
	public async getSimilar(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const { organisation, visitorSpaceAccessInfo } =
			await this.getVistorSpaceAccessInfoAndOrganisation(user);

		const similarIeObjects = await this.ieObjectsService.getSimilar(id, '_all', referer);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedSimilarIeObjects = {
			...similarIeObjects,
			items: similarIeObjects.items.map((item) =>
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

		return licensedSimilarIeObjects;
	}

	@Post()
	public async getIeObjects(
		@Headers('referer') referer: string,
		@Body() queryDto: IeObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObjectsWithAggregations> {
		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		const { organisation, visitorSpaceAccessInfo } =
			await this.getVistorSpaceAccessInfoAndOrganisation(user);

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

	protected async getVistorSpaceAccessInfoAndOrganisation(user: SessionUserEntity): Promise<{
		visitorSpaceAccessInfo: IeObjectsVisitorSpaceInfo;
		organisation: Organisation;
	}> {
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

		return {
			organisation,
			visitorSpaceAccessInfo: {
				objectIds: visitorSpaceAccessInfo.objectIds,
				visitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			},
		};
	}
}
