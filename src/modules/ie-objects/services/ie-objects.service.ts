import { randomUUID } from 'crypto';

import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pagination } from '@studiohyperdrive/pagination';
import got, { Got } from 'got';
import { compact, find, get, intersection, set, unset } from 'lodash';

import { Configuration } from '~config';

import { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import {
	ElasticsearchObject,
	ElasticsearchResponse,
	IeObject,
	IeObjectsWithAggregations,
	License,
	MediaFormat,
} from '../ie-objects.types';

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
			maintainerId: esObject?.schema_maintainer[0]?.schema_identifier,
			maintainerName: esObject?.schema_maintainer[0]?.schema_name,
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
			license: esObject?.schema_license,
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

	public getSearchEndpoint(esIndex: string | null): string {
		if (!esIndex) {
			return '_search';
		}
		return `${esIndex}/_search`;
	}

	public async executeQuery(esIndex: string, esQuery: any): Promise<any> {
		try {
			return await this.gotInstance.post(this.getSearchEndpoint(esIndex), {
				json: esQuery,
				resolveBodyOnly: true,
			});
		} catch (e) {
			this.logger.error(e?.response?.body);
			throw e;
		}
	}

	public async findAll(
		inputQuery: IeObjectsQueryDto,
		esIndex: string | null,
		referer: string
	): Promise<IeObjectsWithAggregations> {
		const esQuery = QueryBuilder.build(inputQuery);

		// Check licenses of objects
		if (!this.configService.get('IGNORE_OBJECT_LICENSES')) {
			unset(esQuery, 'query.match_all');
			set(esQuery, 'query.bool.should', [
				{
					term: {
						schema_license: License.BEZOEKERTOOL_CONTENT,
					},
				},
				{
					term: {
						schema_license: License.BEZOEKERTOOL_METADATA_ALL,
					},
				},
			]);
			set(esQuery, 'query.bool.minimum_should_match', 1);
		}

		const id = randomUUID();
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
				page: 0,
				size: adaptedESResponse.hits.total.value,
				total: adaptedESResponse.hits.total.value,
			}),
			aggregations: adaptedESResponse.aggregations,
		};
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
		const licenses = objectMedia.license;
		const schemaIdentifier = objectMedia.schemaIdentifier;
		const maintainerId = objectMedia.maintainerId;

		if (
			!licenses ||
			intersection(licenses, [
				License.BEZOEKERTOOL_CONTENT,
				License.BEZOEKERTOOL_METADATA_ALL,
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

		if (!licenses.includes(License.BEZOEKERTOOL_CONTENT)) {
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
		userHasAccessToSpace: boolean
	): IeObjectsWithAggregations {
		result.items = compact(
			result.items.map((objectMedia: IeObject) => {
				objectMedia = this.applyLicensesToObject(
					objectMedia,
					userHasAccessToSpace
				) as IeObject;

				return objectMedia;
			})
		);
		return result;
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

	public checkAndFixFormatFilter(queryDto: IeObjectsQueryDto): IeObjectsQueryDto {
		const formatFilter = find(queryDto.filters, { field: 'format' }) as SearchFilter;
		if (formatFilter && formatFilter.value === MediaFormat.VIDEO) {
			// change to multivalue with video and film
			formatFilter.multiValue = ['video', 'film'];
			delete formatFilter.value;
		} else if (
			// multiValue case
			formatFilter &&
			formatFilter.multiValue &&
			formatFilter.multiValue.includes(MediaFormat.VIDEO)
		) {
			formatFilter.multiValue.push('film');
		}
		return queryDto;
	}
}
