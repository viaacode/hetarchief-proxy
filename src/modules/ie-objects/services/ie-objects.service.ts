import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { mapLimit } from 'blend-promise-utils';
import type { Cache } from 'cache-manager';
import got, { type Got } from 'got';
import {
	compact,
	find,
	isArray,
	isEmpty,
	isNil,
	kebabCase,
	omitBy,
	orderBy,
	take,
	uniq,
} from 'lodash';

import type { Configuration } from '~config';

import { IeObjectsQueryDto, IeObjectsSimilarQueryDto } from '../dto/ie-objects.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import { convertQueryToLiteralString } from '../helpers/convert-query-to-literal-string';
import { getSearchEndpoint } from '../helpers/get-search-endpoint';
import { getVisitorSpaceAccessInfoFromVisits } from '../helpers/get-visitor-space-access-info-from-visits';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import {
	AutocompleteField,
	type ElasticsearchObject,
	type ElasticsearchResponse,
	type EsQueryAutocompleteMatchPhraseResponse,
	type GqlLimitedIeObject,
	type IeObject,
	type IeObjectFile,
	IeObjectLicense,
	type IeObjectPage,
	type IeObjectPages,
	type IeObjectRepresentation,
	type IeObjectSector,
	IeObjectType,
	type IeObjectsSitemap,
	type IeObjectsVisitorSpaceInfo,
	type IeObjectsWithAggregations,
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
	type GetHasPartQuery,
	GetIeObjectChildrenIrisDocument,
	type GetIeObjectChildrenIrisQuery,
	type GetIeObjectChildrenIrisQueryVariables,
	type GetIsPartOfQuery,
	type GetIsRepresentedByQuery,
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
import { convertSchemaIdentifierToId } from '~modules/ie-objects/helpers/convert-schema-identifier-to-id';
import {
	type SearchTermParseResult,
	convertStringToSearchTerms,
} from '~modules/ie-objects/helpers/convert-string-to-search-terms';
import { AUTOCOMPLETE_FIELD_TO_ES_FIELD_NAME } from '~modules/ie-objects/ie-objects.conts';
import {
	CACHE_KEY_PREFIX_IE_OBJECTS_SEARCH,
	CACHE_KEY_PREFIX_IE_OBJECT_DETAIL,
	IE_OBJECT_DETAIL_QUERIES,
} from '~modules/ie-objects/services/ie-objects.service.consts';
import {
	type DbFile,
	type DbIeObjectWithMentions,
	type DbIeObjectWithRepresentations,
	type DbRepresentation,
	IeObjectDetailResponseIndex,
	type IeObjectDetailResponseTypes,
} from '~modules/ie-objects/services/ie-objects.service.types';
import { OrganisationPreference } from '~modules/organisations/organisations.types';

import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';

import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitStatus, VisitTimeframe } from '~modules/visits/types';
import { customError } from '~shared/helpers/custom-error';
import { checkRequiredEnvs } from '~shared/helpers/env-check';
import { getQueryName } from '~shared/helpers/get-query-name';

