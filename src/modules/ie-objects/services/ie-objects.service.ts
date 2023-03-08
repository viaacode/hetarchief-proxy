import { randomUUID } from 'crypto';

import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import got, { Got } from 'got';
import { find, get, isEmpty, isNil, kebabCase } from 'lodash';

import { Configuration } from '~config';

import { IeObjectsQueryDto } from '../dto/ie-objects.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import { getSearchEndpoint } from '../helpers/get-search-endpoint';
import { getVisitorSpaceAccessInfoFromVisits } from '../helpers/get-visitor-space-access-info-from-visits';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import { IE_OBJECT_EXTRA_USER_GROUPS, IE_OBJECT_LICENSES_BY_USER_GROUP } from '../ie-objects.conts';
import {
	ElasticsearchObject,
	ElasticsearchResponse,
	GqlIeObject,
	GqlLimitedIeObject,
	IeObject,
	IeObjectExtraUserGroupType,
	IeObjectFile,
	IeObjectLicense,
	IeObjectRepresentation,
	IeObjectSector,
	IeObjectsVisitorSpaceInfo,
	IeObjectsWithAggregations,
} from '../ie-objects.types';

import {
	FindAllObjectsByCollectionIdDocument,
	FindAllObjectsByCollectionIdQuery,
	FindAllObjectsByCollectionIdQueryVariables,
	GetObjectDetailBySchemaIdentifierDocument,
	GetObjectDetailBySchemaIdentifierQuery,
	GetObjectDetailBySchemaIdentifierQueryVariables,
	GetObjectIdentifierTupleDocument,
	GetObjectIdentifierTupleQuery,
	GetObjectIdentifierTupleQueryVariables,
	GetRelatedObjectsDocument,
	GetRelatedObjectsQuery,
	GetRelatedObjectsQueryVariables,
	Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus,
} from '~generated/graphql-db-types-hetarchief';
import { SessionUserEntity } from '~modules/users/classes/session-user';
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
		private visitsService: VisitsService
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
		user: SessionUserEntity,
		visitorSpaceInfo?: IeObjectsVisitorSpaceInfo,
		sector?: IeObjectSector | null
	): Promise<IeObjectsWithAggregations> {
		const id = randomUUID();
		const esQuery = QueryBuilder.build(inputQuery, {
			user: {
				isKeyUser: user.getIsKeyUser(),
				maintainerId: user.getMaintainerId(),
				sector: sector || null,
			},
			visitorSpaceInfo,
		});

		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Executing elasticsearch query on index ${esIndex}: ${JSON.stringify(
					esQuery
				)}`
			);
		}

		const objectResponse = await this.executeQuery(esIndex, esQuery);

		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Response from elasticsearch query on index ${esIndex}: ${JSON.stringify(
					objectResponse
				)}`
			);
		}

		const adaptedESResponse = await this.adaptESResponse(objectResponse, referer);

		return {
			...Pagination<IeObject>({
				items: adaptedESResponse.hits.hits.map((esHit) =>
					this.adaptESObjectToObject(esHit._source)
				),
				page: 1,
				size: adaptedESResponse.hits.hits.length,
				total: adaptedESResponse.hits.total.value,
			}),
			aggregations: adaptedESResponse.aggregations,
		};
	}

	public async countRelated(meemooIdentifiers: string[] = []): Promise<Record<string, number>> {
		const items = await this.dataService.execute<
			GetObjectIdentifierTupleQuery,
			GetObjectIdentifierTupleQueryVariables
		>(GetObjectIdentifierTupleDocument, {
			meemooIdentifiers,
		});

		const count: Record<string, number> = {};

		items?.object_ie?.forEach((item) => {
			count[item.meemoo_identifier] = (count[item.meemoo_identifier] || 0) + 1;
		});

		return count;
	}

	public async getRelated(
		schemaIdentifier: string,
		meemooIdentifier: string,
		referer: string
	): Promise<IPagination<IeObject>> {
		const mediaObjects = await this.dataService.execute<
			GetRelatedObjectsQuery,
			GetRelatedObjectsQueryVariables
		>(GetRelatedObjectsDocument, {
			schemaIdentifier,
			meemooIdentifier,
		});

		const adaptedItems = await Promise.all(
			mediaObjects.object_ie.map(async (object: any) => {
				const adapted = this.adaptFromDB(object);
				adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
					adapted.thumbnailUrl,
					referer
				);
				return adapted;
			})
		);

		return Pagination<IeObject>({
			items: adaptedItems,
			page: 1,
			size: mediaObjects.object_ie.length,
			total: mediaObjects.object_ie.length,
		});
	}

	public async getSimilar(
		schemaIdentifier: string,
		esIndex: string,
		referer: string,
		limit = 4
	): Promise<IPagination<IeObject>> {
		const likeFilter = {
			_index: esIndex,
			_id: schemaIdentifier,
		};

		const esQueryObject = {
			size: limit,
			from: 0,
			query: {
				more_like_this: {
					fields: ['schema_name', 'schema_description'],
					like: [likeFilter],
					min_term_freq: 1,
					max_query_terms: 12,
				},
			},
		};

		const mediaResponse = await this.executeQuery(esIndex, esQueryObject);
		const adaptedESResponse = await this.adaptESResponse(mediaResponse, referer);

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
	public async findBySchemaIdentifier(
		schemaIdentifier: string,
		referer: string
	): Promise<IeObject> {
		const { object_ie: objectIe } = await this.dataService.execute<
			GetObjectDetailBySchemaIdentifierQuery,
			GetObjectDetailBySchemaIdentifierQueryVariables
		>(GetObjectDetailBySchemaIdentifierDocument, {
			schemaIdentifier,
		});

		if (!objectIe[0]) {
			throw new NotFoundException(`Object IE with id '${schemaIdentifier}' not found`);
		}

		const adapted = this.adaptFromDB(objectIe[0]);
		adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
			adapted.thumbnailUrl,
			referer
		);
		return adapted;
	}

	/**
	 * Get the object detail fields that are exposed as metadata
	 */
	public async findMetadataBySchemaIdentifier(
		schemaIdentifier: string
	): Promise<Partial<IeObject>> {
		const object = await this.findBySchemaIdentifier(schemaIdentifier, null);
		return this.adaptMetadata(object);
	}

	/**
	 * Returns a limited set of metadata fields for export
	 */
	public async findAllObjectMetadataByCollectionId(
		collectionId: string,
		userProfileId: string
	): Promise<Partial<IeObject>[]> {
		const { users_folder_ie: allObjects } = await this.dataService.execute<
			FindAllObjectsByCollectionIdQuery,
			FindAllObjectsByCollectionIdQueryVariables
		>(FindAllObjectsByCollectionIdDocument, {
			collectionId,
			userProfileId,
		});

		if (!allObjects[0]) {
			throw new NotFoundException();
		}

		const allAdapted = allObjects.map((object) => {
			return this.adaptLimitedMetadata(object);
		});

		return allAdapted;
	}

	// Adapt
	// ------------------------------------------------------------------------

	public adaptFromDB(gqlIeObject: GqlIeObject): IeObject {
		return {
			dctermsAvailable: gqlIeObject?.dcterms_available,
			dctermsFormat: gqlIeObject?.dcterms_format,
			dctermsMedium: gqlIeObject?.dcterms_medium,
			ebucoreObjectType: gqlIeObject?.ebucore_object_type,
			meemooIdentifier: gqlIeObject?.meemoo_identifier,
			meemoofilmBase: gqlIeObject?.meemoofilm_base,
			meemoofilmColor: gqlIeObject?.meemoofilm_color,
			meemoofilmContainsEmbeddedCaption: gqlIeObject?.meemoofilm_contains_embedded_caption,
			meemoofilmImageOrSound: gqlIeObject?.meemoofilm_image_or_sound,
			premisIdentifier: gqlIeObject?.premis_identifier,
			abstract: gqlIeObject?.schema_abstract,
			creator: gqlIeObject?.schema_creator,
			dateCreated: gqlIeObject?.schema_date_created,
			datePublished: gqlIeObject?.schema_date_published,
			description: gqlIeObject?.schema_description,
			duration: gqlIeObject?.schema_duration,
			genre: gqlIeObject?.schema_genre,
			schemaIdentifier: gqlIeObject?.schema_identifier,
			inLanguage: gqlIeObject?.schema_in_language,
			keywords: gqlIeObject?.schema_keywords,
			licenses: gqlIeObject?.schema_license,
			maintainerId: gqlIeObject?.maintainer.schema_identifier,
			maintainerName: gqlIeObject?.maintainer?.schema_name,
			maintainerSlug: kebabCase(gqlIeObject?.maintainer?.schema_name || '') || undefined, // TODO fetch actual slug
			name: gqlIeObject?.schema_name,
			publisher: gqlIeObject?.schema_publisher,
			spatial: gqlIeObject?.schema_spatial_coverage,
			temporal: gqlIeObject?.schema_temporal_coverage,
			thumbnailUrl: gqlIeObject?.schema_thumbnail_url,
			premisIsPartOf: gqlIeObject?.premis_is_part_of,
			alternativeName: gqlIeObject?.schema_is_part_of?.alternatief,
			copyrightHolder: gqlIeObject?.schema_copyright_holder,
			series: gqlIeObject?.schema_is_part_of?.serie,
			programs: gqlIeObject?.schema_is_part_of?.reeks,
			numberOfPages: gqlIeObject?.schema_number_of_pages,
			meemooDescriptionCast: gqlIeObject?.meemoo_description_cast,
			representations: this.adaptRepresentations(gqlIeObject?.premis_is_represented_by),
			meemooDescriptionProgramme: gqlIeObject?.meemoo_description_programme,
			meemooLocalId: gqlIeObject?.meemoo_local_id,
			meemooOriginalCp: gqlIeObject?.meemoo_original_cp,
			durationInSeconds: gqlIeObject?.schema_duration_in_seconds,
			copyrightNotice: gqlIeObject?.schema_copyright_notice,
			meemooMediaObjectId: gqlIeObject?.meemoo_media_object_id,
			dateCreatedLowerBound: gqlIeObject?.schema_date_created_lower_bound,
			actor: gqlIeObject?.schema_actor,
		};
	}

	public async adaptESResponse(
		esResponse: ElasticsearchResponse,
		referer: string
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
		const nrHits = get(esResponse, 'hits.total.value');
		if (!nrHits) {
			return esResponse;
		}

		// there are hits - resolve thumbnail urls
		esResponse.hits.hits = await Promise.all(
			esResponse.hits.hits.map(async (hit) => {
				hit._source.schema_thumbnail_url =
					await this.playerTicketService.resolveThumbnailUrl(
						hit._source.schema_thumbnail_url,
						referer
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
			alternativeName: esObject?.schema_alternate_name,
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
			schemaIsPartOf: esObject?.schema_is_part_of,
			keywords: esObject?.schema_keywords,
			licenses: esObject?.schema_license as IeObjectLicense[],
			maintainerId: esObject?.schema_maintainer?.schema_identifier,
			maintainerName: esObject?.schema_maintainer?.schema_name,
			maintainerSlug: esObject?.schema_maintainer?.alt_label,
			name: esObject?.schema_name,
			publisher: esObject?.schema_publisher,
			spatial: esObject?.schema_spatial_coverage,
			temporal: esObject?.schema_temporal_coverage,
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
			series: esObject?.schema_is_part_of?.serie,
			programs: esObject?.schema_is_part_of?.reeks,
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
			schemaIdentifier: graphQlObject.ie?.schema_identifier,
			premisIdentifier: graphQlObject.ie?.premis_identifier,
			maintainerName: graphQlObject.ie?.maintainer?.schema_name,
			name: graphQlObject.ie?.schema_name,
			dctermsFormat: graphQlObject.ie?.dcterms_format,
			dateCreatedLowerBound: graphQlObject.ie?.schema_date_created_lower_bound,
			datePublished: graphQlObject.ie?.schema_date_published,
			meemooIdentifier: graphQlObject.ie?.meemoo_identifier,
			meemooLocalId: graphQlObject.ie?.meemoo_local_id,
			series: graphQlObject.ie?.schema_is_part_of?.serie || [],
			programs: graphQlObject.ie?.schema_is_part_of?.programma || [],
		};
	}

	public adaptMetadata(ieObject: IeObject): Partial<IeObject> {
		// unset thumbnail and representations
		delete ieObject.representations;
		delete ieObject.thumbnailUrl;
		return ieObject;
	}

	public adaptRepresentations(graphQlRepresentations: any): IeObjectRepresentation[] {
		if (isEmpty(graphQlRepresentations)) {
			return [];
		}

		/* istanbul ignore next */
		return graphQlRepresentations.map((representation) => ({
			name: representation?.schema_name,
			alternateName: representation?.schema_alternate_name,
			description: representation?.schema_description,
			schemaIdentifier: representation?.ie_schema_identifier,
			dctermsFormat: representation?.dcterms_format,
			transcript: representation?.schema_transcript,
			dateCreated: representation?.schema_date_created,
			files: this.adaptFiles(representation?.premis_includes),
		}));
	}

	public adaptFiles(graphQlFiles: any): IeObjectFile[] {
		if (isEmpty(graphQlFiles)) {
			return [];
		}

		/* istanbul ignore next */
		return graphQlFiles.map(
			(file): IeObjectFile => ({
				name: file?.schema_name,
				alternateName: file?.schema_alternate_name,
				description: file?.schema_description,
				schemaIdentifier: file?.representation_schema_identifier,
				ebucoreMediaType: file?.ebucore_media_type,
				ebucoreIsMediaFragmentOf: file?.ebucore_is_media_fragment_of,
				embedUrl: file?.schema_embed_url,
			})
		);
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
		user: SessionUserEntity
	): Promise<IeObjectsVisitorSpaceInfo> {
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
		const visitorSpaceAccessInfo = getVisitorSpaceAccessInfoFromVisits(activeVisits.items);

		return {
			objectIds: visitorSpaceAccessInfo.objectIds,
			visitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
		};
	}

	public defaultLimitedMetadata(ieObject: Partial<IeObject>): Partial<IeObject> {
		return {
			name: ieObject?.name,
			maintainerName: ieObject?.maintainerName,
			maintainerId: ieObject?.maintainerId,
			series: ieObject?.series || [],
			dctermsFormat: ieObject?.dctermsFormat,
			dateCreatedLowerBound: ieObject?.dateCreatedLowerBound,
			datePublished: ieObject?.datePublished,
			meemooIdentifier: ieObject?.meemooIdentifier,
			meemooLocalId: ieObject?.meemooLocalId,
			premisIdentifier: ieObject?.premisIsPartOf,
			schemaIdentifier: ieObject?.schemaIdentifier,
			programs: ieObject?.programs || [],
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
			maintainerId: user.getMaintainerId(),
			groupId: user.getGroupId(),
			isKeyUser: user.getIsKeyUser(),
			accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
			licensesByUserGroup:
				IE_OBJECT_LICENSES_BY_USER_GROUP[
					isNil(user.getId())
						? IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.ANONYMOUS]
						: user.getGroupId()
				],
		});

		return {
			accessThrough: [],
			...(limitedObjectDetails ?? {}),
			...this.defaultLimitedMetadata(folderObjectItem),
		};
	}
}
