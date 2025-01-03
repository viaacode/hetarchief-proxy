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
import { compact, find, isArray, isEmpty, isNil, kebabCase, omitBy, sortBy, uniq } from 'lodash';

import { type Configuration } from '~config';

import { type IeObjectsQueryDto, type IeObjectsSimilarQueryDto } from '../dto/ie-objects.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import { convertQueryToLiteralString } from '../helpers/convert-query-to-literal-string';
import { getSearchEndpoint } from '../helpers/get-search-endpoint';
import { getVisitorSpaceAccessInfoFromVisits } from '../helpers/get-visitor-space-access-info-from-visits';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import {
	type AutocompleteField,
	type ElasticsearchObject,
	type ElasticsearchResponse,
	type EsQueryAutocompleteMatchPhraseResponse,
	type GqlIeObject,
	type GqlLimitedIeObject,
	type IeObject,
	type IeObjectFile,
	IeObjectLicense,
	type IeObjectPageRepresentation,
	type IeObjectRepresentation,
	type IeObjectSector,
	type IeObjectsSitemap,
	type IeObjectsVisitorSpaceInfo,
	type IeObjectsWithAggregations,
	IeObjectType,
	type IsPartOfKey,
	type Mention,
	type RelatedIeObject,
} from '../ie-objects.types';

import {
	FindAllIeObjectsByFolderIdDocument,
	type FindAllIeObjectsByFolderIdQuery,
	type FindAllIeObjectsByFolderIdQueryVariables,
	FindIeObjectsForSitemapDocument,
	type FindIeObjectsForSitemapQuery,
	type FindIeObjectsForSitemapQueryVariables,
	GetChildIeObjectsDocument,
	type GetChildIeObjectsQuery,
	type GetChildIeObjectsQueryVariables,
	GetIeObjectChildrenIrisDocument,
	type GetIeObjectChildrenIrisQuery,
	type GetIeObjectChildrenIrisQueryVariables,
	GetIeObjectIdsDocument,
	type GetIeObjectIdsQuery,
	type GetIeObjectIdsQueryVariables,
	GetObjectDetailBySchemaIdentifiersDocument,
	type GetObjectDetailBySchemaIdentifiersQuery,
	type GetObjectDetailBySchemaIdentifiersQueryVariables,
	GetParentIeObjectDocument,
	type GetParentIeObjectQuery,
	type GetParentIeObjectQueryVariables,
	GetPreviousNextIeObjectIdsDocument,
	type GetPreviousNextIeObjectIdsQuery,
	type GetPreviousNextIeObjectIdsQueryVariables,
	GetSchemaIdentifierV3BySchemaIdentifierV2Document,
	type GetSchemaIdentifierV3BySchemaIdentifierV2Query,
	type GetSchemaIdentifierV3BySchemaIdentifierV2QueryVariables,
	Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus,
} from '~generated/graphql-db-types-hetarchief';
import {
	ALL_INDEXES,
	ElasticsearchField,
	IeObjectsSearchFilterField,
	MAX_COUNT_SEARCH_RESULTS,
} from '~modules/ie-objects/elasticsearch/elasticsearch.consts';
import { AND } from '~modules/ie-objects/elasticsearch/queryBuilder.helpers';
import { convertStringToSearchTerms } from '~modules/ie-objects/helpers/convert-string-to-search-terms';
import { AUTOCOMPLETE_FIELD_TO_ES_FIELD_NAME } from '~modules/ie-objects/ie-objects.conts';
import { CACHE_KEY_PREFIX_IE_OBJECTS_SEARCH } from '~modules/ie-objects/services/ie-objects.service.consts';
import { OrganisationPreference } from '~modules/organisations/organisations.types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { type SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitStatus, VisitTimeframe } from '~modules/visits/types';
import { customError } from '~shared/helpers/custom-error';

@Injectable()
export class IeObjectsService {
	private logger: Logger = new Logger(IeObjectsService.name, { timestamp: true });
	private gotInstance: Got;