checkRequiredEnvs(['ELASTICSEARCH_URL', 'IE_OBJECT_ID_PREFIX']);

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
			prefixUrl: this.configService.get('ELASTICSEARCH_URL'),
			resolveBodyOnly: true,
			responseType: 'json',
		});
	}

	private async getEsQueryObject(
		inputQuery: IeObjectsQueryDto,
		user: SessionUserEntity,
		visitorSpaceInfo?: IeObjectsVisitorSpaceInfo
	): Promise<any> {
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
			const literalStringInputQuery = convertQueryToLiteralString(inputQuery);
			esQuery = QueryBuilder.build(literalStringInputQuery, {
				user,
				visitorSpaceInfo,
				spacesIds,
			});
		}
		return esQuery;
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
					searchTermsParsedSuccessfully: true,
				};
			}

			const id = randomUUID();

			const esQuery = await this.getEsQueryObject(inputQuery, user, visitorSpaceInfo);

			if (inputQuery.size > 0 && process.env.NODE_ENV === 'local') {
				fs.writeFile('query.json', JSON.stringify(esQuery, null, 2));
			}

			if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
				this.logger.log(
					`${id}, Executing elasticsearch query on index ${esIndex}: ${JSON.stringify(esQuery)}`
				);
			}

			let objectResponse: any;
			if (this.configService.get('ELASTICSEARCH_CACHE_QUERIES')) {
				const cacheKey = Buffer.from(JSON.stringify(esQuery)).toString('base64');
				objectResponse = await this.cacheManager.wrap(
					CACHE_KEY_PREFIX_IE_OBJECTS_SEARCH + cacheKey,
					() => this.executeQuery(esIndex, esQuery),
					// cache for 60 minutes
					3_600_000
				);
			} else {
				objectResponse = await this.executeQuery(esIndex, esQuery);
			}

			if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
				this.logger.log(
					`${id}, Response from elasticsearch query on index ${esIndex}: ${JSON.stringify(
						objectResponse
					)}`
				);
			}

			const adaptedESResponse = await this.adaptESResponse(objectResponse);

			const searchTermParseResult = this.getSimpleSearchTermsFromBooleanExpression(
				inputQuery.filters
			);
			return {
				...Pagination<IeObject>({
					// 24 in parallel, since one search page contains 24 items usually
					items: await mapLimit(adaptedESResponse.hits.hits, 24, async (esHit) =>
						this.adaptESObjectToObject(esHit._source, referer, ip)
					),
					page: inputQuery.page,
					size: adaptedESResponse.hits.hits.length,
					total: adaptedESResponse.hits.total.value,
				}),
				aggregations: adaptedESResponse.aggregations,
				searchTerms: searchTermParseResult.plainTextSearchTerms,
				searchTermsParsedSuccessfully: searchTermParseResult.parsedSuccessfully,
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
	): Promise<{ schemaIdentifierV3: string; id: string } | null> {
		const response = await this.dataService.execute<
			GetSchemaIdentifierV3BySchemaIdentifierV2Query,
			GetSchemaIdentifierV3BySchemaIdentifierV2QueryVariables
		>(GetSchemaIdentifierV3BySchemaIdentifierV2Document, {
			schemaIdentifierV2: schemaIdentifierV2,
		});

		const schemaIdentifierV3 = response.graph_mh_fragment_identifier[0]?.intellectual_entity_id
			?.split('/')
			.pop();
		const id = response.graph_mh_fragment_identifier[0]?.intellectual_entity_id;
		if (!schemaIdentifierV3) {
			return null;
		}
		return {
			id,
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

		const adapted: RelatedIeObject | null = await this.adaptRelatedFromDB(
			mediaObjects.graph_intellectual_entity?.[0]?.isPartOf || null,
			referer,
			ip
		);
		// Newspaper thumbnails can be viewed without requiring a player ticket
		if (adapted && adapted.dctermsFormat !== IeObjectType.NEWSPAPER && referer) {
			adapted.thumbnailUrl = await this.getThumbnailUrlWithToken(adapted.thumbnailUrl, referer, ip);
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
					const adapted = await this.adaptRelatedFromDB(object, referer, ip);
					// Newspaper thumbnails can be viewed without requiring a player ticket
					if (adapted.dctermsFormat !== IeObjectType.NEWSPAPER && referer) {
						adapted.thumbnailUrl = await this.getThumbnailUrlWithToken(
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
		const ieObjectId = convertSchemaIdentifierToId(schemaIdentifier);
		const childrenIris = await this.getIeObjectChildrenIris(ieObjectId);

		const esQueryObject = {
			size: limit,
			from: 0,
			query: AND([
				{
					more_like_this: {
						fields: [
							ElasticsearchField.schema_name,
							ElasticsearchField.schema_description,
							`${ElasticsearchField.schema_keywords}.keyword`,
							`${ElasticsearchField.schema_is_part_of}.*.keyword`,
							ElasticsearchField.schema_creator_text,
						],
						like: [
							{
								_index: esIndex,
								_id: schemaIdentifier,
							},
						],
						min_term_freq: 1,
						min_doc_freq: 2,
						max_doc_freq: 25,
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
		const adaptedESResponse = await this.adaptESResponse(mediaResponse);

		return {
			...Pagination<IeObject>({
				items: await mapLimit(adaptedESResponse.hits.hits, 20, async (esHit) =>
					this.adaptESObjectToObject(esHit._source, referer, ip)
				),
				page: 1,
				size: adaptedESResponse.hits.hits.length,
				total: adaptedESResponse.hits.total.value,
			}),
		};
	}

	private async getIeObjectByIdFromDb(objectId: string): Promise<IeObjectDetailResponseTypes> {
		const variables = {
			ieObjectId: objectId,
		};
		const performanceTimes: (string | number)[][] = [];
		const responses = (await Promise.all(
			IE_OBJECT_DETAIL_QUERIES.map(async (document) => {
				const queryName = getQueryName(document);
				const startTime = new Date().getTime();

				const response = await this.dataService.execute(document, variables);

				const endTime = new Date().getTime();
				performanceTimes.push([
					'[PERFORMANCE]',
					objectId.split('/').pop(),
					queryName,
					endTime - startTime,
					'ms',
				]);
				return response;
			})
		)) as IeObjectDetailResponseTypes;

		if (this.configService.get('NODE_ENV') !== 'test') {
			// log performance times of sub queries
			const tableData = orderBy(performanceTimes, (performanceItem) => performanceItem[3], 'desc');
			console.table(tableData);
		}

		return responses;
	}

	/**
	 * Get one Intellectual Entity object by its object id (eg: https://data.hetarchief.be/id/entity/086348mc8s)
	 * (not all details are available in ES)
	 */
	public async findByIeObjectId(
		objectId: string,
		referer: string,
		ip: string
	): Promise<Partial<IeObject> | null> {
		// Cache the object for 60 minutes since we need it once for server side rendering and once for client side rendering
		const responses = await this.cacheManager.wrap(
			CACHE_KEY_PREFIX_IE_OBJECT_DETAIL + objectId,
			() => this.getIeObjectByIdFromDb(objectId),
			// cache for 60 minutes
			3_600_000
		);

		// Get parent ieObject if it exists
		const parentIeObjectId = (responses[IeObjectDetailResponseIndex.IsPartOf] as GetIsPartOfQuery)
			?.isPartOf?.[0]?.isPartOf?.id;
		let parentIeObject: Partial<IeObject> | null = null;
		if (parentIeObjectId) {
			parentIeObject = await this.findByIeObjectId(parentIeObjectId, referer, ip);
		}

		const ieObject = await this.adaptFromDB(responses, parentIeObject, referer, ip);
		return ieObject;
	}

	/**
	 * Get the object detail fields that are exposed as metadata
	 */
	public async findMetadataByIeObjectId(
		ieObjectId: string,
		referer: string,
		ip: string
	): Promise<Partial<IeObject>> {
		const object = await this.findByIeObjectId(ieObjectId, referer, ip);
		return this.adaptMetadata(object);
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
				graph_intellectual_entity: ieObjects,
				graph_intellectual_entity_aggregate: ieObjectAggregate,
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

	public async adaptFromDB(
		ieObjectResponseList: IeObjectDetailResponseTypes,
		parentIeObject: Partial<IeObject> | null,
		referer: string,
		ip: string
	): Promise<Partial<IeObject>> {
		const [
			ieObjectResponse,
			dctermsFormatResponse,
			isPartOfResponse,
			hasCarrierResponse,
			meemooLocalIdResponse,
			_premisIdentifierResponse, // TODO remove this one => update all indexes in the array and tests
			mhFragmentIdentifierResponse,
			parentCollectionResponse,
			schemaAlternateNameResponse,
			schemaCopyrightHolderResponse,
			schemaCreatorResponse,
			schemaDurationResponse,
			schemaGenreResponse,
			schemaInLanguageResponse,
			_schemaIsPartOfResponse,
			schemaKeywordsResponse,
			schemaLicenseResponse,
			schemaMediumResponse,
			schemaPublisherResponse,
			schemaSpatialResponse,
			schemaTemporalResponse,
			schemaThumbnailUrlResponse,
			hasPartResponse,
			isRepresentedByResponse,
		]: IeObjectDetailResponseTypes = ieObjectResponseList;

		if (!ieObjectResponse) {
			return null;
		}

		const ie = ieObjectResponse.graph_intellectual_entity?.[0];

		const ieObjectId = ie?.id;
		if (!ieObjectResponse.graph_intellectual_entity?.[0]?.id) {
			return null;
		}

		const licenses = compact(
			schemaLicenseResponse?.schemaLicense.map((item) => item?.schema_license)
		) as IeObjectLicense[];
		const isPublicDomain: boolean =
			licenses.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
			(licenses.includes(IeObjectLicense.PUBLIC_DOMAIN) ||
				licenses.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED));
		// If the object is public domain, we generate a thumbnailUrl with a token that stays valid for 15 years
		// https://meemoo.atlassian.net/browse/ARC-2891
		const tokenValidDuration = isPublicDomain ? 15 * 365 * 24 * 60 * 60 : undefined; // 15 years in seconds
		const thumbnailUrl = await this.getThumbnailUrlWithToken(
			schemaThumbnailUrlResponse?.schemaThumbnailUrl?.[0]?.schema_thumbnail_url?.[0],
			referer,
			ip,
			tokenValidDuration
		);

		const schemaMaintainer = ie?.schemaMaintainer;
		const dctermsFormat = dctermsFormatResponse.dctermsFormat[0]?.dcterms_format as IeObjectType;
		const premisIdentifiers = isPartOfResponse?.isPartOf?.[0]?.isPartOf?.premisIdentifier
			?.premis_identifier as (
			| Record<string, string>
			| { abraham_id: string; abraham_uri: string; code_number: string }
		)[];
		const ieObjectByPages: IeObjectPages | null = await this.adaptRepresentations(
			isRepresentedByResponse,
			hasPartResponse,
			referer,
			ip,
			tokenValidDuration
		);

		const isPartOfParentCollections = parentCollectionResponse?.parentCollection?.map((part) => {
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
		});

		const ieObject: IeObject = {
			schemaIdentifier: ie?.schema_identifier,
			iri: ieObjectId,
			dctermsAvailable: ie?.dcterms_available,
			dctermsFormat,
			dctermsMedium: schemaMediumResponse?.schemaMedium?.[0]?.premis_medium,
			meemooDescriptionCast: ie?.ebucore_has_cast_member,
			creator: schemaCreatorResponse?.graph__schema_creator?.[0]?.schema_creator_array,
			dateCreated: ie?.schema_date_created,
			datePublished: ie?.schema_date_published,
			description: ie?.schema_description,
			duration: schemaDurationResponse?.graph__schema_duration?.[0]?.schema_duration,
			licenses,
			premisIdentifier: premisIdentifiers,
			abrahamInfo: {
				id: isPartOfParentCollections[0]?.schemaIdentifier,
				uri: isPartOfParentCollections[0]?.iri,
			},
			abstract: ie?.schema_abstract,
			genre: compact(schemaGenreResponse?.schemaGenre?.map((item) => item.schema_genre)),
			inLanguage: compact(
				schemaInLanguageResponse?.schemaInLanguage?.map((item) => item?.schema_in_language)
			),
			keywords: compact(
				schemaKeywordsResponse?.schemaKeywords?.map((item) => item?.schema_keywords)
			),
			publisher: compact(
				schemaPublisherResponse?.schemaPublisher?.map((item) => item.schema_publisher_array)
			),
			spatial: compact(schemaSpatialResponse?.schemaSpatial?.map((item) => item.schema_spatial)), // Location of the content
			temporal: compact(
				schemaTemporalResponse?.schemaTemporal?.map((item) => item.schema_temporal)
			),
			synopsis: ie?.ebucore_synopsis,
			copyrightHolder: compact(
				schemaCopyrightHolderResponse?.schemaCopyrightHolder?.map(
					(item) => item.schema_copyright_holder
				)
			).join(', '),
			maintainerId: schemaMaintainer?.org_identifier,
			maintainerName: schemaMaintainer?.skos_pref_label,
			maintainerSlug: schemaMaintainer?.skos_alt_label,
			maintainerLogo: schemaMaintainer?.ha_org_has_logo
				// TODO remove this workaround once the INT organisations assets are available
				.replace('https://assets-int.viaa.be/images/', 'https://assets.viaa.be/images/')
				.replace('https://assets-tst.viaa.be/images/', 'https://assets.viaa.be/images/'),
			maintainerDescription: schemaMaintainer?.dcterms_description,
			maintainerSiteUrl: schemaMaintainer?.foaf_homepage,
			maintainerFormUrl: schemaMaintainer?.ha_org_request_form,
			maintainerOverlay: !!schemaMaintainer?.hasPreference.find(
				(pref) => pref.ha_pref === OrganisationPreference.logoEmbedding
			),
			maintainerIiifAgreement: !!schemaMaintainer?.hasPreference.find(
				(pref) => pref.ha_pref === OrganisationPreference.iiifDissemination
			),
			sector: schemaMaintainer?.ha_org_sector as IeObjectSector,
			name: ie?.schema_name,
			thumbnailUrl,
			premisIsPartOf: ie?.premis_is_part_of,
			isPartOf: isPartOfParentCollections,
			collectionSeasonNumber:
				parentCollectionResponse?.parentCollection?.[0]?.collection?.schema_season_number,
			numberOfPages: ie?.schema_number_of_pages,
			pageNumber: ie?.schema_position,
			meemooLocalId: meemooLocalIdResponse?.meemooLocalId
				?.map((item) => item?.meemoo_local_id)
				.join(', '),
			collectionName: parentCollectionResponse?.parentCollection?.[0]?.collection?.schema_name,
			collectionId: parentCollectionResponse?.parentCollection?.[0]?.collection?.id,
			issueNumber: ie?.schema_issue_number,
			fragmentId: compact(
				mhFragmentIdentifierResponse?.graph_mh_fragment_identifier?.map(
					(item) => item?.mh_fragment_identifier
				)
			).join(', '),
			creditText: ie?.schema_credit_text,
			copyrightNotice: ie?.schema_copyright_notice,
			alternativeTitle: schemaAlternateNameResponse?.ieObject_schemaAlternateName?.map(
				(item) => item.schema_alternate_name
			),
			preceededBy: parentCollectionResponse?.[0]?.collection?.isPreceededBy?.map(
				(ie) => ie.schema_name
			),
			succeededBy: parentCollectionResponse?.[0]?.collection?.isSucceededBy?.map(
				(ie) => ie.schema_name
			),
			width: hasCarrierResponse?.graph_carrier?.[0]?.schema_width,
			height: hasCarrierResponse?.graph_carrier?.[0]?.schema_height,
			bibframeProductionMethod: hasCarrierResponse?.graph_carrier?.[0]?.bibframe_production_method, // Text type
			bibframeEdition: ie?.bibframe_edition, // Publication type
			locationCreated: compact(
				parentCollectionResponse?.parentCollection?.map(
					(part) => part?.collection?.schema_location_created
				)
			)?.join(', '),
			startDate: compact(
				parentCollectionResponse?.parentCollection?.map(
					(part) => part?.collection?.schema_start_date
				)
			)?.join(', '),
			endDate: compact(
				parentCollectionResponse?.parentCollection?.map(
					(part) => part?.collection?.schema_start_date
				)
			)?.join(', '),
			carrierDate: hasCarrierResponse?.graph_carrier?.[0]?.created_at,
			digitizationDate: hasCarrierResponse?.graph_carrier?.[0]?.digitization_date,
			newspaperPublisher: compact(
				parentCollectionResponse?.parentCollection?.map(
					(part) => part?.collection?.schema_publisher
				)
			)?.join(', '),
			pages: ieObjectByPages?.pages || [],
			mentions: ieObjectByPages?.mentions || [],
		};

		return {
			...omitBy(parentIeObject || {}, (value) => isNil(value) || value === ''),
			...omitBy(ieObject, (value) => isNil(value) || value === ''),
		};
	}

	public async adaptRelatedFromDB(
		gqlIeObject:
			| GetParentIeObjectQuery['graph_intellectual_entity'][0]['isPartOf']
			| GetChildIeObjectsQuery['graph_intellectual_entity'][0]['hasPart'][0]
			| null,
		referer: string,
		ip: string
	): Promise<RelatedIeObject> {
		if (!gqlIeObject) {
			return null;
		}
		const thumbnailUrl: string | undefined = await this.getThumbnailUrlWithToken(
			gqlIeObject?.schemaThumbnail?.schema_thumbnail_url?.[0],
			referer,
			ip
		);
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
			maintainerSlug: gqlIeObject?.schemaMaintainer?.skos_alt_label,
			sector: gqlIeObject?.schemaMaintainer?.ha_org_sector as IeObjectSector,
			name: gqlIeObject?.schema_name,
			thumbnailUrl,
		};
	}

	/**
	 * Collapses
	 * - video, videoFragment  and film type objects under video
	 * - and audio and audioFragment under audio
	 * @param esResponse
	 */
	public async adaptESResponse(esResponse: ElasticsearchResponse): Promise<ElasticsearchResponse> {
		// merge 'film' aggregations with 'video' if need be
		if (esResponse.aggregations?.dcterms_format?.buckets) {
			esResponse.aggregations.dcterms_format.buckets =
				esResponse.aggregations.dcterms_format.buckets.filter((bucket) => {
					if (bucket.key === IeObjectType.FILM || bucket.key === IeObjectType.VIDEO_FRAGMENT) {
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

		return esResponse;
	}

	public async adaptESObjectToObject(
		esObject: ElasticsearchObject,
		referer: string,
		ip: string
	): Promise<IeObject> {
		let thumbnailUrl: string | null;
		if (
			esObject.dcterms_format === IeObjectType.AUDIO ||
			esObject.dcterms_format === IeObjectType.AUDIO_FRAGMENT
		) {
			thumbnailUrl = '/images/waveform.svg';
		} else {
			// TODO remove this replace when https://meemoo.atlassian.net/browse/ARC-2816 is fixed
			const thumb = esObject?.schema_thumbnail_url?.[0]?.replace(
				'.viaa.be.play/v2/',
				'.viaa.be/play/v2/'
			);
			thumbnailUrl = await this.getThumbnailUrlWithToken(thumb, referer, ip);
		}

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
			thumbnailUrl,
			numberOfPages: esObject?.schema_number_of_pages,
			meemooLocalId: esObject?.meemoo_local_id?.[0],
			durationInSeconds: esObject?.duration_seconds,
			pages: [],
			mentions: [],
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
			name: graphQlObject.intellectualEntity?.schema_name,
			dctermsFormat: graphQlObject.intellectualEntity?.dctermsFormat?.[0]
				?.dcterms_format as IeObjectType,
			dateCreated: graphQlObject.intellectualEntity?.schema_date_created || null,
			datePublished: graphQlObject.intellectualEntity?.schema_date_published || null,
			meemooLocalId: graphQlObject.intellectualEntity?.premisIdentifier?.[0]?.meemoo_local_id,
			isPartOf: (graphQlObject.intellectualEntity?.schemaIsPartOf || []).map(
				(
					parent
				): {
					collectionType: IsPartOfKey;
					name: string;
				} => {
					return {
						collectionType: parent.type as IsPartOfKey,
						name: parent.collection?.schema_name,
					};
				}
			),
		};
	}

	public adaptMetadata(ieObject: Partial<IeObject>): Partial<IeObject> {
		// unset thumbnail and representations
		ieObject.pages = undefined;
		ieObject.thumbnailUrl = undefined;
		return ieObject;
	}

	public async adaptRepresentations(
		isRepresentedByResponse: GetIsRepresentedByQuery,
		hasPartResponse: GetHasPartQuery,
		referer: string,
		ip: string,
		tokenValidDuration?: number
	): Promise<IeObjectPages | null> {
		const ieObjectSelf = isRepresentedByResponse?.graph__intellectual_entity[0];
		const ieObjectParts = hasPartResponse?.graph_intellectual_entity || [];
		const ieObjects = (
			compact([ieObjectSelf, ...ieObjectParts]) as DbIeObjectWithRepresentations[]
		).filter((ieObject) => (ieObject.isRepresentedBy?.length || 0) > 0);

		if (isEmpty(ieObjects)) {
			return null;
		}

		const allMentions: Mention[] = [];

		/* istanbul ignore next */
		// Standardize the isRepresentedBy and the hasPart.isRepresentedBy parts of the query to a list of pages with each their file representations
		const pages: IeObjectPage[] = compact(
			await mapLimit(
				ieObjects || [],
				20,
				async (
					page: DbIeObjectWithRepresentations,
					pageIndex: number
				): Promise<IeObjectPage | null> => {
					const representations: IeObjectRepresentation[] = compact(
						await mapLimit(
							page?.isRepresentedBy || [],
							20,
							async (representation: DbRepresentation): Promise<IeObjectRepresentation> => {
								if (!representation) {
									return null;
								}
								const transcriptInfo = representation.schemaTranscriptUrls?.[0];
								const schemaTranscript = transcriptInfo?.schema_transcript;
								const schemaTranscriptUrl = transcriptInfo?.schema_transcript_url || null;

								return {
									id: representation.id,
									schemaName: representation.schema_name,
									isMediaFragmentOf: representation.is_media_fragment_of,
									schemaInLanguage: representation.schema_in_language,
									schemaStartTime: representation.schema_start_time,
									schemaEndTime: representation.schema_end_time,
									schemaTranscript,
									schemaTranscriptUrl,
									edmIsNextInSequence: representation.edm_is_next_in_sequence,
									updatedAt: representation.updated_at,
									files: await this.adaptFiles(
										representation.includes,
										referer,
										ip,
										tokenValidDuration
									),
								};
							}
						)
					).flat();
					// Avoid returning empty array representations
					if (representations.length) {
						const mentions = this.adaptMentions(
							(page as DbIeObjectWithMentions).schemaMentions || [],
							page.schema_position,
							pageIndex
						);
						allMentions.push(...mentions);
						return {
							pageNumber: page.schema_position,
							representations,
						};
					}
					return null;
				}
			)
		);

		return {
			pages,
			mentions: allMentions,
		};
	}

	public async adaptFiles(
		dbFiles: DbFile,
		referer: string,
		ip: string,
		tokenValidDuration?: number
	): Promise<IeObjectFile[]> {
		if (isEmpty(dbFiles)) {
			return [];
		}

		/* istanbul ignore next */
		return compact(
			await mapLimit(dbFiles, 20, async (includeFile): Promise<IeObjectFile> => {
				const file = includeFile.file;
				if (!file) {
					return null;
				}
				const thumbnailUrl: string | undefined = await this.getThumbnailUrlWithToken(
					file.schema_thumbnail_url,
					referer,
					ip,
					tokenValidDuration
				);

				return {
					id: file.id,
					name: file.schema_name,
					mimeType: file.ebucore_has_mime_type,
					storedAt: file.premis_stored_at,
					thumbnailUrl,
					duration: file.schema_duration,
					edmIsNextInSequence: file.edm_is_next_in_sequence,
					createdAt: file.created_at,
				};
			})
		);
	}

	private adaptForSitemap(
		gqlIeObject: FindIeObjectsForSitemapQuery['graph_intellectual_entity'][0]
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
					url: this.configService.get('ELASTICSEARCH_URL'),
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
	): SearchTermParseResult {
		const searchTerms = filters
			.filter((searchFilter) => searchFilter.field === IeObjectsSearchFilterField.QUERY)
			.map((filter) => filter.value);
		if (!searchTerms || searchTerms.length === 0) {
			return {
				plainTextSearchTerms: [],
				parsedSuccessfully: true,
			};
		}
		const searchTermParseResults: SearchTermParseResult[] = searchTerms.flatMap((searchTerm) =>
			convertStringToSearchTerms(searchTerm)
		);
		const plainTextSearchTerms = searchTermParseResults.flatMap(
			(result) => result.plainTextSearchTerms
		);
		const parsedSuccessfully = searchTermParseResults.every((result) => result.parsedSuccessfully);
		return {
			plainTextSearchTerms,
			parsedSuccessfully,
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
		query: string,
		inputQuery: IeObjectsQueryDto,
		user?: SessionUserEntity
	): Promise<string[]> {
		// Get active visits for the current user
		// Need this to retrieve visitorSpaceAccessInfo
		const visitorSpaceAccessInfo = await this.getVisitorSpaceAccessInfoFromUser(user);

		// Reuse the existing logic to build a query object
		const esQuery: any = await this.getEsQueryObject(inputQuery, user, visitorSpaceAccessInfo);

		// Extend the default query with the autocomplete query
		const esField = AUTOCOMPLETE_FIELD_TO_ES_FIELD_NAME[field];
		esQuery._source = false;
		esQuery.fields = [`${esField}.sayt`];
		esQuery.size = 200; // Load more results, so we can remove the non unique entries
		esQuery.query = {
			bool: {
				must: [
					{
						multi_match: {
							query: query,
							type: 'bool_prefix',
							fields: [`${esField}.sayt`, `${esField}.sayt._2gram`, `${esField}.sayt._3gram`],
						},
					},
					esQuery.query,
				],
			},
		};
		if (field === AutocompleteField.newspaperSeriesName) {
			esQuery.collapse = {
				field: `${esField}.keyword`, // Collapse on the keyword field to get unique values,
			};
		}

		if (process.env.NODE_ENV === 'local') {
			fs.writeFile('query-autocomplete.json', JSON.stringify(esQuery, null, 2));
		}

		const id = randomUUID();
		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Executing elasticsearch query on index ${ALL_INDEXES}: ${JSON.stringify(esQuery)}`
			);
		}

		const response: EsQueryAutocompleteMatchPhraseResponse = await this.executeQuery(
			ALL_INDEXES,
			esQuery
		);

		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Response from elasticsearch query on index ${ALL_INDEXES}: ${JSON.stringify(
					esQuery
				)}`
			);
		}

		const queryParts = query.toLowerCase().split(' ');

		// Map elasticsearch response to a list of unique strings
		return take(
			uniq(
				response.hits?.hits?.flatMap((hit): string[] => {
					const value = hit.fields[`${esField}.sayt`];
					if (isArray(value)) {
						// List of strings
						let relevantValues: string[];
						if (value.length > 1) {
							// If there are multiple values, filter them based on the query parts
							relevantValues = value.filter((v) =>
								queryParts.every((queryPart) => v.toLowerCase().includes(queryPart))
							);
						} else {
							relevantValues = value;
						}

						return relevantValues.map((v) => {
							return v.trim();
						});
					}
					// Single string
					return [value] as string[];
				})
			),
			200
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
				response.graph__intellectual_entity_prev_and_next[0]?.previousIeObject?.schema_identifier,
			nextIeObjectId:
				response.graph__intellectual_entity_prev_and_next[0]?.nextIeObject?.schema_identifier,
		};
	}

	/**
	 * Get a thumbnailUrl with token if thumbnailUrl is defined and referer is defined
	 * @param thumbnailUrl
	 * @param referer site on which this thumbnail will be viewed. eg: https://hetarchief.be. Leave null for not resolving the url with a player ticket (faster)
	 * @param ip
	 * @param validDuration number of seconds the token is valid for. Defaults to 4 hours (14400 seconds) (env var: TICKET_SERVICE_MAXAGE)
	 */
	public async getThumbnailUrlWithToken(
		thumbnailUrl: string | undefined | null,
		referer: string | null,
		ip: string,
		validDuration?: number
	): Promise<string | undefined> {
		if (thumbnailUrl && referer) {
			return this.playerTicketService.resolveThumbnailUrl(thumbnailUrl, referer, ip, validDuration);
		}
		return thumbnailUrl || undefined;
	}

	/**
	 * Adapt mentions from the DB to the API format
	 * @param schemaMentions
	 * @param pageNumber number that is printed on the page if available
	 * @param pageIndex index of the page in the list of pages (0 based). In the best case, this matches with the pageNumber by adding 1, but is not guaranteed
	 * @private
	 */
	private adaptMentions(
		schemaMentions: DbIeObjectWithMentions['schemaMentions'],
		pageNumber: number,
		pageIndex: number
	): Mention[] {
		return compact(
			schemaMentions?.map((mention): Mention => {
				if (!mention.thing) {
					return null;
				}
				return {
					pageNumber,
					pageIndex,
					confidence: mention?.confidence,
					iri: mention?.thing?.id,
					name: mention?.thing?.schema_name,
					birthDate: mention?.thing?.schema_birth_date,
					birthPlace: mention?.thing?.schema_birth_place,
					deathDate: mention?.thing?.schema_death_date,
					deathPlace: mention?.thing?.schema_death_place,
					highlights: mention.highlights.map((highlight) => {
						return {
							x: highlight.x,
							y: highlight.y,
							width: highlight.width,
							height: highlight.height,
						};
					}),
				};
			})
		);
	}
}
