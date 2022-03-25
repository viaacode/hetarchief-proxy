import { QueryType } from './elasticsearch/consts';

import { ContactInfo } from '~shared/types/types';

export enum MediaFormat {
	VIDEO = 'video',
	AUDIO = 'audio',
}

export interface QueryBuilderConfig {
	AGGS_PROPERTIES: Array<SearchFilterField>;
	MAX_COUNT_SEARCH_RESULTS: number;
	MAX_NUMBER_SEARCH_RESULTS: number;
	NEEDS_FILTER_SUFFIX: { [prop in SearchFilterField]?: boolean };
	NUMBER_OF_FILTER_OPTIONS: number;
	READABLE_TO_ELASTIC_FILTER_NAMES: { [prop in SearchFilterField]?: string };
	DEFAULT_QUERY_TYPE: { [prop in SearchFilterField]?: QueryType };
	OCCURRENCE_TYPE: { [prop in Operator]?: string };
	VALUE_OPERATORS: Array<Operator>;
	ORDER_MAPPINGS: { [prop in OrderProperty]: string };
	MULTI_MATCH_FIELDS: Array<SearchFilterField>;
	MULTI_MATCH_QUERY_MAPPING: { [prop in SearchFilterField]?: any };
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
	meemooIdentifier: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	id: string;
	files: File[];
}

export interface Media {
	meemooIdentifier: string; // Unique id per object
	schemaIdentifier: string; // PID (not unique per object)
	premisIdentifier: any;
	premisRelationship: string;
	isPartOf: string;
	partOfArchive: string;
	partOfEpisode: string;
	partOfSeason: string;
	partOfSeries: string;
	maintainerId: string;
	maintainerName: string;
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
	meemooMediaObjectId: string;
	dateCreated: string;
	dateCreatedLowerBound: string;
	ebucoreObjectType: string;
	representations: Representation[];
}

export enum SearchFilterField {
	QUERY = 'query',
	ADVANCED_QUERY = 'advancedQuery',
	FORMAT = 'format',
	DURATION = 'duration',
	CREATED = 'created',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	NAME = 'name',
	PUBLISHER = 'publisher',
	DESCRIPTION = 'description',
	ERA = 'era',
	LOCATION = 'location',
	LANGUAGE = 'language',
}

export enum Operator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	IS = 'is',
	IS_NOT = 'isNot',
	GTE = 'gte',
	LTE = 'lte',
}

export enum OrderProperty {
	RELEVANCE = 'relevance',
	CREATED = 'created',
	PUBLISHED = 'published',
	NAME = 'name',
}
