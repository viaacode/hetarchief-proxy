/* eslint-disable @typescript-eslint/consistent-type-imports */
// Disable consistent imports since they try to import IeObjectsQueryDto as a type
// But that breaks the endpoint body validation

import {
	ContentPagesService,
	PlayerTicketController,
	PlayerTicketService,
} from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Header,
	HttpCode,
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
	IeObjectsPlayableDisplayDataQueryDto,
	IeObjectsQueryDto,
	IeObjectsSimilarQueryDto,
	PlayerTicketsQueryDto,
	ThumbnailQueryDto,
} from '../dto/ie-objects.dto';
import { checkAndFixFormatFilter } from '../helpers/check-and-fix-format-filter';
import {
	PLAYABLE_DISPLAY_DATA_BLOCK_TYPES,
	type PlayableDisplayDataItem,
	contentBlockToPlayableDisplayDataItems,
} from '../helpers/content-block-to-playable-items';
import { convertObjectToCsv } from '../helpers/convert-objects-to-csv';
import { convertObjectToXml } from '../helpers/convert-objects-to-xml';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import {
	AutocompleteField,
	type IeObject,
	IeObjectAccessThrough,
	IeObjectForAccessCheck,
	IeObjectLicense,
	type IeObjectPlayableDisplayData,
	type IeObjectSeo,
	IeObjectType,
	type IeObjectsWithAggregations,
	type RelatedIeObject,
	type RelatedIeObjects,
} from '../ie-objects.types';

