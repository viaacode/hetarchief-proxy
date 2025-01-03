/* eslint-disable @typescript-eslint/consistent-type-imports */
// Disable consistent imports since they try to import IeObjectsQueryDto as a type
// But that breaks the endpoint body validation

import { PlayerTicketController, PlayerTicketService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import {
	BadRequestException,
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
import { type IPagination } from '@studiohyperdrive/pagination';
import { Request, Response } from 'express';
import { compact, intersection, isNil, kebabCase, without } from 'lodash';

import {
	IeObjectsQueryDto,
	IeObjectsSimilarQueryDto,
	PlayerTicketsQueryDto,
	ThumbnailQueryDto,
} from '../dto/ie-objects.dto';
import { checkAndFixFormatFilter } from '../helpers/check-and-fix-format-filter';
import { convertObjectToCsv } from '../helpers/convert-objects-to-csv';
import { convertObjectToXml } from '../helpers/convert-objects-to-xml';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import {
	AutocompleteField,
	type IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	type IeObjectSeo,
	type IeObjectsWithAggregations,
	RelatedIeObject,
	RelatedIeObjects,
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
import { GroupName } from '~modules/users/types';
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

	@Get('seo/:id')
	public async getIeObjectSeoById(
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Param('id') id: string
	): Promise<IeObjectSeo> {
		const ieObjects = await this.ieObjectsService.findBySchemaIdentifiers(
			[id],
			referer,
			getIpFromRequest(request)
		);
		const ieObject = ieObjects[0];

		const hasPublicAccess = ieObject?.licenses.some((license: IeObjectLicense) =>
			[
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.PUBLIEK_METADATA_ALL,
				IeObjectLicense.PUBLIEK_CONTENT,
			].includes(license)
		);

		const hasPublicAccessThumbnail = ieObject?.licenses.some((license: IeObjectLicense) =>
			[IeObjectLicense.PUBLIEK_METADATA_ALL, IeObjectLicense.PUBLIEK_CONTENT].includes(
				license
			)
		);
		return {
			name: hasPublicAccess ? ieObject?.name : null,
			description: hasPublicAccess ? ieObject?.description : null,
			thumbnailUrl: hasPublicAccessThumbnail ? ieObject?.thumbnailUrl : null,
		};
	}

	@Get(':id/export/xml')
	@Header('Content-Type', 'text/xml')
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
					type: objectMetadata?.dctermsFormat,
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
					type: objectMetadata?.dctermsFormat,
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

	@Get('schemaIdentifierLookup/:schemaIdentifierV2')
	@ApiOperation({
		description:
			'Returns the new schema identifier for hetarchief v3 when given the old schema identifier from hetarchief v2.',
	})
	public async identifierLookup(
		@Param('schemaIdentifierV2') schemaIdentifierV2: string
	): Promise<{ schemaIdentifierV3: string }> {
		return this.ieObjectsService.convertSchemaIdentifierV2ToV3(schemaIdentifierV2);
	}

	@Get('/related')
	@ApiOperation({
		description:
			'Get objects that cover the same subject as the passed object schema identifier.',
	})
	public async getRelatedIeObjects(
		@Query('ieObjectIri') ieObjectIri: string,
		@Headers('referer') referer: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<RelatedIeObjects> {
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const [parentIeObject, childIeObjects] = await Promise.all([
			this.ieObjectsService.getParentIeObject(
				ieObjectIri,
				referer,
				getIpFromRequest(request)
			),
			this.ieObjectsService.getChildIeObjects(
				ieObjectIri,
				referer,
				getIpFromRequest(request)
			),
		]);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const censoredParentIeObject: Partial<RelatedIeObject> | null = parentIeObject
			? limitAccessToObjectDetails(parentIeObject, {
					userId: user.getId(),
					isKeyUser: user.getIsKeyUser(),
					sector: user.getSector(),
					groupId: user.getGroupId(),
					maintainerId: user.getOrganisationId(),
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			  })
			: null;
		const censoredChildIeObjects: Partial<RelatedIeObject>[] = (childIeObjects || []).map(
			(childIeObject) =>
				limitAccessToObjectDetails(childIeObject, {
					userId: user.getId(),
					isKeyUser: user.getIsKeyUser(),
					sector: user.getSector(),
					groupId: user.getGroupId(),
					maintainerId: user.getOrganisationId(),
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
		);

		return {
			parent: censoredParentIeObject,
			children: censoredChildIeObjects,
		};
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
		try {
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
		} catch (err) {
			// TODO remove this try catch once this endpoint is stable again
			return {
				items: [],
				total: 0,
				pages: 1,
				page: 1,
				size: 0,
			};
		}
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

	@Get('alto-json')
	public async getAltoJson(@Query('altoJsonUrl') altoJsonUrl: string): Promise<any> {
		if (!/https:\/\/assets-[^.]+.hetarchief.be\/hetarchief/g.test(altoJsonUrl)) {
			throw new BadRequestException({
				message:
					"The provided url doesn't seem to be part of the whitelisted asset service urls.",
				additionalInfo: {
					altoJsonUrl,
				},
			});
		}
		const response = await fetch(altoJsonUrl);
		const text = await response.text();
		return JSON.parse(text);
	}

	@Get('metadata/autocomplete')
	public async getMetadataAutocomplete(
		@Query('field') field: AutocompleteField,
		@Query('query') query: string
	): Promise<string[]> {
		if (!Object.values(AutocompleteField).includes(field)) {
			throw new BadRequestException({
				message: 'Invalid field',
				additionalInfo: {
					field,
					acceptedFields: Object.values(AutocompleteField),
				},
			});
		}
		return this.ieObjectsService.getMetadataAutocomplete(field, query);
	}

	/**
	 * Endpoint to fetch next and previous ie-object id in a collection (eg: next newspaper edition in the newspaper series)
	 **/
	@Get('previous-next-ids')
	public async getNextPreviousIeObject(
		@Query('ieObjectIri') ieObjectIri: string,
		@Query('collectionId') collectionId: string
	): Promise<{ nextIeObjectId: string | null; previousIeObjectId: string | null }> {
		if (!collectionId) {
			throw new BadRequestException('Query param collectionId is required');
		}
		return this.ieObjectsService.getPreviousNextIeObject(collectionId, ieObjectIri);
	}

	/**
	 * Get ie objects by their schema identifiers
	 * @param ids
	 * @param referer
	 * @param request
	 * @param user
	 */
	@Get()
	public async getIeObjectByIds(
		@Query('id') ids: string[],
		@Headers('referer') referer: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObject[] | Partial<IeObject>[]> {
		const ieObjects: Partial<IeObject | null>[] =
			await this.ieObjectsService.findBySchemaIdentifiers(
				ids,
				referer,
				getIpFromRequest(request)
			);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const ieObjectsNotNull: Partial<IeObject>[] = compact(ieObjects);

		if (ieObjects.length !== ieObjectsNotNull.length) {
			throw new NotFoundException(
				new CustomError('Objects were not found by their schema identifiers', null, {
					idsNotFound: without(
						ids,
						...ieObjectsNotNull.map((ieObject) => ieObject.schemaIdentifier)
					),
				})
			);
		}

		return ieObjectsNotNull.map((ieObject) => {
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

	@Get(':id')
	public async getIeObjectById(
		@Param('id') id: string,
		@Headers('referer') referer: string,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObject | Partial<IeObject>> {
		const ieObjects: IeObject[] | Partial<IeObject>[] = await this.getIeObjectByIds(
			[id],
			referer,
			request,
			user
		);
		const ieObject = ieObjects[0];

		if (!ieObject) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return ieObject;
	}
}
