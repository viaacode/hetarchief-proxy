import { PlayerTicketService, TranslationsService } from '@meemoo/admin-core-api';
import { Body, Controller, Get, Header, Headers, Param, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { Request } from 'express';

import {
	IeObjectsMeemooIdentifiersQueryDto,
	IeObjectsQueryDto,
	IeObjectsRelatedQueryDto,
	IeObjectsSimilarQueryDto,
	PlayerTicketsQueryDto,
	ThumbnailQueryDto,
} from '../dto/ie-objects.dto';
import { checkAndFixFormatFilter } from '../helpers/check-and-fix-format-filter';
import { convertObjectToCsv } from '../helpers/convert-objects-to-csv';
import { convertObjectToXml } from '../helpers/convert-objects-to-xml';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import {
	IeObject,
	IeObjectLicense,
	IeObjectSeo,
	IeObjectsWithAggregations,
} from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Ie Objects')
@Controller('ie-objects')
export class IeObjectsController {
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
		let ieObject = await this.ieObjectsService.findBySchemaIdentifier(id, referer);

		const organisation = await this.organisationService.findOrganisationBySchemaIdentifier(
			ieObject.schemaIdentifier
		);

		ieObject = {
			...ieObject,
			maintainerFromUrl: organisation?.formUrl || null,
		};

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const limitedObject = limitAccessToObjectDetails(ieObject, {
			userId: user.getId(),
			isKeyUser: user.getIsKeyUser(),
			sector: user.getSector(),
			groupId: user.getGroupId(),
			maintainerId: user.getMaintainerId(),
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

	// TODO: rewrite export with limited access
	@Get(':id/export/xml')
	@Header('Content-Type', 'text/xml')
	@RequireAllPermissions(Permission.EXPORT_OBJECT)
	public async exportXml(
		@Param('id') id: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<string> {
		const objectMetadata = await this.ieObjectsService.findMetadataBySchemaIdentifier(id);

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

		return convertObjectToXml(objectMetadata);
	}

	@Get(':id/export/csv')
	@Header('Content-Type', 'text/csv')
	@RequireAllPermissions(Permission.EXPORT_OBJECT)
	public async exportCsv(
		@Param('id') id: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<string> {
		const objectMetadata = await this.ieObjectsService.findMetadataBySchemaIdentifier(id);

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

		return convertObjectToCsv(objectMetadata);
	}

	@Get(':schemaIdentifier/related/:meemooIdentifier')
	@ApiOperation({
		description:
			'Get objects that cover the same subject as the passed object schema identifier.',
	})
	public async getRelated(
		@Headers('referer') referer: string,
		@Param('schemaIdentifier') schemaIdentifier: string,
		@Param('meemooIdentifier') meemooIdentifier: string,
		@Query() ieObjectRelatedQueryDto: IeObjectsRelatedQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		// We use the esIndex as the maintainerId -- no need to lowercase
		const relatedIeObjects = await this.ieObjectsService.getRelated(
			schemaIdentifier,
			meemooIdentifier,
			referer,
			ieObjectRelatedQueryDto
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedRelatedIeObjects = {
			...relatedIeObjects,
			items: relatedIeObjects.items.map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId(),
					isKeyUser: user.getIsKeyUser(),
					sector: user.getSector(),
					groupId: user.getGroupId(),
					maintainerId: user.getMaintainerId(),
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
			),
		};

		return licensedRelatedIeObjects;
	}

	@Get('related/count')
	public async countRelated(
		@Query() countRelatedQuery: IeObjectsMeemooIdentifiersQueryDto
	): Promise<Record<string, number>> {
		return this.ieObjectsService.countRelated(countRelatedQuery.meemooIdentifiers);
	}

	@Get(':id/similar')
	@ApiOperation({
		description: 'Get objects that are similar based on the maintainerId.',
	})
	public async getSimilar(
		@Headers('referer') referer: string,
		@Param('id') id: string,
		@Query() ieObjectSimilarQueryDto: IeObjectsSimilarQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const similarIeObjects = await this.ieObjectsService.getSimilar(
			id,
			referer,
			ieObjectSimilarQueryDto
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedSimilarIeObjects = {
			...similarIeObjects,
			items: (similarIeObjects.items || []).map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId(),
					isKeyUser: user.getIsKeyUser(),
					sector: user.getSector(),
					groupId: user.getGroupId(),
					maintainerId: user.getMaintainerId(),
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
		@Body() queryDto: IeObjectsQueryDto | null,
		@SessionUser() user: SessionUserEntity | null
	): Promise<IeObjectsWithAggregations> {
		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		// Get active visits for the current user
		// Need this to retrieve visitorSpaceAccessInfo
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		// Get elastic search result based on given parameters
		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			'_all',
			referer,
			user,
			visitorSpaceAccessInfo
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedSearchResult = {
			...searchResult,
			items: searchResult.items.map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId(),
					isKeyUser: user.getIsKeyUser(),
					sector: user.getSector(),
					groupId: user.getGroupId(),
					maintainerId: user.getMaintainerId(),
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
			),
		};

		return licensedSearchResult;
	}
}
