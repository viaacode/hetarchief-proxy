import { randomUUID } from 'crypto';

import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pagination } from '@studiohyperdrive/pagination';
import got, { Got } from 'got';
import { compact, find, get, intersection, isEmpty, set, union, unset } from 'lodash';

import { Configuration } from '~config';

import { IeObjectsQueryDto } from '../dto/ie-objects.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import {
	ElasticsearchObject,
	ElasticsearchResponse,
	IeObject,
	IeObjectLicense,
	IeObjectsWithAggregations,
	IeObjectsWithAggregationsAndFilters,
} from '../ie-objects.types';

import { ActiveVisitByUser } from './../../visits/types';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { VisitsService } from '~modules/visits/services/visits.service';

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
		user: SessionUserEntity
	): Promise<IeObjectsWithAggregationsAndFilters> {
		let esQueryWithLicenses = null;
		const id = randomUUID();
		const esQuery = QueryBuilder.build(inputQuery);

		const activeVisits = await this.visitsService.findActiveVisitsByUser(user.getId());

		let activeVisitsVisitorSpaceIds = [];
		let activeVisitsFolderIds = [];
		if (!isEmpty(activeVisits)) {
			activeVisitsVisitorSpaceIds = (activeVisits as ActiveVisitByUser[]).map(
				(activeVisit: ActiveVisitByUser) => activeVisit.visitorSpace.maintainerId
			);

			activeVisitsFolderIds = union(
				...(activeVisits as ActiveVisitByUser[]).map(
					(activeVisit: ActiveVisitByUser) => activeVisit.collections
				)
			);

			// Check licenses of objects
			if (!this.configService.get('IGNORE_OBJECT_LICENSES')) {
				esQueryWithLicenses = this.applyLicenseToESQuery(
					esQuery,
					user,
					activeVisitsVisitorSpaceIds,
					activeVisitsFolderIds
				);
			}
		}

		if (this.configService.get('ELASTICSEARCH_LOG_QUERIES')) {
			this.logger.log(
				`${id}, Executing elasticsearch query on index ${esIndex}: ${JSON.stringify(
					esQueryWithLicenses || esQuery
				)}`
			);
		}

		const objectResponse = await this.executeQuery(esIndex, esQueryWithLicenses || esQuery);

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
				page: 0,
				size: adaptedESResponse.hits.total.value,
				total: adaptedESResponse.hits.total.value,
			}),
			aggregations: adaptedESResponse.aggregations,
			filters: {
				activeVisitsVisitorSpaceIds,
				activeVisitsFolderIds,
			},
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
			schemaIdentifier: esObject?.schema_identifier,
			meemooIdentifier: esObject?.meemoo_identifier,
			premisIdentifier: esObject?.premis_identifier,
			premisIsPartOf: esObject?.premis_is_part_of,
			series: esObject?.schema_is_part_of?.serie,
			program: esObject?.schema_is_part_of?.reeks,
			alternativeName: esObject.schema_is_part_of?.alternatief,
			maintainerId: esObject?.schema_maintainer?.schema_identifier,
			maintainerName: esObject?.schema_maintainer?.schema_name,
			contactInfo: null,
			copyrightHolder: null,
			copyrightNotice: null,
			durationInSeconds: null,
			numberOfPages: null,
			datePublished: esObject?.schema_date_published,
			dctermsAvailable: esObject?.dcterms_available,
			name: esObject?.schema_name,
			description: esObject?.schema_description,
			abstract: esObject?.schema_abstract,
			creator: esObject?.schema_creator,
			actor: null,
			publisher: esObject?.schema_publisher,
			spatial: null, // -> REQUIRED but no data available
			temporal: null, // -> REQUIRED but no data available
			keywords: esObject?.schema_keywords,
			dctermsFormat: esObject?.dcterms_format,
			dctermsMedium: esObject?.dcterms_medium,
			inLanguage: esObject?.schema_in_language,
			thumbnailUrl: esObject?.schema_thumbnail_url,
			duration: esObject?.schema_duration,
			licenses: esObject?.schema_license,
			meemooMediaObjectId: null,
			dateCreated: esObject?.schema_date_created,
			dateCreatedLowerBound: null,
			genre: esObject?.schema_genre,
			ebucoreObjectType: esObject?.ebucore_object_type,
			meemoofilmColor: null, // -> REQUIRED but no data available
			meemoofilmBase: null, // -> REQUIRED but no data available
			meemoofilmImageOrSound: null, // -> REQUIRED but no data available
			meemooLocalId: null, // -> REQUIRED but no data available
			meemooOriginalCp: null, // -> REQUIRED but no data available
			meemooDescriptionProgramme: null, // -> REQUIRED but no data available
			meemooDescriptionCast: null, // -> REQUIRED but no data available
			representations: null,
		};
	}

	public adaptMetadata(ieObject: IeObject): Partial<IeObject> {
		// unset thumbnail and representations
		delete ieObject.representations;
		delete ieObject.thumbnailUrl;
		return ieObject;
	}

	public getLimitedMetadata(ieObject: IeObject): Partial<IeObject> {
		return {
			schemaIdentifier: ieObject.schemaIdentifier,
			premisIdentifier: ieObject.premisIdentifier,
			maintainerName: ieObject.maintainerName,
			name: ieObject.name,
			dctermsFormat: ieObject.dctermsFormat,
			dateCreatedLowerBound: ieObject.dateCreatedLowerBound,
			datePublished: ieObject.datePublished,
		};
	}

	protected applyLicensesToObject(
		objectMedia: IeObject,
		userHasAccessToSpace: boolean
	): IeObject | Partial<IeObject> | null {
		// check licenses
		const licenses = objectMedia.licenses;
		const schemaIdentifier = objectMedia.schemaIdentifier;
		const maintainerId = objectMedia.maintainerId;

		if (
			!licenses ||
			intersection(licenses, [
				IeObjectLicense.BEZOEKERTOOL_CONTENT,
				IeObjectLicense.BEZOEKERTOOL_METADATA,
			]).length === 0
		) {
			this.logger.debug(`Object ${schemaIdentifier} has no valid license`);
			// no valid license throws a not found exception(ARC-670)
			return null;
		}

		// no access to visitor space == limited metadata
		if (!userHasAccessToSpace) {
			this.logger.debug(
				`User has no access to visitor space ${maintainerId}, only limited metadata allowed`
			);

			if (objectMedia.schemaIdentifier) {
				return this.getLimitedMetadata(objectMedia);
			}
		}

		if (!licenses.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT)) {
			// unset representations - user not allowed to view essence
			this.logger.debug(
				`Object ${schemaIdentifier} has no content license, only metadata is returned`
			);
			delete objectMedia.representations; // No access to files (mp4/mp3)
			delete objectMedia.thumbnailUrl; // Not allowed to view thumbnail
		}

		return objectMedia;
	}

	public applyLicensesToSearchResult(
		result: IeObjectsWithAggregations,
		userHasAccessToSpace?: boolean
	): IeObjectsWithAggregations {
		result.items = compact(
			result.items.map(
				(ieObject: IeObject) =>
					this.applyLicensesToObject(ieObject, userHasAccessToSpace) as IeObject
			)
		);
		return result;
	}

	public applyLicenseToESQuery(
		esQuery: any,
		user: SessionUserEntity,
		visitorSpaceIds: string[],
		visitorFolderIds: string[]
	): any {
		let checkSchemaLicenses = [];

		unset(esQuery, 'query.match_all');

		checkSchemaLicenses = [
			// 1) Check schema_license contains "PUBLIC-METADATA-LTD" or PUBLIC-METADATA-ALL"
			{
				terms: {
					schema_license: [
						IeObjectLicense.PUBLIEK_METADATA_LTD,
						IeObjectLicense.PUBLIEK_METADATA_ALL,
					],
				},
			},
			// 4) Check or-id is part of visitorSpaceIds
			// separate because can't have 2 terms in same object
			{
				terms: {
					maintainer: visitorSpaceIds,
				},
			},
			{
				terms: {
					schema_license: [
						IeObjectLicense.BEZOEKERTOOL_METADATA,
						IeObjectLicense.BEZOEKERTOOL_CONTENT,
					],
				},
			},
			// 5) Check object id is part of folderObjectIds
			// "[ids] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
			{
				ids: {
					values: visitorFolderIds,
				},
			},
			{
				terms: {
					schema_license: [
						IeObjectLicense.BEZOEKERTOOL_METADATA,
						IeObjectLicense.BEZOEKERTOOL_CONTENT,
					],
				},
			},
		];

		if (user.getIsKeyUser()) {
			checkSchemaLicenses = [
				...checkSchemaLicenses,
				// 2) Check or-id is part of sectorOrIds en sleutel gebruiker
				{
					sector: {
						values: [user.getMaintainerId()],
					},
					terms: {
						schema_license: [
							IeObjectLicense.INTRA_CP_METADATA_ALL,
							IeObjectLicense.INTRA_CP_CONTENT,
						],
					},
				},
				// 3) or-id is eigen or id en sleutel gebruiker
				{
					term: {
						schema_maintainer: user.getMaintainerId(),
					},
					terms: {
						schema_license: [
							IeObjectLicense.INTRA_CP_METADATA_ALL,
							IeObjectLicense.INTRA_CP_CONTENT,
						],
					},
				},
			];
		}

		// Set schema licenses
		set(esQuery, 'query.bool.should', [...checkSchemaLicenses]);
		set(esQuery, 'query.bool.minimum_should_match', 1);

		// Return esQuery with applied licenses
		return esQuery;
	}

	/**
	 * Helper function to return if the user has access to a visitor space (or-id) / esIndex
	 * The user is either a maintainer of the specified esIndex
	 * Or the user has an approved visit request for the current timestamp
	 */
	public async userHasAccessToVisitorSpaceOrId(
		user: SessionUserEntity,
		esIndex: string
	): Promise<boolean> {
		const isMaintainer =
			esIndex &&
			user.getMaintainerId() &&
			user.getMaintainerId().toLowerCase() === esIndex.toLowerCase();

		return isMaintainer || (await this.visitsService.hasAccess(user.getId(), esIndex));
	}

	public getSearchEndpoint(esIndex: string | null): string {
		if (!esIndex) {
			return '_search';
		}
		return `${esIndex}/_search`;
	}

	public async executeQuery(esIndex: string, esQuery: any): Promise<any> {
		try {
			this.logger.debug(JSON.stringify(esQuery));
			return await this.gotInstance.post(this.getSearchEndpoint(esIndex), {
				json: esQuery,
				resolveBodyOnly: true,
			});
		} catch (e) {
			this.logger.error(e?.response?.body);
			throw e;
		}
	}
}
