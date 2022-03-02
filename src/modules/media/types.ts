import { SearchFilters } from './dto/media.dto';
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
}
