import { PlayerTicketController, PlayerTicketService } from '@meemoo/admin-core-api';
import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Header,
	Headers,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { Request, Response } from 'express';
import { compact, intersection, isNil, kebabCase } from 'lodash';

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
	FilterOptions,
	IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	IeObjectSeo,
	IeObjectsWithAggregations,
	NewspaperTitle,
} from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import {
	ALL_INDEXES,
	IeObjectsSearchFilterField,
	Operator,
} from '~modules/ie-objects/elasticsearch/elasticsearch.consts';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName, Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { EventsHelper } from '~shared/helpers/events';
import { getIpFromRequest } from '~shared/helpers/get-ip-from-request';

@ApiTags('Ie Objects')
@Controller('ie-objects')
export class IeObjectsController {
	constructor(
		private ieObjectsService: IeObjectsService,
		private eventsService: EventsService,
		private playerTicketService: PlayerTicketService,
		private playerTicketController: PlayerTicketController
	) {}

	@Get('player-ticket')
	public async getPlayableUrl(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Query() playerTicketsQuery: PlayerTicketsQueryDto
	): Promise<string> {
		const schemaIdentifier = decodeURIComponent(playerTicketsQuery.schemaIdentifier);
		return this.playerTicketController.getPlayableUrlFromBrowsePath(
			schemaIdentifier,
			referer,
			getIpFromRequest(request)
		);
	}

	@Get('thumbnail-ticket')
	public async getThumbnailUrl(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Query() thumbnailQuery: ThumbnailQueryDto
	): Promise<string> {
		return this.playerTicketService.getThumbnailUrl(
			thumbnailQuery.id,
			referer,
			getIpFromRequest(request)
		);
	}

	@Get('newspaper-titles')
	public async getNewspaperTitles(): Promise<NewspaperTitle[]> {
		return this.ieObjectsService.getNewspaperTitles();
	}

	@Get('filter-options')
	public async getFilterOptions(): Promise<FilterOptions> {
		return this.ieObjectsService.getFilterOptions();
	}

	@Get('seo/:id')
	public async getIeObjectSeoById(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Param('id') id: string
	): Promise<IeObjectSeo> {
		const ieObject = await this.ieObjectsService.findBySchemaIdentifier(
			[id],
			referer,
			getIpFromRequest(request)
		)[0];

		const hasPublicAccess = ieObject?.licenses.some((license: IeObjectLicense) =>
			[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL].includes(
				license
			)
		);
		return {
			name: hasPublicAccess ? ieObject?.name : null,
			description: hasPublicAccess ? ieObject?.description : null,
		};
	}

