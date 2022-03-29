import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get, isEmpty } from 'lodash';

import { MediaQueryDto } from '../dto/media.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import { Media, Representation } from '../types';

import {
	GET_FILE_BY_REPRESENTATION_ID,
	GET_OBJECT_IE_BY_ID,
	GET_THUMBNAIL_URL_BY_ID,
} from './queries.gql';
import { TicketsService } from './tickets.service';

import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class MediaService {
	private logger: Logger = new Logger(MediaService.name, { timestamp: true });
	private gotInstance: Got;
	private mediaServiceUrl: string;

	constructor(
		private configService: ConfigService,
		protected dataService: DataService,
		protected ticketsService: TicketsService
	) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('elasticSearchUrl'),
			resolveBodyOnly: true,
			responseType: 'json',
		});

		this.mediaServiceUrl = this.configService.get('mediaServiceUrl');
	}

	public adapt(graphQlObject: any): Media {
		return {
			id: get(graphQlObject, 'schema_identifier'),
			meemooIdentifier: get(graphQlObject, 'meemoo_identifier'),
			premisIdentifier: get(graphQlObject, 'premis_identifier'),
			premisRelationship: get(graphQlObject, 'premis_relationship'),
			isPartOf: get(graphQlObject, 'schema_is_part_of'),
			partOfArchive: get(graphQlObject, 'schema_part_of_archive'),
			partOfEpisode: get(graphQlObject, 'schema_part_of_episode'),
			partOfSeason: get(graphQlObject, 'schema_part_of_season'),
			partOfSeries: get(graphQlObject, 'schema_part_of_series'),
			maintainerId: get(graphQlObject, 'schema_maintainer[0].id'),
			maintainerName: get(graphQlObject, 'schema_maintainer[0].label'),
			contactInfo: {
				email: get(graphQlObject, 'schema_maintainer[0].primary_site.address.email'),
				telephone: get(
					graphQlObject,
					'schema_maintainer[0].primary_site.address.telephone'
				),
				address: {
					street: get(graphQlObject, 'schema_maintainer[0].primary_site.address.street'),
					postalCode: get(
						graphQlObject,
						'schema_maintainer[0].primary_site.address.postal_code'
					),
					locality: get(
						graphQlObject,
						'schema_maintainer[0].primary_site.address.locality'
					),
					postOfficeBoxNumber: get(
						graphQlObject,
						'schema_maintainer[0].primary_site.address.post_office_box_number'
					),
				},
			},
			copyrightHolder: get(graphQlObject, 'schema_copyright_holder'),
			copyrightNotice: get(graphQlObject, 'schema_copyright_notice'),
			durationInSeconds: get(graphQlObject, 'schema_duration_in_seconds'),
			numberOfPages: get(graphQlObject, 'schema_number_of_pages'),
			datePublished: get(graphQlObject, 'schema_date_published'),
			dctermsAvailable: get(graphQlObject, 'dcterms_available'),
			name: get(graphQlObject, 'schema_name'),
			description: get(graphQlObject, 'schema_description'),
			abstract: get(graphQlObject, 'schema_abstract'),
			creator: get(graphQlObject, 'schema_creator'),
			actor: get(graphQlObject, 'schema_actor'),
			contributor: get(graphQlObject, 'schema_contributor'),
			publisher: get(graphQlObject, 'schema_publisher'),
			spatial: get(graphQlObject, 'schema_spatial'),
			temporal: get(graphQlObject, 'schema_temporal'),
			keywords: get(graphQlObject, 'schema_keywords'),
			dctermsFormat: get(graphQlObject, 'dcterms_format'),
			inLanguage: get(graphQlObject, 'schema_in_language'),
			thumbnailUrl: get(graphQlObject, 'schema_thumbnail_url'),
			embedUrl: get(graphQlObject, 'schema_embed_url'),
			alternateName: get(graphQlObject, 'schema_alternate_name'),
			duration: get(graphQlObject, 'schema_duration'),
			license: get(graphQlObject, 'schema_license'),
			meemooMediaObjectId: get(graphQlObject, 'meemoo_media_object_id'),
			dateCreated: get(graphQlObject, 'schema_date_created'),
			dateCreatedLowerBound: get(graphQlObject, 'schema_date_created_lower_bound'),
			genre: get(graphQlObject, 'schema_genre'),
			ebucoreObjectType: get(graphQlObject, 'ebucore_object_type'),
			representations: this.adaptRepresentations(graphQlObject.premis_is_represented_by),
		};
	}

	public adaptRepresentations(graphQlRepresentations: any): Representation[] {
		if (isEmpty(graphQlRepresentations)) {
			return [];
		}
		return graphQlRepresentations.map((representation) => ({
			name: get(representation, 'schema_name'),
			alternateName: get(representation, 'schema_alternate_name'),
			description: get(representation, 'schema_description'),
			schemaIdentifier: get(representation, 'schema_identifier'),
			dctermsFormat: get(representation, 'dcterms_format'),
			transcript: get(representation, 'schema_transcript'),
			dateCreated: get(representation, 'schema_date_created'),
			id: get(representation, 'id'),
			files: this.adaptFiles(representation.premis_includes),
		}));
	}

	public adaptFiles(graphQlFiles: any): File[] {
		if (isEmpty(graphQlFiles)) {
			return [];
		}
		return graphQlFiles.map((file) => ({
			schemaIdentifier: get(file, 'schema_identifier'),
			name: get(file, 'schema_name'),
			alternateName: get(file, 'schema_alternate_name'),
			description: get(file, 'schema_description'),
			representationId: get(file, 'representation_id'),
			ebucoreMediaType: get(file, 'ebucore_media_type'),
			ebucoreIsMediaFragmentOf: get(file, 'ebucore_is_media_fragment_of'),
			embedUrl: get(file, 'schema_embed_url'),
		}));
	}

	public getSearchEndpoint(esIndex: string): string {
		if (!esIndex) {
			return '_search';
		}
		return `${esIndex}/_search`;
	}

	private async executeQuery(esIndex: string, esQuery: any) {
		try {
			return await this.gotInstance.post(this.getSearchEndpoint(esIndex), {
				json: esQuery,
				resolveBodyOnly: true,
			});
		} catch (e) {
			if (e.response.statusCode === 404) {
				this.logger.error(e.response.body);
				throw new NotFoundException();
			}
			this.logger.error(e.response.body);
			throw e;
		}
	}

	public async findAll(inputQuery: MediaQueryDto, esIndex: string = null): Promise<any> {
		const esQuery = QueryBuilder.build(inputQuery);
		this.logger.log(esQuery);
		const mediaResponse = await this.executeQuery(esIndex, esQuery);

		return mediaResponse;
	}

	/**
	 * Find by id returns all details as stored in DB
	 * (not all details are in ES)
	 */
	public async findById(id: string): Promise<Media> {
		const {
			data: { object_ie: objectIe },
		} = await this.dataService.execute(GET_OBJECT_IE_BY_ID, { id });

		if (!objectIe[0]) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return this.adapt(objectIe[0]);
	}

	public async getPlayableUrl(id: string, referer: string): Promise<string> {
		const embedUrl = await this.getEmbedUrl(id);
		const token = await this.ticketsService.getPlayerToken(embedUrl, referer);

		return `${this.mediaServiceUrl}/${embedUrl}?token=${token}`;
	}

	public async getThumbnailUrl(id: string, referer: string): Promise<string> {
		const thumbnailPath = await this.getThumbnailPath(id);
		const token = await this.ticketsService.getThumbnailToken(referer);

		return `${this.mediaServiceUrl}/${thumbnailPath}?token=${token}`;
	}

	public async getEmbedUrl(id: string): Promise<string> {
		const {
			data: { object_file: objectFile },
		} = await this.dataService.execute(GET_FILE_BY_REPRESENTATION_ID, { id });
		if (!objectFile[0]) {
			throw new NotFoundException(`Object file with representation_id '${id}' not found`);
		}

		return objectFile[0].schema_embed_url;
	}

	public async getThumbnailPath(id: string): Promise<string> {
		const {
			data: { object_ie: objectIe },
		} = await this.dataService.execute(GET_THUMBNAIL_URL_BY_ID, { id });
		if (!objectIe[0]) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return objectIe[0].schema_thumbnail_url;
	}
}