	constructor(
		private configService: ConfigService<Configuration>,
		private dataService: DataService,
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
		try {
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
					(filter) =>
						filter.field === IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
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
		} catch (err) {
			console.error(new InternalServerErrorException('Failed getting ieObjects', err));
			throw new InternalServerErrorException(
				'Failed getting ieObjects, see server logs for more details'
			);
		}
	}

	public async convertSchemaIdentifierV2ToV3(
		schemaIdentifierV2: string
	): Promise<{ schemaIdentifierV3: string } | null> {
		const response = await this.dataService.execute<
			GetSchemaIdentifierV3BySchemaIdentifierV2Query,
			GetSchemaIdentifierV3BySchemaIdentifierV2QueryVariables
		>(GetSchemaIdentifierV3BySchemaIdentifierV2Document, {
			schemaIdentifierV2: schemaIdentifierV2,
		});

		const schemaIdentifierV3 = response.graph__intellectual_entity[0]?.schema_identifier;
		if (!schemaIdentifierV3) {
			return null;
		}
		return {
			schemaIdentifierV3,
		};
	}

	public async getParentIeObject(
		ieObjectIri: string,
		referer: string,
		ip: string
	): Promise<RelatedIeObject> {
		const mediaObjects = await this.dataService.execute<
			GetParentIeObjectQuery,
			GetParentIeObjectQueryVariables
		>(GetParentIeObjectDocument, {
			currentObjectIri: ieObjectIri,
		});

		const adapted: RelatedIeObject | null = this.adaptRelatedFromDB(
			mediaObjects.graph_intellectual_entity?.[0]?.isPartOf || null
		);
		// Newspaper thumbnails can be viewed without requiring a player ticket
		if (adapted && adapted.dctermsFormat !== IeObjectType.NEWSPAPER) {
			adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
				adapted.thumbnailUrl,
				referer,
				ip
			);
		}
		return adapted;
	}

	public async getChildIeObjects(
		ieObjectIri: string,
		referer: string,
		ip: string
	): Promise<RelatedIeObject[]> {
		const mediaObjects = await this.dataService.execute<
			GetChildIeObjectsQuery,
			GetChildIeObjectsQueryVariables
		>(GetChildIeObjectsDocument, {
			currentObjectIri: ieObjectIri,
		});

		return Promise.all(
			(mediaObjects.graph_intellectual_entity[0]?.hasPart || []).map(
				async (
					object: GetChildIeObjectsQuery['graph_intellectual_entity'][0]['hasPart'][0]
				): Promise<RelatedIeObject> => {
					const adapted = this.adaptRelatedFromDB(object);
					// Newspaper thumbnails can be viewed without requiring a player ticket
					if (adapted.dctermsFormat !== IeObjectType.NEWSPAPER) {
						adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
							adapted.thumbnailUrl,
							referer,
							ip
						);
					}
					return adapted;
				}
			)
		);
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
		const ieObjectIds = await this.getIeObjectIds(schemaIdentifier);
		if (!ieObjectIds?.iri) {
			throw new NotFoundException("The object was not found or doesn't have an iri");
		}

		const childrenIris = await this.getIeObjectChildrenIris(ieObjectIds.iri);

		const esQueryObject = {
			size: limit,
			from: 0,
			query: AND([
				{
					more_like_this: {
						fields: [
							ElasticsearchField.schema_name,
							ElasticsearchField.schema_description,
							ElasticsearchField.schema_keywords + '.keyword',
							ElasticsearchField.schema_is_part_of + '.*.keyword',
							ElasticsearchField.schema_creator_text,
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
				{
					// Elasticsearch query to filter ids not in the childrenIris array
					// https://meemoo.atlassian.net/browse/ARC-2134
					bool: {
						must_not: {
							terms: {
								[ElasticsearchField.iri]: childrenIris,
							},
						},
					},
				},
				...(searchInsideVisitorSpace
					? [
							{
								// if esIndex is passed, we only want to return objects that are inside a visitor space
								terms: {
									[ElasticsearchField.schema_license]: [
										IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
										IeObjectLicense.BEZOEKERTOOL_CONTENT,
									],
								},
							},
					  ]
					: []),
				regularQuery.query.bool.should[1],
			]),
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
	): Promise<Partial<IeObject>[]> {
		const response = await this.dataService.execute<
			GetObjectDetailBySchemaIdentifiersQuery,
			GetObjectDetailBySchemaIdentifiersQueryVariables
		>(GetObjectDetailBySchemaIdentifiersDocument, {
			schemaIdentifiers,
		});

		return await Promise.all(
			response.graph__intellectual_entity.map(async (object) => {
				const adapted = this.adaptFromDB(object);
				adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
					adapted.thumbnailUrl,
					referer,
					ip
				);
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

	public adaptFromDB(gqlIeObject: Partial<GqlIeObject>): Partial<IeObject> {
		const pageRepresentations: IeObjectPageRepresentation[] =
			this.adaptRepresentations(gqlIeObject);

		let parent = {};
		if (gqlIeObject?.isPartOf) {
			parent = this.adaptFromDB(gqlIeObject.isPartOf);
		}
		const dctermsFormat = gqlIeObject?.dcterms_format as IeObjectType;
		const iiifManifestUrl: string | undefined = process.env.IIIF_MANIFEST_LINK?.replace(
			'{orgId}',
			gqlIeObject?.schemaMaintainer?.org_identifier
		)?.replace('{pid}', gqlIeObject?.schema_identifier);
		const maintainerAllowsIiifManifests = !!gqlIeObject?.schemaMaintainer?.hasPreference.find(
			(pref) => pref.ha_pref === OrganisationPreference.iiifDissemination
		);
		const hasPublicLicense = gqlIeObject?.schema_license?.includes(
			IeObjectLicense.PUBLIEK_CONTENT
		);
		const hasPublicCopyright =
			gqlIeObject?.schema_license?.includes(IeObjectLicense.PUBLIC_DOMAIN) ||
			gqlIeObject?.schema_license?.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED);
		const isNewspaper = dctermsFormat === IeObjectType.NEWSPAPER;
		const ieObject: IeObject = {
			schemaIdentifier: gqlIeObject?.schema_identifier,
			iri: gqlIeObject?.id,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			dctermsFormat,
			dctermsMedium: gqlIeObject?.dcterms_medium,
			creator: gqlIeObject?.schema_creator?.[0],
			dateCreated: gqlIeObject?.schema_date_created,
			datePublished: gqlIeObject?.schema_date_published,
			description: gqlIeObject?.schema_description,
			duration: gqlIeObject?.schema_duration,
			licenses: gqlIeObject?.schema_license,
			premisIdentifier: gqlIeObject?.premisIdentifier?.premis_identifier as [
				{
					abraham_id: string;
					abraham_uri: string;
					code_number: string;
				},
			],
			abrahamInfo: {
				id: gqlIeObject?.premisIdentifier?.premis_identifier.find(
					(premisIdentifier) => Object.keys(premisIdentifier)[0] === 'abraham_id'
				)?.abraham_id,
				uri: gqlIeObject?.premisIdentifier?.premis_identifier.find(
					(premisIdentifier) => Object.keys(premisIdentifier)[0] === 'abraham_uri'
				)?.abraham_uri,
				code: gqlIeObject?.premisIdentifier?.premis_identifier.find(
					(premisIdentifier) => Object.keys(premisIdentifier)[0] === 'code_number'
				)?.code_number,
			},
			abstract: gqlIeObject?.intellectualEntity?.schema_abstract,
			genre: gqlIeObject?.schemaGenre?.schema_genre,
			inLanguage: gqlIeObject?.schemaInLanguage?.schema_in_language,
			keywords: gqlIeObject?.schemaKeywords?.schema_keywords,
			publisher: gqlIeObject?.schemaPublisher?.schema_publisher_array,
			spatial: gqlIeObject?.schemaSpatial?.schema_spatial, // Location of the content
			temporal: gqlIeObject?.schemaTemporal?.schema_temporal,
			synopsis: gqlIeObject?.intellectualEntity?.ebucore_synopsis,
			copyrightHolder: gqlIeObject?.schemaCopyrightHolder
				?.map((copyrightHolder) => copyrightHolder?.schema_copyright_holder)
				?.join(', '),
			maintainerId: gqlIeObject?.schemaMaintainer?.org_identifier,
			maintainerName: gqlIeObject?.schemaMaintainer?.skos_pref_label,
			maintainerSlug: gqlIeObject?.schemaMaintainer?.skos_alt_label,
			maintainerLogo: gqlIeObject?.schemaMaintainer?.ha_org_has_logo
				// TODO remove this workaround once the INT organisations assets are available
				.replace('https://assets-int.viaa.be/images/', 'https://assets.viaa.be/images/')
				.replace('https://assets-tst.viaa.be/images/', 'https://assets.viaa.be/images/'),
			maintainerDescription: gqlIeObject?.schemaMaintainer?.dcterms_description,
			maintainerSiteUrl: gqlIeObject?.schemaMaintainer?.foaf_homepage,
			maintainerFormUrl: gqlIeObject?.schemaMaintainer?.ha_org_request_form,
			maintainerOverlay: !!gqlIeObject?.schemaMaintainer?.hasPreference.find(
				(pref) => pref.ha_pref === OrganisationPreference.logoEmbedding
			),
			maintainerIiifAgreement: !!gqlIeObject?.schemaMaintainer?.hasPreference.find(
				(pref) => pref.ha_pref === OrganisationPreference.iiifDissemination
			),
			sector: gqlIeObject?.schemaMaintainer?.ha_org_sector as IeObjectSector,
			name: gqlIeObject?.schema_name,
			thumbnailUrl: gqlIeObject?.schema_thumbnail_url?.[0],
			premisIsPartOf: gqlIeObject?.premis_is_part_of,
			isPartOf: gqlIeObject?.parentCollection?.map((part) => {
				return {
					iri: part.collection?.id,
					schemaIdentifier: part.collection?.schema_identifier,
					name: part.collection?.schema_name,
					collectionType: part.collection?.collection_type as IsPartOfKey,
					isPreceededBy: part.collection?.isPreceededBy,
					isSucceededBy: part.collection?.isSucceededBy,
					locationCreated: part.collection?.schema_location_created,
					startDate: part.collection?.schema_start_date,
					endDate: part.collection?.schema_end_date,
					publisher: part.collection?.schema_publisher,
				};
			}),
			collectionSeasonNumber:
				gqlIeObject?.parentCollection?.[0]?.collection?.schema_season_number,
			numberOfPages: gqlIeObject?.schema_number_of_pages,
			pageNumber: gqlIeObject?.schema_position,
			meemooLocalId: gqlIeObject?.meemoo_local_id?.[0],
			collectionName: gqlIeObject?.parentCollection?.[0]?.collection?.schema_name,
			collectionId: gqlIeObject?.parentCollection?.[0]?.collection?.id,
			issueNumber: gqlIeObject?.intellectualEntity?.schema_issue_number,
			fragmentId:
				gqlIeObject?.intellectualEntity?.mhFragmentIdentifier?.[0]?.mh_fragment_identifier,
			creditText: gqlIeObject?.intellectualEntity?.schema_credit_text,
			copyrightNotice: gqlIeObject?.intellectualEntity?.schema_copyright_notice,
			alternativeTitle: gqlIeObject?.intellectualEntity?.schemaAlternateName?.map(
				(name) => name.schema_alternate_name
			),
			preceededBy: gqlIeObject?.parentCollection?.[0]?.collection?.isPreceededBy?.map(
				(ie) => ie.schema_name
			),
			succeededBy: gqlIeObject?.parentCollection?.[0]?.collection?.isSucceededBy?.map(
				(ie) => ie.schema_name
			),
			width: gqlIeObject?.intellectualEntity?.hasCarrier?.schema_width,
			height: gqlIeObject?.intellectualEntity?.hasCarrier?.schema_height,
			bibframeProductionMethod:
				gqlIeObject?.intellectualEntity?.hasCarrier?.bibframe_production_method, // Text type
			bibframeEdition: gqlIeObject?.intellectualEntity?.bibframe_edition, // Publication type
			// TODO ARC-2163 digitizing event / date is not available in the database. Add it once it is available
			locationCreated: compact(
				gqlIeObject?.parentCollection?.map(
					(part) => part?.collection?.schema_location_created
				)
			)?.join(', '),
			startDate: compact(
				gqlIeObject?.parentCollection?.map((part) => part?.collection?.schema_start_date)
			)?.join(', '),
			endDate: compact(
				gqlIeObject?.parentCollection?.map((part) => part?.collection?.schema_start_date)
			)?.join(', '),
			carrierDate: gqlIeObject?.intellectualEntity?.hasCarrier?.created_at,
			digitizationDate: gqlIeObject?.intellectualEntity?.hasCarrier?.digitization_date,
			newspaperPublisher: compact(
				gqlIeObject?.parentCollection?.map((part) => part?.collection?.schema_publisher)
			)?.join(', '),
			iiifManifestUrl:
				isNewspaper &&
				maintainerAllowsIiifManifests &&
				hasPublicLicense &&
				hasPublicCopyright
					? iiifManifestUrl
					: null,
			pageRepresentations,
		};

		return {
			...omitBy(parent, (value) => isNil(value) || value === ''),
			...omitBy(ieObject, (value) => isNil(value) || value === ''),
		};
	}

	public adaptRelatedFromDB(
		gqlIeObject:
			| GetParentIeObjectQuery['graph_intellectual_entity'][0]['isPartOf']
			| GetChildIeObjectsQuery['graph_intellectual_entity'][0]['hasPart'][0]
			| null
	): RelatedIeObject {
		if (!gqlIeObject) {
			return null;
		}
		return {
			schemaIdentifier: gqlIeObject?.schema_identifier,
			iri: gqlIeObject?.id,
			dctermsAvailable: gqlIeObject?.dcterms_available,
			dctermsFormat: gqlIeObject?.dctermsFormat[0]?.dcterms_format as IeObjectType,
			dateCreated: gqlIeObject?.schema_date_created,
			datePublished: gqlIeObject?.schema_date_published,
			description: gqlIeObject?.schema_description,
			duration: gqlIeObject?.schemaDuration?.schema_duration || null,
			licenses: gqlIeObject?.schemaLicense?.schema_license,
			maintainerId: gqlIeObject?.schemaMaintainer?.org_identifier,
			maintainerName: gqlIeObject?.schemaMaintainer?.skos_pref_label,
			maintainerSlug: gqlIeObject?.schemaMaintainer?.org_identifier || '', // TODO ARC-2403 get slug from organisation
			sector: gqlIeObject?.schemaMaintainer?.ha_org_sector as IeObjectSector,
			name: gqlIeObject?.schema_name,
			thumbnailUrl: gqlIeObject?.schemaThumbnail?.schema_thumbnail_url?.[0],
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
					if (
						bucket.key === IeObjectType.FILM ||
						bucket.key === IeObjectType.VIDEO_FRAGMENT
					) {
						const videoBucket = find(esResponse.aggregations.dcterms_format.buckets, {
							key: IeObjectType.VIDEO,
						});
						if (videoBucket) {
							// there is also a video bucket: add film counts to this bucket
							videoBucket.doc_count += bucket.doc_count;
							return false; // filter out current film bucket
						}
						// there is no video bucket: rename the film bucket to video bucket
						bucket.key = IeObjectType.VIDEO;
						return true; // include newly renamed video bucket in response
					}
					if (bucket.key === IeObjectType.AUDIO_FRAGMENT) {
						const audioBucket = find(esResponse.aggregations.dcterms_format.buckets, {
							key: IeObjectType.AUDIO,
						});
						if (audioBucket) {
							// there is also an audio bucket: add audio fragment counts to this bucket
							audioBucket.doc_count += bucket.doc_count;
							return false; // filter out current audio fragment bucket
						}
						// there is no video bucket: rename the audio fragment bucket to video bucket
						bucket.key = IeObjectType.AUDIO;
						return true; // include newly renamed audio bucket in response
					}
					return true; // not an audio fragment bucket -> include in response
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
				if (hit._source.schema_thumbnail_url) {
					hit._source.schema_thumbnail_url = [
						await this.playerTicketService.resolveThumbnailUrl(
							hit._source.schema_thumbnail_url[0],
							referer,
							ip
						),
					];
				} else if (
					hit._source.dcterms_format === IeObjectType.AUDIO ||
					hit._source.dcterms_format === IeObjectType.AUDIO_FRAGMENT
				) {
					hit._source.schema_thumbnail_url = ['/images/waveform.svg'];
				}
				return hit;
			})
		);

		return esResponse;
	}

	public adaptESObjectToObject(esObject: ElasticsearchObject): IeObject {
		return {
			dctermsAvailable: esObject?.dcterms_available,
			dctermsFormat: esObject?.dcterms_format as IeObjectType,
			dctermsMedium: esObject?.dcterms_medium,
			ebucoreObjectType: esObject?.ebucore_object_type,
			premisIdentifier: esObject?.premis_identifier,
			abstract: esObject?.schema_abstract,
			contributor: esObject?.schema_contributor,
			copyrightHolder: esObject?.schema_copyrightholder,
			creator: esObject?.schema_creator?.[0],
			dateCreated: esObject?.schema_date_created,
			datePublished: esObject?.schema_date_published,
			description: esObject?.schema_description,
			duration: esObject?.schema_duration,
			genre: esObject?.schema_genre,
			iri: esObject?.iri,
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
			spatial: esObject?.schema_spatial_coverage,
			temporal: esObject?.schema_temporal_coverage,
			thumbnailUrl: esObject?.schema_thumbnail_url?.[0],
			numberOfPages: esObject?.schema_number_of_pages,
			meemooLocalId: esObject?.meemoo_local_id?.[0],
			durationInSeconds: esObject?.duration_seconds,
			pageRepresentations: [],
			// Extra
			sector: esObject?.schema_maintainer?.organization_sector,
			// Other
			isPartOf: esObject?.schema_is_part_of,
			transcript: esObject?.schema_transcript,
			synopsis: null,
			locationCreated: esObject?.schema_location_created,
			children: esObject?.children || 0,
		};
	}

	public adaptLimitedMetadata(graphQlObject: GqlLimitedIeObject): Partial<IeObject> {
		/* istanbul ignore next */
		return {
			schemaIdentifier: graphQlObject.intellectualEntity?.schema_identifier,
			maintainerName: graphQlObject.intellectualEntity?.schemaMaintainer?.skos_pref_label,
			premisIdentifier: undefined, // graphQlObject.intellectualEntity?.premis_identifier, // TODO see if this needs to be re-enabled
			name: graphQlObject.intellectualEntity?.schema_name,
			dctermsFormat: graphQlObject.intellectualEntity?.dcterms_format as IeObjectType,
			dateCreated: graphQlObject.intellectualEntity?.schema_date_created || null,
			datePublished: graphQlObject.intellectualEntity?.schema_date_published || null,
			meemooLocalId: graphQlObject.intellectualEntity?.meemoo_local_id?.[0],
			isPartOf: graphQlObject.intellectualEntity?.schema_is_part_of || {},
		};
	}

	public adaptMetadata(ieObject: Partial<IeObject>): Partial<IeObject> {
		// unset thumbnail and representations
		delete ieObject.pageRepresentations;
		delete ieObject.thumbnailUrl;
		return ieObject;
	}

	public adaptRepresentations(gqlIeObject: Partial<GqlIeObject>): IeObjectPageRepresentation[] {
		if (isEmpty(gqlIeObject.isRepresentedBy) && isEmpty(gqlIeObject.hasPart)) {
			return [];
		}

		/* istanbul ignore next */
		// Standardize the isRepresentedBy and the hasPart.isRepresentedBy parts of the query to a list of pages with each their file representations
		const representationsByPages: IeObjectPageRepresentation[] = compact(
			[gqlIeObject, ...gqlIeObject.hasPart]?.map(
				(part): IeObjectPageRepresentation | null => {
					const representations: IeObjectRepresentation[] = compact(
						(part?.isRepresentedBy || []).flatMap(
							(
								representation: GqlIeObject['isRepresentedBy'][0]
							): IeObjectRepresentation => {
								if (!representation) {
									return null;
								}
								return {
									id: representation.id,
									schemaName: representation.schema_name,
									isMediaFragmentOf: representation.is_media_fragment_of,
									schemaInLanguage: representation.schema_in_language,
									schemaStartTime: representation.schema_start_time,
									schemaEndTime: representation.schema_end_time,
									schemaTranscript: representation.schema_transcript,
									schemaTranscriptUrl:
										representation.schemaTranscriptUrls?.[0]
											?.schema_transcript_url || null,
									edmIsNextInSequence: representation.edm_is_next_in_sequence,
									updatedAt: representation.updated_at,
									files: this.adaptFiles(representation.includes),
								};
							}
						)
					);
					// Avoid returning empty array representations
					if (representations.length) {
						return {
							representations,
							mentions: this.adaptMentions(
								(
									part as GetObjectDetailBySchemaIdentifiersQuery['graph__intellectual_entity'][0]['hasPart'][0]
								).schemaMentions || []
							),
						};
					}
					return null;
				}
			)
		);

		// Sort by image filename to have pages in order
		return sortBy(representationsByPages, (representationsByPage) => {
			let fileName: string | null = null;
			representationsByPage.representations.find((representation) => {
				const imageFile = representation.files.find(
					(file) => file.mimeType === 'image/jpeg'
				);
				fileName = imageFile?.name;
				return imageFile;
			});
			return fileName;
		});
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
					createdAt: file.created_at,
				};
			})
		);
	}

	private adaptForSitemap(
		gqlIeObject: FindIeObjectsForSitemapQuery['graph__intellectual_entity'][0]
	): IeObjectsSitemap {
		return {
			schemaIdentifier: gqlIeObject?.schema_identifier,
			maintainerSlug: kebabCase(gqlIeObject?.schemaMaintainer?.skos_pref_label || ''),
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
			this.logger.error(
				customError('Failed to execute ie-objects query', e, {
					url: this.configService.get('ELASTIC_SEARCH_URL'),
					index: esIndex,
					name: e?.name,
					code: e?.code,
					stack: e?.stack,
					body: e?.response?.body,
					query: esQuery,
				})
			);
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
			accessibleVisitorSpaceIds = compact([
				...visitorSpaceAccessInfo.visitorSpaceIds,
				user.getOrganisationId(),
			]);
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
			accessibleVisitorSpaceIds = compact([
				...spaces.items.map((space) => space.maintainerId),
				user.getOrganisationId(),
			]);
		} else if (user.getGroupName() === GroupName.KIOSK_VISITOR) {
			accessibleVisitorSpaceIds = compact([user.getOrganisationId()]);
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
			isPartOf: ieObject?.isPartOf || [],
			dctermsFormat: ieObject?.dctermsFormat,
			datePublished: ieObject?.datePublished,
			meemooLocalId: ieObject?.meemooLocalId,
			premisIdentifier: ieObject?.premisIdentifier,
			schemaIdentifier: ieObject?.schemaIdentifier,
			iri: ieObject?.iri,
			licenses: ieObject?.licenses,
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

	public async getIeObjectIds(
		schemaIdentifier: string
	): Promise<{ schemaIdentifier: string; iri: string }> {
		const response = await this.dataService.execute<
			GetIeObjectIdsQuery,
			GetIeObjectIdsQueryVariables
		>(GetIeObjectIdsDocument, {
			schemaIdentifier,
		});
		return {
			schemaIdentifier: response.graph_intellectual_entity[0].schema_identifier,
			iri: response.graph_intellectual_entity[0].id,
		};
	}

	public async getIeObjectChildrenIris(ieObjectIri: string): Promise<string[]> {
		const response = await this.dataService.execute<
			GetIeObjectChildrenIrisQuery,
			GetIeObjectChildrenIrisQueryVariables
		>(GetIeObjectChildrenIrisDocument, {
			ieObjectIri,
		});
		return response.graph_intellectual_entity.map((ieObject) => ieObject.id);
	}

	public async getMetadataAutocomplete(
		field: AutocompleteField,
		query: string
	): Promise<string[]> {
		const esField = AUTOCOMPLETE_FIELD_TO_ES_FIELD_NAME[field];
		const esQuery: any = {
			_source: false,
			fields: [esField],
			query: {
				match_phrase_prefix: {
					[esField]: query,
				},
			},
		};

		const response: EsQueryAutocompleteMatchPhraseResponse = await this.executeQuery(
			ALL_INDEXES,
			esQuery
		);

		const queryParts = query.toLowerCase().split(' ');

		// Map elasticsearch response to a list of unique strings
		return uniq(
			(response as EsQueryAutocompleteMatchPhraseResponse).hits?.hits?.flatMap((hit) => {
				const value = hit.fields[esField];
				if (isArray(value)) {
					// List of strings
					// Filter all values that contain all query words
					return value
						.filter((v) =>
							queryParts.every((queryPart) =>
								v.toLowerCase().split(':').pop().includes(queryPart)
							)
						)
						.map((v) => v.split(':').pop().trim());
				} else {
					// Single string
					return value;
				}
			})
		);
	}

	public async getPreviousNextIeObject(collectionId: string, ieObjectIri: string) {
		const response = await this.dataService.execute<
			GetPreviousNextIeObjectIdsQuery,
			GetPreviousNextIeObjectIdsQueryVariables
		>(GetPreviousNextIeObjectIdsDocument, {
			collectionId,
			ieObjectIri,
		});
		return {
			previousIeObjectId:
				response.graph__intellectual_entity_prev_and_next[0]?.previousIeObject
					?.schema_identifier,
			nextIeObjectId:
				response.graph__intellectual_entity_prev_and_next[0]?.nextIeObject
					?.schema_identifier,
		};
	}

	private adaptMentions(
		schemaMentions: GetObjectDetailBySchemaIdentifiersQuery['graph__intellectual_entity'][0]['hasPart'][0]['schemaMentions']
	): Mention[] {
		return compact(
			schemaMentions?.map((mention): Mention => {
				if (!mention.thing) {
					return null;
				}
				return {
					iri: mention?.thing?.id,
					name: mention?.thing?.schema_name,
					x: mention?.x,
					y: mention?.y,
					width: mention?.width,
					height: mention?.height,
					confidence: mention?.confidence,
					birthDate: mention?.thing?.schema_birth_date,
					birthPlace: mention?.thing?.schema_birth_place,
					deathDate: mention?.thing?.schema_death_date,
					deathPlace: mention?.thing?.schema_death_place,
				};
			})
		);
	}
}
