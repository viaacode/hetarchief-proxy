import { randomUUID } from 'crypto';

import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { Cache } from 'cache-manager';
import got, { type Got } from 'got';
import { compact, find, isEmpty, kebabCase } from 'lodash';

import { type Configuration } from '~config';

import {
	type IeObjectsQueryDto,
	type IeObjectsRelatedQueryDto,
	type IeObjectsSimilarQueryDto,
} from '../dto/ie-objects.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import { convertQueryToLiteralString } from '../helpers/convert-query-to-literal-string';
import { getSearchEndpoint } from '../helpers/get-search-endpoint';
import { getVisitorSpaceAccessInfoFromVisits } from '../helpers/get-visitor-space-access-info-from-visits';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import {
	type ElasticsearchObject,
	type ElasticsearchResponse,
	type GqlIeObject,
	type GqlLimitedIeObject,
	type IeObject,
	type IeObjectFile,
	IeObjectLicense,
	type IeObjectRepresentation,
	type IeObjectSector,
	type IeObjectsSitemap,
	type IeObjectsVisitorSpaceInfo,
	type IeObjectsWithAggregations,
	type NewspaperTitle,
} from '../ie-objects.types';

import {
	FindAllIeObjectsByFolderIdDocument,
	type FindAllIeObjectsByFolderIdQuery,
	type FindAllIeObjectsByFolderIdQueryVariables,
	FindIeObjectsForSitemapDocument,
	type FindIeObjectsForSitemapQuery,
	type FindIeObjectsForSitemapQueryVariables,
	GetObjectDetailBySchemaIdentifiersDocument,
	type GetObjectDetailBySchemaIdentifiersQuery,
	type GetObjectDetailBySchemaIdentifiersQueryVariables,
	GetRelatedObjectsDocument,
	type GetRelatedObjectsQuery,
	type GetRelatedObjectsQueryVariables,
	Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus,
} from '~generated/graphql-db-types-hetarchief';
import {
	ALL_INDEXES,
	IeObjectsSearchFilterField,
	MAX_COUNT_SEARCH_RESULTS,
} from '~modules/ie-objects/elasticsearch/elasticsearch.consts';
import { convertStringToSearchTerms } from '~modules/ie-objects/helpers/convert-string-to-search-terms';
import { mockNewspapers } from '~modules/ie-objects/ie-objects-newspaper-mocks.consts';
import { CACHE_KEY_PREFIX_IE_OBJECTS_SEARCH } from '~modules/ie-objects/services/ie-objects.service.consts';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { type SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitStatus, VisitTimeframe } from '~modules/visits/types';

@Injectable()
export class IeObjectsService {
	private logger: Logger = new Logger(IeObjectsService.name, { timestamp: true });
	private gotInstance: Got;

