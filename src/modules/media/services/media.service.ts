import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import got, { Got } from 'got';
import { find, get, isEmpty, set, unset } from 'lodash';
import convert from 'xml-js';

import { getConfig } from '~config';

import { MediaQueryDto } from '../dto/media.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import {
	ElasticsearchMedia,
	ElasticsearchResponse,
	GqlIeObject,
	GqlLimitedIeObject,
	License,
	Media,
	MediaFile,
	Representation,
} from '../media.types';

import {
	FindAllObjectsByCollectionIdDocument,
	FindAllObjectsByCollectionIdQuery,
	GetObjectDetailBySchemaIdentifierDocument,
	GetObjectDetailBySchemaIdentifierQuery,
	GetRelatedObjectsDocument,
	GetRelatedObjectsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class MediaService {
	private logger: Logger = new Logger(MediaService.name, { timestamp: true });
	private gotInstance: Got;

	constructor(
		private configService: ConfigService,
		protected dataService: DataService,
		protected playerTicketService: PlayerTicketService
	) {
		this.gotInstance = got.extend({
			prefixUrl: getConfig(this.configService, 'elasticSearchUrl'),
			resolveBodyOnly: true,
			responseType: 'json',
		});
	}

	public adapt(graphQlObject: GqlIeObject): Media {
		/* istanbul ignore next */
		return {
			schemaIdentifier: graphQlObject?.schema_identifier,
			meemooIdentifier: graphQlObject?.meemoo_identifier,
			premisIdentifier: graphQlObject?.premis_identifier,
			premisRelationship: graphQlObject?.premis_relationship,
			isPartOf: graphQlObject?.schema_is_part_of,
			maintainerId: graphQlObject?.maintainer?.schema_identifier,
			maintainerName: graphQlObject?.maintainer?.schema_name,
			contactInfo: {
				email: graphQlObject?.maintainer?.information?.primary_site.address?.email,
				telephone: graphQlObject?.maintainer?.information?.primary_site?.address?.telephone,
				address: {
					street: graphQlObject?.maintainer?.information?.primary_site?.address?.street,
					postalCode:
						graphQlObject?.maintainer?.information?.primary_site?.address?.postal_code,
					locality:
						graphQlObject?.maintainer?.information?.primary_site?.address?.locality,
					postOfficeBoxNumber:
						graphQlObject?.maintainer?.information?.primary_site?.address
							?.post_office_box_number,
				},
			},
			copyrightHolder: graphQlObject?.schema_copyright_holder,
			copyrightNotice: graphQlObject?.schema_copyright_notice,
			durationInSeconds: graphQlObject?.schema_duration_in_seconds,
			numberOfPages: graphQlObject?.schema_number_of_pages,
			datePublished: graphQlObject?.schema_date_published,
			dctermsAvailable: graphQlObject?.dcterms_available,
			name: graphQlObject?.schema_name,
			description: graphQlObject?.schema_description,
			abstract: graphQlObject?.schema_abstract,
			creator: graphQlObject?.schema_creator,
			actor: graphQlObject?.schema_actor,
			contributor: graphQlObject?.schema_contributor,
			publisher: graphQlObject?.schema_publisher,
			// spatial: graphQlObject?.schema_spatial,
			// temporal: graphQlObject?.schema_temporal,
			keywords: graphQlObject?.schema_keywords,
			dctermsFormat: graphQlObject?.dcterms_format,
			dctermsMedium: graphQlObject?.dcterms_medium,
			inLanguage: graphQlObject?.schema_in_language,
			thumbnailUrl: graphQlObject?.schema_thumbnail_url,
			// embedUrl: graphQlObject?.schema_embed_url,
			alternateName: graphQlObject?.schema_alternate_name,
			duration: graphQlObject?.schema_duration,
			license: graphQlObject?.schema_license,
			meemooMediaObjectId: graphQlObject?.meemoo_media_object_id,
			dateCreated: graphQlObject?.schema_date_created,
			dateCreatedLowerBound: graphQlObject?.schema_date_created_lower_bound,
			genre: graphQlObject?.schema_genre,
			ebucoreObjectType: graphQlObject?.ebucore_object_type,
			representations: this?.adaptRepresentations(graphQlObject?.premis_is_represented_by),
		};
	}

	public adaptRepresentations(graphQlRepresentations: any): Representation[] {
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

	public adaptFiles(graphQlFiles: any): MediaFile[] {
		if (isEmpty(graphQlFiles)) {
			return [];
		}

		/* istanbul ignore next */
		return graphQlFiles.map(
			(file): MediaFile => ({
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

	public adaptMetadata(object: Media): Partial<Media> {
		// unset thumbnail and representations
		delete object.representations;
		delete object.thumbnailUrl;
		return object;
	}

	public adaptLimitedMetadata(graphQlObject: GqlLimitedIeObject): Partial<Media> {
		/* istanbul ignore next */
		return {
			schemaIdentifier: graphQlObject.ie?.schema_identifier,
			premisIdentifier: graphQlObject.ie?.premis_identifier,
			maintainerName: graphQlObject.ie?.maintainer?.schema_name,
			name: graphQlObject.ie?.schema_name,
			alternateName: graphQlObject.ie?.schema_alternate_name,
			dctermsFormat: graphQlObject.ie?.dcterms_format,
			dateCreatedLowerBound: graphQlObject.ie?.schema_date_created_lower_bound,
			datePublished: graphQlObject.ie?.schema_date_published,
		};
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
			this.logger.error(e.response.body);
			throw e;
		}
	}

	public async findAll(
		inputQuery: MediaQueryDto,
		esIndex: string | null,
		referer: string
	): Promise<ElasticsearchResponse> {
		const esQuery = QueryBuilder.build(inputQuery);

		// Check licenses of objects
		if (!getConfig(this.configService, 'ignoreObjectLicenses')) {
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

		const mediaResponse = await this.executeQuery(esIndex, esQuery);

		return this.adaptESResponse(mediaResponse, referer);
	}

	/**
	 * Find by id returns all details as stored in DB
	 * (not all details are in ES)
	 */
	public async findBySchemaIdentifier(schemaIdentifier: string, referer: string): Promise<Media> {
		const {
			data: { object_ie: objectIe },
		} = await this.dataService.execute<GetObjectDetailBySchemaIdentifierQuery>(
			GetObjectDetailBySchemaIdentifierDocument,
			{
				schemaIdentifier,
			}
		);

		if (!objectIe[0]) {
			throw new NotFoundException(`Object IE with id '${schemaIdentifier}' not found`);
		}

		const adapted = this.adapt(objectIe[0]);
		adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
			adapted.thumbnailUrl,
			referer
		);
		return adapted;
	}

	/**
	 * Get the object detail fields that are exposed as metadata
	 */
	public async findMetadataBySchemaIdentifier(schemaIdentifier: string): Promise<Partial<Media>> {
		const object = await this.findBySchemaIdentifier(schemaIdentifier, null);
		return this.adaptMetadata(object);
	}

	public convertObjectsToXml(objects: Partial<Media>[]): string {
		// this structure defines the parent 'objects' tag, which includes
		// all objects wrapped in a separate 'object' tag
		return convert.js2xml({ objects: { object: objects } }, { compact: true, spaces: 2 });
	}

	public convertObjectToXml(object: Partial<Media>): string {
		return convert.js2xml({ object }, { compact: true, spaces: 2 });
	}

	/**
	 * Returns a limited set of metadata fields for export
	 */
	public async findAllObjectMetadataByCollectionId(
		collectionId: string,
		userProfileId: string
	): Promise<Partial<Media>[]> {
		const {
			data: { users_folder_ie: allObjects },
		} = await this.dataService.execute<FindAllObjectsByCollectionIdQuery>(
			FindAllObjectsByCollectionIdDocument,
			{
				collectionId,
				userProfileId,
			}
		);
		if (!allObjects[0]) {
			throw new NotFoundException();
		}
		const allAdapted = allObjects.map((object) => {
			return this.adaptLimitedMetadata(object);
		});

		return allAdapted;
	}

	public getLimitedMetadata(mediaObject: Media): Partial<Media> {
		return {
			schemaIdentifier: mediaObject.schemaIdentifier,
			premisIdentifier: mediaObject.premisIdentifier,
			maintainerName: mediaObject.maintainerName,
			name: mediaObject.name,
			alternateName: mediaObject.alternateName,
			dctermsFormat: mediaObject.dctermsFormat,
			dateCreatedLowerBound: mediaObject.dateCreatedLowerBound,
			datePublished: mediaObject.datePublished,
		};
	}

	public getLimitedMetadataElastic(mediaObject: ElasticsearchMedia): Partial<ElasticsearchMedia> {
		return {
			schema_identifier: mediaObject.schema_identifier,
			premis_identifier: mediaObject.premis_identifier,
			schema_name: mediaObject.schema_name,
			schema_alternate_name: mediaObject.schema_alternate_name,
			dcterms_format: mediaObject.dcterms_format,
			schema_date_created: mediaObject.schema_date_created,
			schema_date_published: mediaObject.schema_date_published,
		};
	}

	public async getRelated(
		maintainerId: string,
		schemaIdentifier: string,
		meemooIdentifier: string,
		referer: string
	): Promise<IPagination<Media>> {
		const mediaObjects = await this.dataService.execute<GetRelatedObjectsQuery>(
			GetRelatedObjectsDocument,
			{
				maintainerId,
				schemaIdentifier,
				meemooIdentifier,
			}
		);

		const adaptedItems = await Promise.all(
			mediaObjects.data.object_ie.map(async (object: any) => {
				const adapted = this.adapt(object);
				adapted.thumbnailUrl = await this.playerTicketService.resolveThumbnailUrl(
					adapted.thumbnailUrl,
					referer
				);
				return adapted;
			})
		);

		return Pagination<Media>({
			items: adaptedItems,
			page: 1,
			size: mediaObjects.data.object_ie.length,
			total: mediaObjects.data.object_ie.length,
		});
	}

	public async getSimilar(
		schemaIdentifier: string,
		esIndex: string,
		referer: string,
		limit = 4
	): Promise<any> {
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
		return this.adaptESResponse(mediaResponse, referer);
	}
}
