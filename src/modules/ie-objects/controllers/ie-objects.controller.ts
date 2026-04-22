/* eslint-disable @typescript-eslint/consistent-type-imports */
// Disable consistent imports since they try to import IeObjectsQueryDto as a type
// But that breaks the endpoint body validation

import { PlayerTicketController, PlayerTicketService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Header,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import type { IPagination } from '@studiohyperdrive/pagination';
import type { Request, Response } from 'express';
import { compact, intersection, isNil, kebabCase } from 'lodash';

import type { Configuration } from '~config';

import {
	IeObjectsAutocompleteQueryDto,
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
	IeObjectForAccessCheck,
	IeObjectLicense,
	type IeObjectSeo,
	type IeObjectsWithAggregations,
	IeObjectType,
	type RelatedIeObject,
	type RelatedIeObjects,
} from '../ie-objects.types';

import { IeObjectsService } from '../services/ie-objects.service';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { mapLimit } from 'blend-promise-utils';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import {
	ALL_INDEXES,
	IeObjectsSearchFilterField,
	Operator,
	OrderProperty,
} from '~modules/ie-objects/elasticsearch/elasticsearch.consts';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import { ERROR_CODE } from '~modules/ie-objects/ie-objects.conts';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { AUDIO_WAVE_FORM_URL } from '~shared/consts/audio-wave-form-url';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { customError } from '~shared/helpers/custom-error';
import { EventsHelper } from '~shared/helpers/events';
import { SortDirection } from '~shared/types';

@ApiTags('Ie Objects')
@Controller('ie-objects')
export class IeObjectsController {
	constructor(
		private ieObjectsService: IeObjectsService,
		private eventsService: EventsService,
		private playerTicketService: PlayerTicketService,
		private playerTicketController: PlayerTicketController,
		private configService: ConfigService<Configuration>
	) {}

	@Get('player-ticket')
	@ApiOperation({ summary: 'Get a playable URL for a given browse path' })
	@ApiQuery({
		name: 'browsePath',
		required: true,
		description: 'The browse path of the media file',
	})
	@ApiOkResponse({ description: 'Returns the playable URL as a string' })
	@ApiBadRequestResponse({ description: 'Browse path is missing or invalid' })
	public async getPlayableUrl(
		@Referer() referer: string,
		@Ip() ip: string,
		@Query() playerTicketsQuery: PlayerTicketsQueryDto
	): Promise<string> {
		return this.playerTicketController.getPlayableUrlFromBrowsePath(
			playerTicketsQuery.browsePath,
			referer,
			ip
		);
	}

	/**
	 * Get a ticket to be able to see a certain file path
	 * @param referer
	 * @param ip
	 * @param filePaths eg: image/3/public%252FOR-1c1tf48%252F13%252F13cdb1aa21704313a6ded7da5fabf53f0a9571a68c6540e18725440376c089c2813e3eec887041e1ab908a4c20a46d15.jp2
	 */
	@Get('ticket-service')
	@ApiOperation({ summary: 'Get ticket service tokens for one or more file paths' })
	@ApiQuery({
		name: 'filePaths',
		required: true,
		isArray: true,
		description: 'File paths to request tickets for',
	})
	@ApiOkResponse({ description: 'Returns an array of ticket tokens' })
	@ApiBadRequestResponse({ description: 'filePaths query param is missing' })
	public async getTicketServiceTokens(
		@Referer() referer: string,
		@Ip() ip: string,
		@Query('filePaths') filePaths: string[]
	): Promise<string[]> {
		if (!filePaths || filePaths.length === 0) {
			throw new BadRequestException('Query param filePaths is required');
		}
		try {
			return await Promise.all(
				filePaths.map((filePath) =>
					this.playerTicketController.getTicketServiceTokenForFilePath(filePath, referer, ip)
				)
			);
		} catch (err) {
			throw customError('Failed to get tickets for filePaths', err, {
				filePaths,
				referer,
			});
		}
	}

	@Get('thumbnail-ticket')
	@ApiOperation({ summary: 'Get a thumbnail URL for a given ie-object id' })
	@ApiQuery({
		name: 'id',
		required: true,
		description: 'The ie-object id to get the thumbnail URL for',
	})
	@ApiOkResponse({ description: 'Returns the thumbnail URL as a string' })
	public async getThumbnailUrl(
		@Referer() referer: string,
		@Ip() ip: string,
		@Query() thumbnailQuery: ThumbnailQueryDto
	): Promise<string> {
		return this.playerTicketService.getThumbnailUrl(thumbnailQuery.id, referer, ip);
	}

	@Get('seo/:schemaIdentifier')
	@ApiOperation({ summary: 'Get SEO metadata for an ie-object by schema identifier' })
	@ApiParam({
		name: 'schemaIdentifier',
		description: 'The schema identifier of the ie-object',
		example: '086348mc8s',
	})
	@ApiOkResponse({ description: 'Returns SEO metadata for the ie-object' })
	@ApiNotFoundResponse({ description: 'Ie-object not found' })
	public async getIeObjectSeoById(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('schemaIdentifier') schemaIdentifier: string
	): Promise<IeObjectSeo> {
		const ieObjectId =
			await this.ieObjectsService.getObjectIdBySchemaIdentifierCached(schemaIdentifier);
		const ieObject = await this.ieObjectsService.findByIeObjectId(ieObjectId, true, referer, ip);

		const hasPublicAccess = ieObject?.licenses.some((license: IeObjectLicense) =>
			[
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.PUBLIEK_METADATA_ALL,
				IeObjectLicense.PUBLIEK_CONTENT,
			].includes(license)
		);

		const isPublicDomain: boolean =
			ieObject?.licenses.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
			ieObject?.licenses.includes(IeObjectLicense.PUBLIC_DOMAIN);
		return {
			name: hasPublicAccess ? ieObject?.name : null,
			description: hasPublicAccess ? ieObject?.description : null,
			maintainerSlug: ieObject?.maintainerSlug || null,
			thumbnailUrl: isPublicDomain
				? ieObject.thumbnailUrl
				: `${process.env.CLIENT_HOST}/images/og.jpg`,
		};
	}

	/**
	 * Export metadata to xml
	 * @param ip
	 * @param ieObjectId ieObjectId (eg: https://data.hetarchief.be/id/entity/086348mc8s)
	 * @param currentPageUrl The current page that is open on the client's browser (for event logging purposes)
	 * @param referer
	 * @param request
	 * @param res
	 * @param user
	 */
	@Get('export/xml')
	@Header('Content-Type', 'text/xml')
	@ApiOperation({ summary: 'Export ie-object metadata as XML' })
	@ApiQuery({
		name: 'ieObjectId',
		required: true,
		description: 'The IRI object id of the ie-object',
		example: 'https://data.hetarchief.be/id/entity/086348mc8s',
	})
	@ApiQuery({
		name: 'currentPageUrl',
		required: false,
		description: 'The current page URL open in the client browser (used for event logging)',
	})
	@ApiOkResponse({ description: 'Returns the metadata as an XML file download' })
	@ApiNotFoundResponse({ description: 'Object not found' })
	public async exportXml(
		@Query('ieObjectId') ieObjectId: string,
		@Query('currentPageUrl') currentPageUrl: string,
		@Referer() referer: string,
		@Ip() ip: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const objectMetadata = await this.ieObjectsService.findMetadataByIeObjectId(
			ieObjectId,
			null,
			ip
		);

		if (!objectMetadata) {
			throw new NotFoundException('Object not found');
		}

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.METADATA_EXPORT,
				source: currentPageUrl || referer || request.path,
				subject: user?.getId(),
				time: new Date().toISOString(),
				data: {
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					or_id: objectMetadata.maintainerId,
					type: mapDcTermsFormatToSimpleType(objectMetadata?.dctermsFormat),
				},
			},
		]);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const xmlContent = convertObjectToXml(
			limitAccessToObjectDetails(objectMetadata as IeObjectForAccessCheck, {
				userId: user?.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			}),
			this.configService.get('CLIENT_HOST')
		);
		res.set({
			'Content-Disposition': `attachment; filename=${
				kebabCase(objectMetadata?.name) || 'metadata'
			}.xml`,
		});
		res.send(xmlContent);
	}

	/**
	 * Export metadata to csv
	 * @param referer
	 * @param ip
	 * @param ieObjectId The iri object id of the ie object (eg: https://data.hetarchief.be/id/entity/086348mc8s)
	 * @param currentPageUrl
	 * @param request
	 * @param res
	 * @param user
	 */
	@Get('export/csv')
	@Header('Content-Type', 'text/csv')
	@ApiOperation({ summary: 'Export ie-object metadata as CSV' })
	@ApiQuery({
		name: 'ieObjectId',
		required: true,
		description: 'The IRI object id of the ie-object',
		example: 'https://data.hetarchief.be/id/entity/086348mc8s',
	})
	@ApiQuery({
		name: 'currentPageUrl',
		required: false,
		description: 'The current page URL open in the client browser (used for event logging)',
	})
	@ApiOkResponse({ description: 'Returns the metadata as a CSV file download' })
	@ApiNotFoundResponse({ description: 'Object not found' })
	public async exportCsv(
		@Query('ieObjectId') ieObjectId: string,
		@Query('currentPageUrl') currentPageUrl: string,
		@Referer() referer: string,
		@Ip() ip: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const objectMetadata = await this.ieObjectsService.findMetadataByIeObjectId(
			ieObjectId,
			null,
			ip
		);

		if (!objectMetadata) {
			throw new NotFoundException('Object not found');
		}

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.METADATA_EXPORT,
				source: currentPageUrl || referer || request.path,
				subject: user?.getId(),
				time: new Date().toISOString(),
				data: {
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					or_id: objectMetadata.maintainerId,
					type: mapDcTermsFormatToSimpleType(objectMetadata?.dctermsFormat),
				},
			},
		]);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const censoredObjectMetadata = limitAccessToObjectDetails(
			objectMetadata as IeObjectForAccessCheck,
			{
				userId: user?.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			}
		);

		const csvContent = convertObjectToCsv(censoredObjectMetadata);
		res.set({
			'Content-Disposition': `attachment; filename=${
				kebabCase(objectMetadata?.name) || 'metadata'
			}.csv`,
		});
		res.send(csvContent);
	}

	/**
	 * Lookup hetarchief v3 id from the hetarchief v2 id
	 * @param schemaIdentifierV2
	 */
	@Get('lookup/v2/:schemaIdentifierV2')
	@ApiOperation({
		summary: 'Lookup hetarchief v3 id from the hetarchief v2 id',
		description:
			'Returns the new schema identifier for hetarchief v3 when given the old schema identifier from hetarchief v2.',
	})
	@ApiParam({ name: 'schemaIdentifierV2', description: 'The old hetarchief v2 schema identifier' })
	@ApiOkResponse({ description: 'Returns the new v3 schema identifier' })
	@ApiNotFoundResponse({ description: 'No ie-object found for the given v2 schema identifier' })
	public async lookupV2Id(
		@Param('schemaIdentifierV2') schemaIdentifierV2: string
	): Promise<{ schemaIdentifierV3: string }> {
		return this.ieObjectsService.lookupSchemaIdentifierV2ToV3(schemaIdentifierV2);
	}

	/**
	 * Lookup hetarchief v3 id from the mediamosa id from news of the great war website
	 * @param mediaMosaId
	 */
	@Get('lookup/nvdgo/:mediaMosaId')
	@ApiOperation({
		summary: 'Lookup ie-object info from a news of the great war mediaMosa id',
		description:
			'Returns the new ie-object info for hetarchief v3 when given the old news of the great war media mosa id.',
	})
	@ApiParam({
		name: 'mediaMosaId',
		description: 'The mediaMosa id from the news of the great war website',
	})
	@ApiOkResponse({ description: 'Returns the schema identifier, title, and maintainer slug' })
	@ApiNotFoundResponse({ description: 'No ie-object found for the given mediaMosaId' })
	public async lookupNvdgoId(
		@Param('mediaMosaId') mediaMosaId: string
	): Promise<{ schema_identifier: string; title: string; maintainerSlug: string }> {
		const response = await this.ieObjectsService.lookupMediaMosaIdToV3(mediaMosaId);
		if (!response) {
			throw new NotFoundException(`No ie-object found for the given mediaMosaId: ${mediaMosaId}`);
		}
		return response;
	}

	@Get('/related')
	@ApiOperation({
		summary: 'Get related ie-objects (parent and children)',
		description: 'Get objects that cover the same subject as the passed object schema identifier.',
	})
	@ApiQuery({
		name: 'ieObjectIri',
		required: true,
		description: 'The IRI of the ie-object',
		example: 'https://data.hetarchief.be/id/entity/086348mc8s',
	})
	@ApiOkResponse({ description: 'Returns parent and children ie-objects' })
	public async getRelatedIeObjects(
		@Query('ieObjectIri') ieObjectIri: string,
		@Referer() referer: string,
		@Ip() ip: string,
		@SessionUser() user: SessionUserEntity
	): Promise<RelatedIeObjects> {
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const [parentIeObject, childIeObjects] = await Promise.all([
			this.ieObjectsService.getParentIeObject(ieObjectIri, referer, ip),
			this.ieObjectsService.getChildIeObjects(ieObjectIri, referer, ip),
		]);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const censoredParentIeObject: Partial<RelatedIeObject> | null = parentIeObject
			? limitAccessToObjectDetails(parentIeObject, {
					userId: user?.getId(),
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
					userId: user?.getId(),
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

	/**
	 * Get objects that are similar
	 * @param referer
	 * @param ip
	 * @param schemaIdentifier schema identifier of the object. eg: 086348mc8s
	 * @param ieObjectSimilarQueryDto
	 * @param user
	 */
	@Get(':schemaIdentifier/similar')
	@ApiOperation({
		summary: 'Get similar ie-objects',
		description: 'Get objects that are similar based on the maintainerId.',
	})
	@ApiParam({
		name: 'schemaIdentifier',
		description: 'Schema identifier of the ie-object',
		example: '086348mc8s',
	})
	@ApiOkResponse({ description: 'Returns a paginated list of similar ie-objects' })
	public async getSimilar(
		@Referer() referer: string,
		@Ip() ip: string,
		@Param('schemaIdentifier') schemaIdentifier: string,
		@Query() ieObjectSimilarQueryDto: IeObjectsSimilarQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Partial<IeObject>>> {
		try {
			const visitorSpaceAccessInfo =
				await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

			const similarIeObjectsResponse = await this.ieObjectsService.getSimilar(
				schemaIdentifier,
				referer,
				ip,
				ieObjectSimilarQueryDto,
				4,
				user
			);

			const similarIeObjects = compact(
				(similarIeObjectsResponse.items || []).map((item) =>
					limitAccessToObjectDetails(item, {
						userId: user?.getId(),
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
	@ApiOperation({
		summary: 'Search ie-objects',
		description: 'Search and filter ie-objects using Elasticsearch',
	})
	@ApiBody({
		type: IeObjectsQueryDto,
		required: false,
		description: 'Query filters and pagination settings',
	})
	@ApiOkResponse({ description: 'Returns a list of ie-objects with aggregations' })
	public async getIeObjects(
		@Referer() referer: string,
		@Ip() ip: string,
		@Body() queryDto: IeObjectsQueryDto | null,
		@SessionUser() user: SessionUserEntity | null
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
				filter.field === IeObjectsSearchFilterField.MAINTAINER_ID && filter.operator === Operator.IS
		);
		const esIndex = maintainerFilter?.value?.toLowerCase() || ALL_INDEXES;

		// Get elastic search result based on given parameters
		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			esIndex,
			referer,
			ip,
			user,
			visitorSpaceAccessInfo
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedSearchResult = {
			...searchResult,
			items: searchResult.items.map((item) =>
				limitAccessToObjectDetails(item as IeObjectForAccessCheck, {
					userId: user?.getId(),
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
	@ApiOperation({ summary: 'Fetch ALTO JSON from a whitelisted URL' })
	@ApiQuery({
		name: 'altoJsonUrl',
		required: true,
		description: 'The URL to fetch the ALTO JSON from (must be from a whitelisted domain)',
	})
	@ApiOkResponse({ description: 'Returns the parsed ALTO JSON content' })
	@ApiBadRequestResponse({
		description: 'The provided URL is not part of the whitelisted asset service URLs',
	})
	public async getAltoJson(@Query('altoJsonUrl') altoJsonUrl: string): Promise<any> {
		const WHITELISTED_DOMAINS = (process.env.ALTO_JSON_WHITELISTED_DOMAINS || '')
			.split(',')
			.map((domain) => new RegExp(domain.trim()));
		if (!WHITELISTED_DOMAINS.some((regex) => regex.test(altoJsonUrl))) {
			throw new BadRequestException({
				message: "The provided url doesn't seem to be part of the whitelisted asset service urls.",
				additionalInfo: {
					altoJsonUrl,
					WHITELISTED_DOMAINS: WHITELISTED_DOMAINS.map((regex) => regex.toString()),
				},
			});
		}

		let responseText: string | null = null;
		try {
			const response = await fetch(altoJsonUrl);
			responseText = await response.text();

			return JSON.parse(responseText);
		} catch (err) {
			console.error(
				customError('Failed to get alto json', err, {
					altoJsonUrl,
					responseText,
				})
			);
			throw customError('Failed to get alto json', null, {
				altoJsonUrl,
				responseText,
			});
		}
	}

	@Post('metadata/autocomplete')
	@ApiOperation({ summary: 'Get metadata autocomplete suggestions for a given field' })
	@ApiBody({
		type: IeObjectsAutocompleteQueryDto,
		required: true,
		description: 'Autocomplete query with field, optional query string, and filters',
	})
	@ApiOkResponse({ description: 'Returns an array of autocomplete suggestion strings' })
	@ApiBadRequestResponse({ description: 'Invalid or missing field, or missing filters' })
	public async getMetadataAutocomplete(
		@Body() queryDto: IeObjectsAutocompleteQueryDto | null
	): Promise<string[]> {
		if (!Object.values(AutocompleteField).includes(queryDto?.field)) {
			throw new BadRequestException({
				message: 'Invalid field',
				additionalInfo: {
					field: queryDto?.field,
					acceptedFields: Object.values(AutocompleteField),
				},
			});
		}
		if (!queryDto?.filters) {
			throw new BadRequestException('Body param filters is required');
		}
		return this.ieObjectsService.getMetadataAutocomplete(queryDto.field, queryDto.query || '', {
			filters: queryDto.filters,
			page: 1,
			size: 2000,
			orderProp: OrderProperty.RELEVANCE,
			orderDirection: SortDirection.desc,
		});
	}

	/**
	 * Endpoint to fetch next and previous ie-object id in a collection (eg: next newspaper edition in the newspaper series)
	 **/
	@Get('previous-next-ids')
	@ApiOperation({
		summary: 'Get previous and next ie-object ids in a collection',
		description:
			'Fetch the next and previous ie-object id in a collection (e.g. next newspaper edition in a newspaper series)',
	})
	@ApiQuery({
		name: 'ieObjectIri',
		required: true,
		description: 'The IRI of the current ie-object',
	})
	@ApiQuery({
		name: 'collectionId',
		required: true,
		description: 'The id of the collection to navigate in',
	})
	@ApiOkResponse({ description: 'Returns the next and previous ie-object ids' })
	@ApiBadRequestResponse({ description: 'collectionId query param is missing' })
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
	 * Get ie object thumbnail by their ids (schema identifiers)
	 * @param schemaIdentifiers ie object schema_identifiers. eg: 086348mc8s, qstt4fps28
	 * @param referer site making the request. eg: https://qas-v3.hetarchief.be
	 * @param ip Ip of the client making the request. eg: 172.17.45.216
	 * @param user Currently logged-in user
	 */
	@Get('thumbnails')
	@ApiOperation({ summary: 'Get ie-object thumbnails by schema identifiers' })
	@ApiQuery({
		name: 'ids',
		required: true,
		isArray: true,
		description: 'The schema identifiers of the ie-objects',
		example: ['086348mc8s', 'qstt4fps28'],
	})
	@ApiOkResponse({
		description: 'Returns an array of schema identifiers with their (possibly null) thumbnail URLs',
	})
	@ApiForbiddenResponse({
		description: 'You do not have access to one or more of the requested objects',
	})
	public async getIeObjectThumbnailsByIds(
		@Query('ids') schemaIdentifiers: string[],
		@Referer() referer: string | null,
		@Ip() ip: string,
		@SessionUser() user: SessionUserEntity
	): Promise<
		{
			schemaIdentifier: string;
			thumbnailUrl: string | null;
		}[]
	> {
		let ids: string[];
		if (typeof schemaIdentifiers === 'string') {
			ids = [schemaIdentifiers];
		} else {
			ids = schemaIdentifiers;
		}

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const thumbnailInfos: {
			schemaIdentifier: string;
			thumbnailUrl: string | null;
		}[] = await mapLimit(
			ids,
			12,
			async (
				schemaIdentifier: string
			): Promise<{
				schemaIdentifier: string;
				thumbnailUrl: string | null;
			} | null> => {
				if (
					!schemaIdentifier ||
					schemaIdentifier.length === 0 ||
					schemaIdentifier.includes('.well-known')
				) {
					return null;
				}

				const ieObjectId =
					await this.ieObjectsService.getObjectIdBySchemaIdentifierCached(schemaIdentifier);
				const ieObject = await this.ieObjectsService.findThumbnailByIeObjectId(ieObjectId);

				// Censor the object based on the licenses and sector
				// Only leave the properties that the current user can see of this object
				const limitedObject = limitAccessToObjectDetails(ieObject, {
					userId: user?.getId(),
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

				if (!Object.keys(limitedObject).includes('thumbnailUrl')) {
					return {
						schemaIdentifier: limitedObject.schemaIdentifier || null,
						thumbnailUrl: null,
					}; // If you're not allowed to see the thumbnail, return null
				}

				if (mapDcTermsFormatToSimpleType(ieObject?.dctermsFormat) === IeObjectType.AUDIO) {
					return {
						schemaIdentifier: ieObject.schemaIdentifier || null,
						thumbnailUrl: AUDIO_WAVE_FORM_URL,
					}; // avoid the ugly speaker
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

				// Add token to the thumbnail URL
				const thumbnailUrlWithToken = await this.ieObjectsService.getThumbnailUrlWithToken(
					limitedObject.thumbnailUrl,
					referer,
					ip
				);
				return {
					schemaIdentifier: limitedObject.schemaIdentifier || null,
					thumbnailUrl: thumbnailUrlWithToken || null,
				};
			}
		);

		return thumbnailInfos;
	}

	/**
	 * Get ie objects by their schemaIdentifier (aka PID)
	 * @param schemaIdentifiers ie object schema_identifiers. eg: 086348mc8s, qstt4fps28
	 * @param ieObjectIds
	 * @param user Currently logged-in user
	 * @param resolveThumbnailUrl
	 * @param referer site making the request. eg: https://qas-v3.hetarchief.be
	 * @param ip Ip of the client making the request. eg: 172.17.45.216
	 */

	@Get()
	@ApiOperation({ summary: 'Get ie-objects by schema identifiers or ie-object ids' })
	@ApiQuery({
		name: 'schemaIdentifiers',
		required: false,
		isArray: true,
		description: 'Schema identifiers (PIDs) of the ie-objects',
		example: ['086348mc8s', 'qstt4fps28'],
	})
	@ApiQuery({
		name: 'ieObjectIds',
		required: false,
		isArray: true,
		description: 'Full IRI ie-object ids',
		example: ['https://data.hetarchief.be/id/entity/086348mc8s'],
	})
	@ApiQuery({
		name: 'resolveThumbnailUrl',
		required: false,
		enum: ['true', 'false'],
		description: 'Whether to resolve the thumbnail URL to a signed URL',
	})
	@ApiOkResponse({ description: 'Returns an array of (partial) ie-objects' })
	@ApiForbiddenResponse({
		description: 'You do not have access to one or more of the requested objects',
	})
	public async getIeObjectsByIds(
		@Query('schemaIdentifiers') schemaIdentifiers: string | string[] | undefined,
		@Query('ieObjectIds') ieObjectIds: string | string[] | undefined,
		@SessionUser() user: SessionUserEntity,
		@Query('resolveThumbnailUrl') resolveThumbnailUrl: 'true' | 'false',
		@Referer() referer: string | null,
		@Ip() ip: string
	): Promise<(Partial<IeObject> | null)[]> {
		try {
			let ieObjectIdsResolved: string[];
			if (schemaIdentifiers) {
				let schemaIdentifiersResolved: string[];
				if (typeof schemaIdentifiers === 'string') {
					schemaIdentifiersResolved = [schemaIdentifiers];
				} else {
					schemaIdentifiersResolved = schemaIdentifiers;
				}
				if (schemaIdentifiersResolved?.length) {
					// Convert schemaIdentifiers to ieObjectIds
					// Convert qs6d5p9579 => https://data-qas.hetarchief.be/id/entity/qs6d5p9579
					ieObjectIdsResolved = await mapLimit(
						schemaIdentifiersResolved,
						12,
						async (schemaIdentifier: string): Promise<string | null> => {
							return await this.ieObjectsService.getObjectIdBySchemaIdentifierCached(
								schemaIdentifier
							);
						}
					);
				}
			} else {
				if (typeof ieObjectIds === 'string') {
					ieObjectIdsResolved = [ieObjectIds];
				} else {
					ieObjectIdsResolved = ieObjectIds;
				}
			}

			const visitorSpaceAccessInfo =
				await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

			const limitedObjects: Partial<IeObject | null>[] = await mapLimit(
				ieObjectIdsResolved,
				20,
				async (ieObjectId: string | null): Promise<Partial<IeObject> | null> => {
					try {
						if (
							!ieObjectId ||
							ieObjectId.length === 0 ||
							ieObjectId.includes('.well-known') // strange nextjs ssr requests
						) {
							return null;
						}

						const ieObject = await this.ieObjectsService.findByIeObjectId(
							ieObjectId,
							resolveThumbnailUrl === 'true',
							referer,
							ip
						);

						if (this.configService.get('IE_OBJECT_LOG_ACCESS_CHECKS') === 'true') {
							console.log('fetching ie-object (before limiting): ', JSON.stringify(ieObject));
						}

						if (!ieObject) {
							return null;
						}

						// Censor the object based on the licenses and sector
						// Only leave the properties that the current user can see of this object
						const limitedObject = limitAccessToObjectDetails(ieObject as IeObjectForAccessCheck, {
							userId: user?.getId(),
							isKeyUser: user.getIsKeyUser(),
							sector: user.getSector(),
							groupId: user.getGroupId(),
							maintainerId: user.getOrganisationId(),
							accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
							accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
						});

						if (this.configService.get('IE_OBJECT_LOG_ACCESS_CHECKS') === 'true') {
							console.log('fetching ie-object (after limiting): ', JSON.stringify(ieObject));
						}

						if (!limitedObject) {
							throw new CustomError('You do not have access to this object', null, {
								code: ERROR_CODE.USER_NO_ACCESS_TO_IE_OBJECT,
							});
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
					} catch (err) {
						throw new CustomError(
							'Failed to retrieve object details by id in getIeObjectsByIds',
							err,
							{
								schemaIdentifier: ieObjectId,
							}
						);
					}
				}
			);

			console.log('returning limitedObjects');
			return limitedObjects;
		} catch (err) {
			console.log('error', JSON.stringify(err));
			const errorJson = JSON.stringify(err);
			if (errorJson.includes(ERROR_CODE.USER_NO_ACCESS_TO_IE_OBJECT)) {
				console.log('has USER_NO_ACCESS_TO_IE_OBJECT code');
				const error = new ForbiddenException(
					'You do not have access to this object: USER_NO_ACCESS_TO_IE_OBJECT'
				);
				console.log(error);
				throw error;
			}
			const error = new CustomError('Failed to retrieve object details in getIeObjectsByIds', err, {
				schemaIdentifiers,
			});
			console.log(error);
			throw error;
		}
	}
}
