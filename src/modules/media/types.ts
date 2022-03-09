import { AdvancedQuery, SearchFilters } from './dto/media.dto';
import { QueryType } from './elasticsearch/consts';

import { ContactInfo } from '~shared/types/types';

export enum MediaFormat {
	VIDEO = 'video',
	AUDIO = 'audio',
}

export interface QueryBuilderConfig {
	AGGS_PROPERTIES: Array<keyof SearchFilters>;
	MAX_COUNT_SEARCH_RESULTS: number;
	MAX_NUMBER_SEARCH_RESULTS: number;
	NEEDS_FILTER_SUFFIX: { [prop in keyof SearchFilters]: boolean };
	NUMBER_OF_FILTER_OPTIONS: number;
	READABLE_TO_ELASTIC_FILTER_NAMES: { [prop in keyof SearchFilters]: string };
	DEFAULT_QUERY_TYPE: { [prop in keyof SearchFilters]: QueryType };
	OCCURRENCE_TYPE: { [prop in keyof AdvancedQuery]: string };
}

export interface PlayerTicket {
	jwt: string;
	context: {
		aud: string;
		exp: number;
		sub: string;
		ip: string;
		referer: string;
		fragment: {
			start: string;
			end: string;
		};
	};
}

/**
 * premis_is_represented_by {
      schema_name
      schema_alternate_name
      schema_description
      ie_meemoo_fragment_id
      dcterms_format
      schema_transcript
      schema_date_created
      id
      premis_includes {
        id
        schema_name
        schema_alternate_name
        schema_description
        representation_id
        ebucore_media_type
        ebucore_is_media_fragment_of
        schema_embed_url
      }
 */
export interface File {
	id: string;
	name: string;
	alternateName: string;
	description: string;
	representationId: string;
	ebucoreMediaType: string;
	ebucoreIsMediaFragmentOf: string;
	embedUrl: string;
}

export interface Representation {
	name: string;
	alternateName: string;
	description: string;
	meemooFragmentId: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	id: string;
	files: File[];
}

export interface Media {
	id: string;
	premisIdentifier: any;
	premisRelationship: string;
	isPartOf: string;
	partOfArchive: string;
	partOfEpisode: string;
	partOfSeason: string;
	partOfSeries: string;
	maintainerId: string;
	contactInfo: ContactInfo;
	copyrightHolder: string;
	copyrightNotice: string;
	durationInSeconds: number;
	numberOfPages: number;
	datePublished: string;
	dctermsAvailable: string;
	name: string;
	description: string;
	abstract: string;
	creator: any;
	actor: any;
	contributor: any;
	publisher: any;
	spatial: string;
	temporal: string;
	keywords: string;
	genre: string;
	dctermsFormat: string;
	inLanguage: string;
	thumbnailUrl: string;
	embedUrl: string;
	alternateName: string;
	duration: string;
	license: any;
	meemooFragmentId: string;
	meemooMediaObjectId: string;
	dateCreated: string;
	dateCreatedLowerBound: string;
	ebucoreObjectType: string;
	representations: Representation[];
}