	constructor(
		private configService: ConfigService<Configuration>,
		protected dataService: DataService,
		protected playerTicketService: PlayerTicketService,
		protected visitsService: VisitsService,
		protected spacesService: SpacesService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('ELASTIC_SEARCH_URL'),
			resolveBodyOnly: true,
			responseType: 'json',
		});
	}

	public async findAll(
		inputQuery: IeObjectsQueryDto,
		esIndex: string | null,
		referer: string,
		ip: string,
		user: SessionUserEntity,
		visitorSpaceInfo?: IeObjectsVisitorSpaceInfo
	): Promise<IeObjectsWithAggregations> {
		if ((inputQuery.page - 1) * inputQuery.size > MAX_COUNT_SEARCH_RESULTS) {
			// Limit number of results to MAX_COUNT_SEARCH_RESULTS
			// Since elasticsearch is capped to MAX_COUNT_SEARCH_RESULTS
			return {
				...Pagination<IeObject>({
					items: [],
					page: inputQuery.page,
					size: 0,
					total: MAX_COUNT_SEARCH_RESULTS,
				}),
				aggregations: [],
				searchTerms: [],
			};
		}

		const id = randomUUID();

		let spacesIds: string[] = [];

		// All the space ids are only needed when isConsultableOnlyOnLocation is a filter, and it is set to 'true'
		if (inputQuery.filters && inputQuery.filters.length > 0) {
			const consultableFilter = inputQuery.filters.find(
				(filter) => filter.field === IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
			);
			if (consultableFilter && consultableFilter.value === 'true') {
				const spaces = await this.spacesService.findAll(
					{
						status: [VisitorSpaceStatus.Active],
						page: 1,
						size: 1000,
					},
					user.getId()
				);

				spacesIds = spaces.items.map((space) => space.maintainerId);
			}
		}

		let esQuery: any;
		try {
			esQuery = QueryBuilder.build(inputQuery, {
				user,
				visitorSpaceInfo,
				spacesIds,
			});
		} catch (err) {
			/*
        If the QueryBuilder throws an error, we try the query with a literal string.
        If that also throws an error, we return http 500
        We update the inputQuery because it is later used.
      */
			inputQuery = convertQueryToLiteralString(inputQuery);
			esQuery = QueryBuilder.build(inputQuery, {
				user,
				visitorSpaceInfo,
				spacesIds,
			});
		}

		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Executing elasticsearch query on index ${esIndex}: ${JSON.stringify(
					esQuery
				)}`
			);
		}

		const cacheKey = Buffer.from(JSON.stringify(esQuery)).toString('base64');
		const objectResponse = await this.cacheManager.wrap(
			CACHE_KEY_PREFIX_IE_OBJECTS_SEARCH + cacheKey,
			() => this.executeQuery(esIndex, esQuery),
			// cache for 60 minutes
			3_600_000
		);

		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Response from elasticsearch query on index ${esIndex}: ${JSON.stringify(
					objectResponse
				)}`
			);
		}

		const adaptedESResponse = await this.adaptESResponse(objectResponse, referer, ip);

		return {
			...Pagination<IeObject>({
				items: adaptedESResponse.hits.hits.map((esHit) =>
					this.adaptESObjectToObject(esHit._source)
				),
				page: inputQuery.page,
				size: adaptedESResponse.hits.hits.length,
				total: adaptedESResponse.hits.total.value,
			}),
			aggregations: adaptedESResponse.aggregations,
			searchTerms: this.getSimpleSearchTermsFromBooleanExpression(inputQuery.filters),
		};
	}

	public async getNewspaperTitles(): Promise<NewspaperTitle[]> {
		return mockNewspapers;
	}

	public async getRelated(
		schemaIdentifier: string,
		meemooIdentifier: string,
		referer: string,
		ip: string,
		ieObjectRelatedQueryDto?: IeObjectsRelatedQueryDto
	): Promise<IPagination<IeObject>> {
		const mediaObjects = await this.dataService.execute<
			GetRelatedObjectsQuery,
			GetRelatedObjectsQueryVariables
		>(GetRelatedObjectsDocument, {
			schemaIdentifier,
			maintainerId: ieObjectRelatedQueryDto?.maintainerId || null,
		});

		const adaptedItems = await Promise.all(
			mediaObjects.graph__intellectual_entity.map(async (object: any) => {
				const adapted = this.adaptFromDB(object);
				adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
					adapted.thumbnailUrl,
					referer,
					ip
				);
				return adapted;
			})
		);

		return Pagination<IeObject>({
			items: adaptedItems,
			page: 1,
			size: mediaObjects.graph__intellectual_entity.length,
			total: mediaObjects.graph__intellectual_entity.length,
		});
	}

	public async getSimilar(
		schemaIdentifier: string,
		referer: string,
		ip: string,
		ieObjectSimilarQueryDto: IeObjectsSimilarQueryDto,
		limit = 4,
		user?: SessionUserEntity
	): Promise<IPagination<IeObject>> {
		const esIndex = ieObjectSimilarQueryDto?.maintainerId?.toLowerCase();

		// We can reuse the license checking part from the regular search queries:
		const visitorSpaceAccessInfo = await this.getVisitorSpaceAccessInfoFromUser(user);
		const searchInsideVisitorSpace = !!esIndex;
		const regularQuery = QueryBuilder.build(
			{ filters: [], page: 0, size: 0 },
			{
				user,
				spacesIds: [],
				visitorSpaceInfo: visitorSpaceAccessInfo,
			}
		);

		const esQueryObject = {
			size: limit,
			from: 0,
			query: {
				bool: {
					should: [
						{
							more_like_this: {
								fields: [
									'schema_name',
									'schema_description',
									'schema_keywords.keyword',
									'schema_is_part_of.*.keyword',
									'schema_creator_text',
								],
								like: [
									{
										_index: esIndex,
										_id: schemaIdentifier,
									},
								],
								min_term_freq: 2,
								min_doc_freq: 2,
								max_doc_freq: 6,
								max_query_terms: 12,
								min_word_length: 4,
							},
						},
						...(searchInsideVisitorSpace
							? [
									{
										// if esIndex is passed, we only want to return objects that are inside a visitor space
										terms: {
											schema_license: [
												IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
												IeObjectLicense.BEZOEKERTOOL_CONTENT,
											],
										},
									},
							  ]
							: []),
						regularQuery.query.bool.should[1],
					],
					minimum_should_match: searchInsideVisitorSpace ? 3 : 2,
				},
			},
		};

		// if esIndex is passed, we only want to return objects that are inside a visitor space
		const mediaResponse = await this.executeQuery(esIndex || ALL_INDEXES, esQueryObject);
		const adaptedESResponse = await this.adaptESResponse(mediaResponse, referer, ip);

		return {
			...Pagination<IeObject>({
				items: adaptedESResponse.hits.hits.map((esHit) =>
					this.adaptESObjectToObject(esHit._source)
				),
				page: 1,
				size: adaptedESResponse.hits.hits.length,
				total: adaptedESResponse.hits.total.value,
			}),
		};
	}

	/**
	 * Find by id returns all details as stored in DB
	 * (not all details are in ES)
	 */
	public async findBySchemaIdentifiers(
		schemaIdentifiers: string[],
		referer: string,
		ip: string
	): Promise<IeObject[]> {
		const response = await this.dataService.execute<
			GetObjectDetailBySchemaIdentifiersQuery,
			GetObjectDetailBySchemaIdentifiersQueryVariables
		>(GetObjectDetailBySchemaIdentifiersDocument, {
			schemaIdentifiers,
		});

		// TODO ARC-2403 add thumbnail url to objects
		console.log({
			referer,
			ip,
		});

		return await Promise.all(
			response.graph__intellectual_entity.map(async (object) => {
				const adapted = this.adaptFromDB(object);
				// TODO ARC-2403 add thumbnail url to objects
				// adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
				// 	adapted.thumbnailUrl,
				// 	referer,
				// 	ip
				// );
				return adapted;
			})
		);
	}

	/**
	 * Get the object detail fields that are exposed as metadata
	 */
	public async findMetadataBySchemaIdentifier(
		schemaIdentifier: string,
		ip: string
	): Promise<Partial<IeObject>> {
		const object = await this.findBySchemaIdentifiers([schemaIdentifier], null, ip);
		return this.adaptMetadata(object[0]);
	}

	/**
	 * Returns a limited set of metadata fields for export
	 */
	public async findAllIeObjectMetadataByFolderId(
		folderId: string,
		userProfileId: string
	): Promise<Partial<IeObject>[]> {
		const { users_folder_ie: allObjects } = await this.dataService.execute<
			FindAllIeObjectsByFolderIdQuery,
			FindAllIeObjectsByFolderIdQueryVariables
		>(FindAllIeObjectsByFolderIdDocument, {
			folderId,
			userProfileId,
		});

		if (!allObjects[0]) {
			throw new NotFoundException();
		}

		return allObjects.map((object) => {
			return this.adaptLimitedMetadata(object);
		});
	}

	public async findIeObjectsForSitemap(
		licenses: IeObjectLicense[],
		offset: number,
		limit: number
	): Promise<IPagination<IeObjectsSitemap>> {
		try {
			const {
				graph__intellectual_entity: ieObjects,
				graph__intellectual_entity_aggregate: ieObjectAggregate,
			} = await this.dataService.execute<
				FindIeObjectsForSitemapQuery,
				FindIeObjectsForSitemapQueryVariables
			>(FindIeObjectsForSitemapDocument, { licenses, limit, offset });

			return Pagination<IeObjectsSitemap>({
				items: ieObjects.map((ieObject) => this.adaptForSitemap(ieObject)),
				page: Math.floor(offset / limit),
				size: limit,
				total: ieObjectAggregate?.aggregate?.count,
			});
		} catch (err) {
			throw new InternalServerErrorException('Failed getting ieObjects for sitemap', err);
		}
	}

	// Adapt
	// ------------------------------------------------------------------------

	public adaptFromDB(gqlIeObject: GqlIeObject): IeObject {
		return {
			schemaIdentifier: gqlIeObject?.schema_identifier,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			dctermsFormat: gqlIeObject?.dcterms_format,
			dctermsMedium: gqlIeObject?.dcterms_medium,
			meemooIdentifier: gqlIeObject?.meemoo_identifier,
			creator: gqlIeObject?.schema_creator,
			dateCreated: gqlIeObject?.schema_date_created,
			datePublished: gqlIeObject?.schema_date_published,
			description: gqlIeObject?.schema_description,
			duration: gqlIeObject?.schema_duration,
			licenses: gqlIeObject?.schema_license,
			// TODO ARC-2403 add missing fields
			ebucoreObjectType: '', // gqlIeObject?.ebucore_object_type,
			meemoofilmBase: '', // gqlIeObject?.meemoofilm_base,
			meemoofilmColor: true, // gqlIeObject?.meemoofilm_color,
			meemoofilmContainsEmbeddedCaption: false, // gqlIeObject?.meemoofilm_contains_embedded_caption,
			meemoofilmImageOrSound: '', // gqlIeObject?.meemoofilm_image_or_sound,
			premisIdentifier: '', // gqlIeObject?.premis_identifier,
			abstract: '', // gqlIeObject?.schema_abstract,
			genre: [''], // gqlIeObject?.schema_genre,
			inLanguage: [''], // gqlIeObject?.schema_in_language,
			keywords: null, // gqlIeObject?.schema_keywords,
			publisher: '', // gqlIeObject?.schema_publisher,
			spatial: [''], // gqlIeObject?.schema_spatial_coverage,
			temporal: [''], // gqlIeObject?.schema_temporal_coverage,
			premisIsPartOf: '', // gqlIeObject?.premis_is_part_of,
			copyrightHolder: '', // gqlIeObject?.schema_copyright_holder,
			meemooDescriptionCast: '', // gqlIeObject?.meemoo_description_cast,
			meemooDescriptionProgramme: '', // gqlIeObject?.meemoo_description_programme,
			meemooOriginalCp: '', // gqlIeObject?.meemoo_original_cp,
			durationInSeconds: 10, // gqlIeObject?.schema_duration_in_seconds,
			copyrightNotice: '', // gqlIeObject?.schema_copyright_notice,
			meemooMediaObjectId: '', // gqlIeObject?.meemoo_media_object_id,
			actor: '', // gqlIeObject?.schema_actor,
			maintainerId: gqlIeObject?.schemaMaintainer?.org_identifier,
			maintainerName: gqlIeObject?.schemaMaintainer?.skos_pref_label,
			maintainerSlug: gqlIeObject?.schemaMaintainer?.org_identifier || '', // TODO ARC-2403 get slug from organisation
			maintainerLogo: gqlIeObject?.schemaMaintainer?.ha_org_has_logo,
			maintainerDescription: gqlIeObject?.schemaMaintainer?.dcterms_description,
			maintainerSiteUrl: gqlIeObject?.schemaMaintainer?.foaf_homepage,
			maintainerFormUrl: gqlIeObject?.schemaMaintainer?.ha_org_request_form,
			maintainerOverlay: gqlIeObject?.schemaMaintainer?.ha_org_allows_overlay,
			sector: gqlIeObject?.schemaMaintainer?.ha_org_sector as IeObjectSector,
			name: gqlIeObject?.schema_name,
			thumbnailUrl: gqlIeObject?.schema_thumbnail_url,
			isPartOf: gqlIeObject?.schema_is_part_of,
			numberOfPages: gqlIeObject?.schema_number_of_pages,
			meemooLocalId: gqlIeObject?.meemoo_local_id,
			representations: this.adaptRepresentations(gqlIeObject),
		};
	}

	public async adaptESResponse(
		esResponse: ElasticsearchResponse,
		referer: string,
		ip: string
	): Promise<ElasticsearchResponse> {
		// merge 'film' aggregations with 'video' if need be
		if (esResponse.aggregations?.dcterms_format?.buckets) {
			esResponse.aggregations.dcterms_format.buckets =
				esResponse.aggregations.dcterms_format.buckets.filter((bucket) => {
					if (bucket.key === 'film') {
						const videoBucket = find(esResponse.aggregations.dcterms_format.buckets, {
							key: 'video',
						});
						if (videoBucket) {
							// there is also a video bucket: add film counts to this bucket
							videoBucket.doc_count += bucket.doc_count;
							return false; // filter out current film bucket
						}
						// there is no video bucket: rename the film bucket to video bucket
						bucket.key = 'video';
						return true; // include newly renamed video bucket in response
					}
					return true; // not a film bucket -> include in response
				});
		}

		// sanity check
		const nrHits = esResponse?.hits?.total?.value;
		if (!nrHits) {
			return esResponse;
		}

		// there are hits - resolve thumbnail urls
		esResponse.hits.hits = await Promise.all(
			esResponse.hits.hits.map(async (hit) => {
				hit._source.schema_thumbnail_url =
					await this.playerTicketService.resolveThumbnailUrl(
						hit._source.schema_thumbnail_url,
						referer,
						ip
					);
				return hit;
			})
		);

		return esResponse;
	}

	public adaptESObjectToObject(esObject: ElasticsearchObject): IeObject {
		return {
			dctermsAvailable: esObject?.dcterms_available,
			dctermsFormat: esObject?.dcterms_format,
			dctermsMedium: esObject?.dcterms_medium,
			ebucoreObjectType: esObject?.ebucore_object_type,
			meemooIdentifier: esObject?.meemoo_identifier,
			meemoofilmBase: esObject?.meemoofilm_base,
			meemoofilmColor: esObject?.meemoofilm_color,
			meemoofilmContainsEmbeddedCaption: esObject?.meemoofilm_contains_embedded_caption,
			meemoofilmImageOrSound: esObject?.meemoofilm_image_or_sound,
			premisIsPartOf: esObject?.premis_is_part_of,
			premisIdentifier: esObject?.premis_identifier,
			abstract: esObject?.schema_abstract,
			contributor: esObject?.schema_contributor,
			copyrightHolder: esObject?.schema_copyrightholder,
			creator: esObject?.schema_creator,
			dateCreated: esObject?.schema_date_created,
			datePublished: esObject?.schema_date_published,
			description: esObject?.schema_description,
			duration: esObject?.schema_duration,
			genre: esObject?.schema_genre,
			schemaIdentifier: esObject?.schema_identifier,
			inLanguage: esObject?.schema_in_language,
			keywords: esObject?.schema_keywords,
			licenses: esObject?.schema_license as IeObjectLicense[],
			maintainerId: esObject?.schema_maintainer?.schema_identifier,
			maintainerName: esObject?.schema_maintainer?.schema_name,
			maintainerSlug:
				esObject?.schema_maintainer?.alt_label ??
				kebabCase(esObject?.schema_maintainer?.schema_name || ''),
			maintainerLogo: null,
			maintainerOverlay: null,
			name: esObject?.schema_name,
			publisher: esObject?.schema_publisher,
			spatial: [esObject?.schema_spatial_coverage],
			temporal: [esObject?.schema_temporal_coverage],
			thumbnailUrl: esObject?.schema_thumbnail_url,
			numberOfPages: esObject?.schema_number_of_pages,
			meemooDescriptionCast: esObject?.meemoo_description_cast,
			meemooDescriptionProgramme: esObject?.meemoo_description_programme,
			meemooLocalId: esObject?.meemoo_local_id,
			meemooOriginalCp: esObject?.meemoo_original_cp,
			durationInSeconds: esObject?.duration_seconds,
			representations: this?.adaptRepresentations(esObject?.premis_is_represented_by),
			// Extra
			sector: esObject?.schema_maintainer?.organization_type,
			// Other
			isPartOf: esObject?.schema_is_part_of,
			// Not yet available
			transcript: esObject?.schema_transcript,
			caption: esObject?.schema_caption,
			meemooDescriptionCategory: esObject?.meemoo_description_category,
			meemoofilmEmbeddedCaption: esObject?.meemoofilm_embedded_caption,
			meemoofilmEmbeddedCaptionLanguage: esObject?.meemoofilm_embedded_caption_language,
		};
	}

	public adaptLimitedMetadata(graphQlObject: GqlLimitedIeObject): Partial<IeObject> {
		/* istanbul ignore next */
		return {
			schemaIdentifier: graphQlObject.intellectualEntity?.schema_identifier,
			maintainerName: graphQlObject.intellectualEntity?.schemaMaintainer?.org_identifier,
			name: graphQlObject.intellectualEntity?.schema_name,
			dctermsFormat: graphQlObject.intellectualEntity?.dcterms_format,
			dateCreated: graphQlObject.intellectualEntity?.schema_date_created,
			datePublished: graphQlObject.intellectualEntity?.schema_date_published,
			meemooIdentifier: graphQlObject.intellectualEntity?.meemoo_identifier,
			meemooLocalId: graphQlObject.intellectualEntity?.meemoo_local_id,
			isPartOf: graphQlObject.intellectualEntity?.schema_is_part_of || {},
		};
	}

	public adaptMetadata(ieObject: IeObject): Partial<IeObject> {
		// unset thumbnail and representations
		delete ieObject.representations;
		delete ieObject.thumbnailUrl;
		return ieObject;
	}

	public adaptRepresentations(gqlIeObject: GqlIeObject): IeObjectRepresentation[] {
		if (isEmpty(gqlIeObject.isRepresentedBy)) {
			return [];
		}

		/* istanbul ignore next */
		return compact(
			[
				...gqlIeObject.isRepresentedBy,
				...(gqlIeObject.hasPart?.flatMap((part) => part?.isRepresentedBy) || []),
			].map((representation) => {
				if (!representation) {
					return null;
				}
				return {
					id: representation.id,
					schemaName: representation.schema_name,
					isMediaFragmentOf: representation.is_media_fragment_of,
					schemaInLanguage: representation.schema_in_language,
					schemaStartTime: representation.schema_start_time,
					schemaTranscript: representation.schema_transcript,
					edmIsNextInSequence: representation.edm_is_next_in_sequence,
					updatedAt: representation.updated_at,
					files: this.adaptFiles(representation.includes),
				};
			})
		);
	}

	public adaptFiles(graphQlFiles: GqlIeObject['isRepresentedBy'][0]['includes']): IeObjectFile[] {
		if (isEmpty(graphQlFiles)) {
			return [];
		}

		/* istanbul ignore next */
		return compact(
			graphQlFiles.map((includeFile): IeObjectFile => {
				const file = includeFile.file;
				if (!file) {
					return null;
				}
				return {
					id: file.id,
					name: file.schema_name,
					mimeType: file.ebucore_has_mime_type,
					storedAt: file.premis_stored_at,
					thumbnailUrl: file.schema_thumbnail_url,
					duration: file.schema_duration,
					edmIsNextInSequence: file.edm_is_next_in_sequence,
				};
			})
		);
	}

	private adaptForSitemap(gqlIeObject: any): IeObjectsSitemap {
		return {
			schemaIdentifier: gqlIeObject?.schema_identifier,
			maintainerSlug:
				gqlIeObject?.haorg_alt_label ??
				kebabCase(gqlIeObject?.maintainer?.schema_name || ''),
			name: gqlIeObject?.schema_name,
			updatedAt: gqlIeObject?.updated_at,
		};
	}

	// Helpers
	// ------------------------------------------------------------------------

	public async executeQuery(esIndex: string, esQuery: any): Promise<any> {
		try {
			return await this.gotInstance.post(getSearchEndpoint(esIndex), {
				json: esQuery,
				resolveBodyOnly: true,
			});
		} catch (e) {
			this.logger.error(e?.response?.body);
			throw e;
		}
	}

	public async getVisitorSpaceAccessInfoFromUser(
		user?: SessionUserEntity
	): Promise<IeObjectsVisitorSpaceInfo> {
		// If user is not logged in, he cannot have any visitor space access
		if (!user?.getId()) {
			return {
				objectIds: [],
				visitorSpaceIds: [],
			};
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
				// a visitor can see visit requests that have been approved for visitor spaces with status requested and active
				// https://meemoo.atlassian.net/browse/ARC-1949
				visitorSpaceStatuses: [VisitorSpaceStatus.Requested, VisitorSpaceStatus.Active],
			}
		);
		const visitorSpaceAccessInfo = getVisitorSpaceAccessInfoFromVisits(activeVisits.items);

		// Extend the accessible visitor spaces for CP_ADMIN and MEEMOO_ADMIN
		// CP_ADMIN should always have access to their own visitor space
		// MEEMOO_ADMIN should always have access to all visitor spaces
		// KIOSK_VISITOR should always have access to their own visitor space
		let accessibleVisitorSpaceIds: string[];
		if (user.getGroupName() === GroupName.CP_ADMIN) {
			accessibleVisitorSpaceIds = [
				...visitorSpaceAccessInfo.visitorSpaceIds,
				user.getOrganisationId(),
			];
		} else if (user.getGroupName() === GroupName.MEEMOO_ADMIN) {
			const spaces = await this.spacesService.findAll(
				{
					status: [
						VisitorSpaceStatus.Active,
						VisitorSpaceStatus.Inactive,
						VisitorSpaceStatus.Requested,
					],
					page: 1,
					size: 100,
				},
				user.getId()
			);
			accessibleVisitorSpaceIds = [
				...spaces.items.map((space) => space.maintainerId),
				user.getOrganisationId(),
			];
		} else if (user.getGroupName() === GroupName.KIOSK_VISITOR) {
			accessibleVisitorSpaceIds = [user.getOrganisationId()];
		} else {
			accessibleVisitorSpaceIds = visitorSpaceAccessInfo.visitorSpaceIds;
		}

		return {
			objectIds: visitorSpaceAccessInfo.objectIds,
			visitorSpaceIds: accessibleVisitorSpaceIds,
		};
	}

	public defaultLimitedMetadata(ieObject: Partial<IeObject>): Partial<IeObject> {
		return {
			name: ieObject?.name,
			maintainerName: ieObject?.maintainerName,
			maintainerId: ieObject?.maintainerId,
			maintainerSlug: ieObject?.maintainerSlug,
			isPartOf: ieObject?.isPartOf || {},
			dctermsFormat: ieObject?.dctermsFormat,
			datePublished: ieObject?.datePublished,
			meemooIdentifier: ieObject?.meemooIdentifier,
			meemooLocalId: ieObject?.meemooLocalId,
			premisIdentifier: ieObject?.premisIsPartOf,
			schemaIdentifier: ieObject?.schemaIdentifier,
			licenses: ieObject.licenses,
		};
	}

	public limitObjectInFolder(
		folderObjectItem: Partial<IeObject>,
		user: SessionUserEntity,
		visitorSpaceAccessInfo: IeObjectsVisitorSpaceInfo
	): Partial<IeObject> {
		const limitedObjectDetails = limitAccessToObjectDetails(folderObjectItem, {
			userId: user.getId(),
			sector: user.getSector(),
			maintainerId: user.getOrganisationId(),
			groupId: user.getGroupId(),
			isKeyUser: user.getIsKeyUser(),
			accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
		});

		return {
			accessThrough: [],
			...(limitedObjectDetails ?? {}),
			...this.defaultLimitedMetadata(folderObjectItem),
		};
	}

	public getSimpleSearchTermsFromBooleanExpression(
		filters: IeObjectsQueryDto['filters']
	): string[] {
		const searchTerms = filters
			.filter((searchFilter) => searchFilter.field === IeObjectsSearchFilterField.QUERY)
			.map((filter) => filter.value);
		if (!searchTerms || searchTerms.length === 0) {
			return [];
		}
		return searchTerms.flatMap((searchTerm) => convertStringToSearchTerms(searchTerm));
	}
}