	@Get(':id/export/xml')
	@Header('Content-Type', 'text/xml')
	@RequireAllPermissions(Permission.EXPORT_OBJECT)
	public async exportXml(
		@Param('id') id: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const objectMetadata = await this.ieObjectsService.findMetadataBySchemaIdentifier(
			id,
			getIpFromRequest(request)
		);

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.METADATA_EXPORT,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					or_id: objectMetadata.maintainerId,
				},
			},
		]);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const xmlContent = convertObjectToXml(
			limitAccessToObjectDetails(objectMetadata, {
				userId: user.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			})
		);
		res.set({
			'Content-Disposition': `attachment; filename=${
				kebabCase(objectMetadata?.name) || 'metadata'
			}.xml`,
		});
		res.send(xmlContent);
	}

	@Get(':id/export/csv')
	@Header('Content-Type', 'text/csv')
	@RequireAllPermissions(Permission.EXPORT_OBJECT)
	public async exportCsv(
		@Param('id') id: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const objectMetadata = await this.ieObjectsService.findMetadataBySchemaIdentifier(
			id,
			getIpFromRequest(request)
		);

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.METADATA_EXPORT,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					or_id: objectMetadata.maintainerId,
				},
			},
		]);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const csvContent = convertObjectToCsv(
			limitAccessToObjectDetails(objectMetadata, {
				userId: user.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			})
		);
		res.set({
			'Content-Disposition': `attachment; filename=${
				kebabCase(objectMetadata?.name) || 'metadata'
			}.csv`,
		});
		res.send(csvContent);
	}

	@Get(':schemaIdentifier/related/:meemooIdentifier')
	@ApiOperation({
		description:
			'Get objects that cover the same subject as the passed object schema identifier.',
	})
	public async getRelated(
		@Headers('referer') referer: string,
		@Req() request: Request,
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
			getIpFromRequest(request),
			ieObjectRelatedQueryDto
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedRelatedIeObjects = {
			...relatedIeObjects,

			// TODO: avoid compact in this location, since we want the getRelated function to only return objects that will not be completely censored to null by the limitAccessToObjectDetails function
			items: compact(
				relatedIeObjects.items.map((item) =>
					limitAccessToObjectDetails(item, {
						userId: user.getId(),
						isKeyUser: user.getIsKeyUser(),
						sector: user.getSector(),
						groupId: user.getGroupId(),
						maintainerId: user.getOrganisationId(),
						accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
						accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
					})
				)
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
		@Req() request: Request,
		@Param('id') id: string,
		@Query() ieObjectSimilarQueryDto: IeObjectsSimilarQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const similarIeObjectsResponse = await this.ieObjectsService.getSimilar(
			id,
			referer,
			getIpFromRequest(request),
			ieObjectSimilarQueryDto,
			4,
			user
		);

		const similarIeObjects = compact(
			(similarIeObjectsResponse.items || []).map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId(),
					isKeyUser: user.getIsKeyUser(),
					sector: user.getSector(),
					groupId: user.getGroupId(),
					maintainerId: user.getOrganisationId(),
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
			)
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		return {
			items: similarIeObjects,
			total: similarIeObjects.length,
			pages: 1,
			page: 1,
			size: similarIeObjects.length,
		};
	}

	@Post()
	public async getIeObjects(
		@Headers('referer') referer: string,
		@Body() queryDto: IeObjectsQueryDto | null,
		@SessionUser() user: SessionUserEntity | null,
		@Req() request: Request
	): Promise<IeObjectsWithAggregations> {
		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		// Get active visits for the current user
		// Need this to retrieve visitorSpaceAccessInfo
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		// Only search in the visitor space elasticsearch index if the user is searching inside a visitor space
		const maintainerFilter = queryDto?.filters?.find(
			(filter) =>
				filter.field === IeObjectsSearchFilterField.MAINTAINER_ID &&
				filter.operator === Operator.IS
		);
		const esIndex = maintainerFilter?.value?.toLowerCase() || ALL_INDEXES;

		// Get elastic search result based on given parameters
		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			esIndex,
			referer,
			getIpFromRequest(request),
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
					maintainerId: user.getOrganisationId(),
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
			),
		};

		// TODO remove this hack and fix this bug
		// This hacky patch is added so the client doesn't completely break and shows some of the valid results
		if (licensedSearchResult.items.filter((item) => isNil(item)).length > 0) {
			// Response should never contain null objects because the client crashes on null objects
			// The elasticsearch query should be constructed in a way so that all objects that elasticsearch returns can be fully or partially visible to the current user
			console.error({
				message:
					'Response should never contain null objects because the client crashes on null objects\n' +
					'The elasticsearch query should be constructed in a way so that all objects that elasticsearch returns can be fully or partially visible to the current user',
				licensedSearchResultItems: licensedSearchResult.items,
				searchResultItems: searchResult.items,
			});
			licensedSearchResult.items = licensedSearchResult.items.map((item) => item || {});
		}

		return licensedSearchResult;
	}

	@Get(':id')
	public async getIeObjectById(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Param('id') id: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObject | Partial<IeObject>> {
		const ieObjects: IeObject[] = await this.ieObjectsService.findBySchemaIdentifier(
			[id],
			referer,
			getIpFromRequest(request)
		);
		const ieObject = ieObjects[0];

		if (!ieObject) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const limitedObject = limitAccessToObjectDetails(ieObject, {
			userId: user.getId(),
			isKeyUser: user.getIsKeyUser(),
			sector: user.getSector(),
			groupId: user.getGroupId(),
			maintainerId: user.getOrganisationId(),
			accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
			accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
		});

		if (!limitedObject) {
			throw new ForbiddenException('You do not have access to this object');
		}

		// Meemoo admin user always has VISITOR_SPACE_FULL in accessThrough when object has BEZOEKERTOOL licences
		if (
			user.getGroupName() === GroupName.MEEMOO_ADMIN &&
			visitorSpaceAccessInfo.visitorSpaceIds.includes(limitedObject.maintainerId) &&
			intersection(limitedObject?.licenses, [
				IeObjectLicense.BEZOEKERTOOL_CONTENT,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			]).length > 0
		) {
			limitedObject?.accessThrough.push(IeObjectAccessThrough.VISITOR_SPACE_FULL);
		}

		return limitedObject;
	}

	@Get()
	public async getIeObjectByIds(
		@Query('id') ids: string[],
		@Headers('referer') referer: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObject[] | Partial<IeObject>[]> {
		const ieObjects: IeObject[] = await this.ieObjectsService.findBySchemaIdentifier(
			ids,
			referer,
			getIpFromRequest(request)
		);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		return ieObjects.map((ieObject) => {
			const limitedObject = limitAccessToObjectDetails(ieObject, {
				userId: user.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			});

			if (!limitedObject) {
				throw new ForbiddenException('You do not have access to this object');
			}

			// Meemoo admin user always has VISITOR_SPACE_FULL in accessThrough when object has BEZOEKERTOOL licences
			if (
				user.getGroupName() === GroupName.MEEMOO_ADMIN &&
				visitorSpaceAccessInfo.visitorSpaceIds.includes(limitedObject.maintainerId) &&
				intersection(limitedObject?.licenses, [
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				]).length > 0
			) {
				limitedObject?.accessThrough.push(IeObjectAccessThrough.VISITOR_SPACE_FULL);
			}

			return limitedObject;
		});
	}
}