import { IeObjectsService } from '../services/ie-objects.service';
import { PlayableDisplayDataService } from '../services/playable-display-data.service';

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
import {
	ERROR_CODE,
	IE_OBJECT_AV_TYPES,
	PLAYABLE_DISPLAY_DATA_UNSAVED_OBJECTS_PERMISSIONS,
} from '~modules/ie-objects/ie-objects.conts';
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
		private playableDisplayDataService: PlayableDisplayDataService,
		private eventsService: EventsService,
		private playerTicketService: PlayerTicketService,
		private playerTicketController: PlayerTicketController,
		private contentPagesService: ContentPagesService,
		private configService: ConfigService<Configuration>
	) {}

	@Get('player-ticket')
	@ApiOperation({ summary: 'Get a playable URL for a given browse path' })
	@ApiQuery({
		name: 'browsePath',
		required: true,
		description: 'The browse path of the media file',
	})
	@ApiQuery({
		name: 'schemaIdentifier',
		required: true,
		description: 'The schema identifier of the ie-object that contains the media file',
	})
	@ApiQuery({
		name: 'startTime',
		required: false,
		description:
			'Start time in seconds of the snippet to play. Must be passed together with endTime.',
	})
	@ApiQuery({
		name: 'endTime',
		required: false,
		description:
			'End time in seconds of the snippet to play. Must be passed together with startTime.',
	})
	@ApiOkResponse({ description: 'Returns the playable URL as a string' })
	@ApiBadRequestResponse({
		description: 'Browse path is missing or invalid, or start/end time are inconsistent',
	})
	public async getPlayableUrl(
		@Referer() referer: string,
		@Ip() ip: string,
		@Query() playerTicketsQuery: PlayerTicketsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<string> {
		this.assertValidStartAndEndTime(playerTicketsQuery);

		const accessibleObject = await this.assertCanGetPlayableTicket(
			playerTicketsQuery,
			user,
			referer,
			ip
		);

		const [requestedFile, requestedRepresentation] =
			this.ieObjectsService.getRepresentationAndFileInIeObject(
				accessibleObject,
				playerTicketsQuery.fileId
			);

		if (!requestedFile || !requestedRepresentation) {
			throw new CustomError(
				"Failed to find requested file and/or it's representation in ie-object",
				null,
				{
					playerTicketsQuery,
				},
				404
			);
		}

		// Check if we need to cut the video / audio file
		let startTime: number | undefined;
		let endTime: number | undefined;
		if (this.hasRequestedSnippet(playerTicketsQuery)) {
			// An editorial snippet was requested by the caller (e.g. the "Videoblok" content block).
			// The snippet is not an object in the MAM, so the times cannot come from the graph.
			// https://meemoo.atlassian.net/browse/ARC-3832
			startTime = playerTicketsQuery.startTime;
			endTime = playerTicketsQuery.endTime;
		} else if (requestedRepresentation?.isMediaFragmentOf) {
			// Cut fragment => cut
			// https://meemoo.atlassian.net/browse/ARC-3690?focusedCommentId=87432
			startTime = requestedFile?.mediaFragment?.startTime ?? undefined;
			endTime = requestedFile?.mediaFragment?.endTime ?? undefined;
		} else {
			// Main object => do not cut even if there is a start and end time
			startTime = undefined;
			endTime = undefined;
		}
		return this.playerTicketService.getPlayableUrl(requestedFile.storedAt, {
			referer,
			ip,
			isPublicDomain: false,
			startTime,
			endTime,
		});
	}

	/**
	 * Whether the caller asked for a specific snippet, as opposed to the whole file or the
	 * graph-defined media fragment. Safe to call only after assertValidStartAndEndTime, which
	 * guarantees the two times are either both set or both absent.
	 */
	private hasRequestedSnippet(playerTicketsQuery: PlayerTicketsQueryDto): boolean {
		return !isNil(playerTicketsQuery.startTime) && !isNil(playerTicketsQuery.endTime);
	}

	/**
	 * The ticket service only cuts the media when it receives an end time: both the `fragment`
	 * claim in the ticket JWT and the `t=start,end` media fragment on the url are gated on it.
	 * A start time without an end time would therefore silently hand out an *uncut* url, so
	 * reject that combination outright instead of quietly ignoring it.
	 */
	private assertValidStartAndEndTime(playerTicketsQuery: PlayerTicketsQueryDto): void {
		const { startTime, endTime } = playerTicketsQuery;

		if (isNil(startTime) && isNil(endTime)) {
			return;
		}
		if (isNil(startTime) || isNil(endTime)) {
			throw new BadRequestException(
				'Query params startTime and endTime must be passed together, or not at all'
			);
		}
		if (endTime <= startTime) {
			throw new BadRequestException('Query param endTime must be greater than startTime');
		}
	}

	/**
	 * Get a ticket to be able to see a certain file path
	 * currently only used for newspaper images
	 * @param referer
	 * @param ip
	 * @param filePaths eg: image/3/public%252FOR-1c1tf48%252F13%252F13cdb1aa21704313a6ded7da5fabf53f0a9571a68c6540e18725440376c089c2813e3eec887041e1ab908a4c20a46d15.jp2
	 * @param schemaIdentifier
	 * @param user
	 */
	@Get('ticket-service')
	@ApiOperation({ summary: 'Get ticket service tokens for one or more file paths' })
	@ApiQuery({
		name: 'filePaths',
		required: true,
		isArray: true,
		description: 'File paths to request tickets for',
	})
	@ApiQuery({
		name: 'schemaIdentifier',
		required: true,
		description: 'The schema identifier of the newspaper that contains the requested files',
	})
	@ApiOkResponse({ description: 'Returns an array of ticket tokens' })
	@ApiBadRequestResponse({ description: 'filePaths query param is missing' })
	public async getTicketServiceTokens(
		@Referer() referer: string,
		@Ip() ip: string,
		@Query('filePaths') filePaths: string | string[],
		@Query('schemaIdentifier') schemaIdentifier: string,
		@SessionUser() user: SessionUserEntity
	): Promise<string[]> {
		if (!filePaths || filePaths.length === 0) {
			throw new BadRequestException('Query param filePaths is required');
		}
		if (!schemaIdentifier) {
			throw new BadRequestException('Query param schemaIdentifier is required');
		}
		const resolvedFilePaths = Array.isArray(filePaths) ? filePaths : [filePaths];
		if (resolvedFilePaths.some((filePath) => !filePath)) {
			throw new BadRequestException('Query param filePaths is required');
		}
		await this.assertCanGetTicketServiceTokens(schemaIdentifier, user, referer, ip);
		try {
			return await Promise.all(
				resolvedFilePaths.map((filePath) => {
					return this.playerTicketController.getTicketServiceTokenForFilePath(
						filePath,
						referer,
						ip,
						undefined, // not needed for newspaper images
						undefined // not needed for newspaper images
					);
				})
			);
		} catch (err) {
			throw customError('Failed to get tickets for filePaths', err, {
				filePaths,
				referer,
			});
		}
	}

	private async getAccessibleObjectForTicket(
		schemaIdentifier: string,
		user: SessionUserEntity,
		referer: string,
		ip: string
	): Promise<Partial<IeObject>> {
		if (!schemaIdentifier) {
			throw new BadRequestException('Query param fileId is required');
		}

		const accessibleObjects = await this.getIeObjectsByIds(
			[schemaIdentifier],
			undefined,
			user,
			'false',
			referer,
			ip,
			{ path: 'getAccessibleObjectForTicket', params: { schemaIdentifier } } as unknown as Request
		);
		const accessibleObject = accessibleObjects[0];

		if (!accessibleObject) {
			throw new ForbiddenException('Object not found or you do not have permission to see it');
		}

		return accessibleObject;
	}

	private async assertCanGetPlayableTicket(
		playerTicketsQuery: PlayerTicketsQueryDto,
		user: SessionUserEntity,
		referer: string,
		ip: string
	): Promise<Partial<IeObject>> {
		const accessibleObject = await this.getAccessibleObjectForTicket(
			playerTicketsQuery.schemaIdentifier,
			user,
			referer,
			ip
		);

		if (!IE_OBJECT_AV_TYPES.includes(accessibleObject.dctermsFormat as IeObjectType)) {
			throw new ForbiddenException(
				'You do not have permission to play this file (non AV material)'
			);
		}
		if (!this.objectContainsFilePath(accessibleObject, playerTicketsQuery.fileId)) {
			throw new ForbiddenException(
				"You do not have permission to play this file (ie object doesn't contain file)"
			);
		}

		return accessibleObject;
	}

	private objectContainsFilePath(ieObject: Partial<IeObject>, fileId: string): boolean {
		return Boolean(
			ieObject.pages?.some((page) =>
				page.representations?.some((representation) =>
					representation.files?.some((file) => file.id === fileId)
				)
			)
		);
	}

	private async assertCanGetTicketServiceTokens(
		schemaIdentifier: string,
		user: SessionUserEntity,
		referer: string,
		ip: string
	): Promise<Partial<IeObject>> {
		const accessibleObject = await this.getAccessibleObjectForTicket(
			schemaIdentifier,
			user,
			referer,
			ip
		);

		if (accessibleObject.dctermsFormat !== IeObjectType.NEWSPAPER) {
			throw new ForbiddenException('Only newspaper files can use the ticket service endpoint');
		}
		return accessibleObject;
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
		return this.playerTicketService.getThumbnailUrl(thumbnailQuery.id, { referer, ip });
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
		@Param('schemaIdentifier') schemaIdentifier: string,
		@Req() request: Request
	): Promise<IeObjectSeo> {
		const ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
			schemaIdentifier,
			request
		);

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
					or_id: objectMetadata.maintainerId,
					type: mapDcTermsFormatToSimpleType(objectMetadata?.dctermsFormat),
					...this.eventsService.mapUserToEventData(user?.getUser()),
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
					or_id: objectMetadata.maintainerId,
					type: mapDcTermsFormatToSimpleType(objectMetadata?.dctermsFormat),
					...this.eventsService.mapUserToEventData(user?.getUser()),
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
	 * @param request
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
		@SessionUser() user: SessionUserEntity,
		@Req() request: Request
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

				const ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
					schemaIdentifier,
					request
				);
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
	 * @param request
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
		@Ip() ip: string,
		@Req() request: Request
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
							return await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
								schemaIdentifier,
								request
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
							console.info('fetching ie-object (before limiting): ', JSON.stringify(ieObject));
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
							console.info('fetching ie-object (after limiting): ', JSON.stringify(limitedObject));
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

			return limitedObjects;
		} catch (err) {
			console.error('error', JSON.stringify(err));
			const errorJson = JSON.stringify(err);
			if (errorJson.includes(ERROR_CODE.USER_NO_ACCESS_TO_IE_OBJECT)) {
				console.error(
					new CustomError('has USER_NO_ACCESS_TO_IE_OBJECT code', err, {
						schemaIdentifiers,
						ieObjectIds,
						user,
						resolveThumbnailUrl,
						referer,
						ip,
					})
				);
				throw new ForbiddenException(
					'You do not have access to this object: USER_NO_ACCESS_TO_IE_OBJECT'
				);
			}
			const error = new CustomError('Failed to retrieve object details in getIeObjectsByIds', err, {
				schemaIdentifiers,
				ieObjectIds,
				user,
				resolveThumbnailUrl,
				referer,
				ip,
			});
			console.error(error);
			throw error;
		}
	}

	/**
	 * Lightweight, batch-capable alternative to GET /ie-objects for rendering the playable preview
	 * tiles of a content block (e.g. a carousel). The objects to resolve -- and the snippet
	 * start/end cuepoints to cut them at -- are read from the block's own stored config, so a
	 * client can't ask for a cut that no editor configured.
	 *
	 * Editor work around: inside the content page editor a block's config is being changed as we
	 * speak, and a block that is still being put together has not been saved at all, so it has no
	 * id and there is nothing for us to look up -- reading the saved config would show a stale
	 * preview, or none at all until the page is saved. The editor therefore sends the block's
	 * objects directly, as `objects`, with their cuepoints in seconds. Those are only honoured for
	 * users who may edit content pages (see PLAYABLE_DISPLAY_DATA_UNSAVED_OBJECTS_PERMISSIONS);
	 * for anyone else they are stripped from the request, so a visitor still can't ask for an
	 * arbitrary cut of an object.
	 *
	 * Which of the two a caller uses follows from where it renders, not from whether the block
	 * happens to be saved: the content page editor always sends `objects`, one entry per element
	 * of the block, and every other caller always sends `blockId`. The two are mutually exclusive
	 * -- a body carrying both is rejected -- so the response is always the elements of one block,
	 * in that block's own order. Both are normalized to the same list of objects + cuepoints, so
	 * everything after that point is shared.
	 * @param queryDto
	 * @param user
	 * @param referer
	 * @param ip
	 * @param request
	 */
	@Post('playable-display-data')
	@HttpCode(200)
	@ApiOperation({
		summary: 'Get lightweight playable display data for the ie-objects of a content block',
		description:
			'Smaller/faster alternative to GET /ie-objects for rendering playable preview tiles ' +
			'(e.g. carousels): schemaIdentifier, name, thumbnailUrl, dctermsFormat, maintainer info, ' +
			'and, for audio/video objects, a ready-to-play playableUrl (+ mimeType), with peakfileData ' +
			'additionally containing the waveform peak sample array for audio and audio fragments. Non ' +
			'audio/video objects (mainly newspapers) get a newspaperImage instead: a self-contained ' +
			'base64 data uri of the IIIF detail image, usable directly as an <img src> with no ' +
			'further requests. The objects are taken from the config of the content block with the ' +
			'given blockId, together with the snippet start/end cuepoints (in seconds) its editor ' +
			'configured, which yield a video still at that timestamp instead of the poster image. ' +
			'Supported block types: HETARCHIEF_VIDEO, HERO_CAROUSEL, TIMELINE. Exactly one of blockId ' +
			'and objects is required. The content page editor renders block configs that are being ' +
			'changed (or not saved at all), so it sends objects instead: one entry per block element, ' +
			'with their cuepoints. Those are honoured for users who may edit content pages and ' +
			'ignored for everyone else.',
	})
	@ApiBody({ type: IeObjectsPlayableDisplayDataQueryDto, required: true })
	@ApiOkResponse({
		description:
			'Returns one (possibly null) entry per ie-object referenced by the content block, in the ' +
			'order the block lists them',
	})
	@ApiBadRequestResponse({
		description:
			'Neither blockId nor objects was given, both were given, or the block blockId points to ' +
			'is not of a supported type',
	})
	@ApiNotFoundResponse({ description: 'No content block exists with the given blockId' })
	public async getIeObjectsPlayableDisplayData(
		@Body() queryDto: IeObjectsPlayableDisplayDataQueryDto,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string | null,
		@Ip() ip: string,
		@Req() request: Request
	): Promise<(IeObjectPlayableDisplayData | null)[]> {
		if (!queryDto?.blockId && !queryDto?.objects?.length) {
			throw new BadRequestException('Body param blockId or objects is required');
		}
		if (queryDto.blockId && queryDto.objects?.length) {
			throw new BadRequestException(
				'Body params blockId and objects are mutually exclusive: pass the block id for a saved block, or its objects while it is being edited'
			);
		}

		// Both ways in normalize to the same list of objects + cuepoints, so from here on it no
		// longer matters which one the request used. Exactly one of them is filled in, so the
		// other contributes nothing.
		const items: PlayableDisplayDataItem[] = [
			...(await this.getPlayableDisplayDataItemsForBlock(queryDto.blockId)),
			...this.getPlayableDisplayDataItemsForUnsavedBlock(queryDto.objects, user),
		];

		// Slots without an object (e.g. a timeline node showing an image) are not sent to the
		// service, but keep their place in the response so the client can keep matching the
		// entries to the block's elements by position.
		const requestableItems = compact(items);
		const playableDisplayData =
			await this.playableDisplayDataService.getIeObjectsPlayableDisplayData(
				requestableItems,
				user,
				referer,
				ip,
				request
			);
		let responseIndex = 0;

		return items.map((item) => (item ? (playableDisplayData[responseIndex++] ?? null) : null));
	}

	/**
	 * Normalizes a saved content block to the objects + cuepoints to fetch playable display data
	 * for, in the block's own element order.
	 *
	 * Taking the objects and their snippet start/end times from the stored block config - instead
	 * of from the request body - is the point of this endpoint: a client can only get a cut of an
	 * object for which an editor actually configured that cut in a content block.
	 */
	private async getPlayableDisplayDataItemsForBlock(
		blockId: string | undefined
	): Promise<PlayableDisplayDataItem[]> {
		if (!blockId) {
			return [];
		}

		const contentBlock = await this.contentPagesService.getContentPageBlockById(blockId);

		if (!contentBlock) {
			throw new NotFoundException(`No content block found with id '${blockId}'`);
		}

		const items = contentBlockToPlayableDisplayDataItems(contentBlock);

		if (!items) {
			throw new BadRequestException(
				`Content block '${blockId}' is of type '${contentBlock.type}', which does not reference playable objects. Supported types: ${PLAYABLE_DISPLAY_DATA_BLOCK_TYPES.join(', ')}`
			);
		}

		return items;
	}

	/**
	 * Normalizes the objects a content page editor passed for a block that hasn't been saved yet
	 * to the same list of objects + cuepoints a saved block yields.
	 *
	 * These have not been through an editor's hands in the database, so their cuepoints are taken
	 * on trust - which is only acceptable for someone who could save exactly the same block a
	 * second later. For anyone else the objects are stripped and nothing is resolved.
	 */
	private getPlayableDisplayDataItemsForUnsavedBlock(
		objects: IeObjectsPlayableDisplayDataQueryDto['objects'],
		user: SessionUserEntity
	): PlayableDisplayDataItem[] {
		if (!user?.hasAny(PLAYABLE_DISPLAY_DATA_UNSAVED_OBJECTS_PERMISSIONS)) {
			return [];
		}

		return (objects || []).map((object) =>
			object?.schemaIdentifier
				? { schemaIdentifier: object.schemaIdentifier, start: object.start, end: object.end }
				: null
		);
	}
}
