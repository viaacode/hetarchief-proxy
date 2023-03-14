import _ from 'lodash';

import { IeObjectSector, IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import searchQueryExact from './templates/exact/exact-search-query.json';
import identifierSearchQueryFuzzy from './templates/exact/identifier-search-query.json';
import nameSearchQueryExact from './templates/exact/name-search-query.json';
import descriptionSearchQueryFuzzy from './templates/fuzzy/description-search-query.json';
import nameSearchQueryFuzzy from './templates/fuzzy/name-search-query.json';
import searchQueryAdvancedFuzzy from './templates/fuzzy/search-query-advanced.json';
import searchQueryFuzzy from './templates/fuzzy/search-query.json';

const searchQueryAdvancedTemplateFuzzy = _.values(searchQueryAdvancedFuzzy);
const searchQueryTemplateFuzzy = _.values(searchQueryFuzzy);
const searchQueryTemplateExact = _.values(searchQueryExact);
const nameSearchQueryTemplateFuzzy = _.values(nameSearchQueryFuzzy);
const descriptionSearchQueryTemplateFuzzy = _.values(descriptionSearchQueryFuzzy);

const nameSearchQueryTemplateExact = _.values(nameSearchQueryExact);
const identifierSearchQueryTemplateExact = _.values(identifierSearchQueryFuzzy);

export enum SearchFilterField {
	QUERY = 'query',
	ADVANCED_QUERY = 'advancedQuery',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	NAME = 'name',
	FORMAT = 'format',
	CREATED = 'created',
	PUBLISHED = 'published',
	PUBLISHER = 'publisher',
	CREATOR = 'creator',
	DESCRIPTION = 'description',
	ERA = 'era',
	LOCATION = 'location',
	MAINTAINER = 'maintainer',
	CAST = 'cast',
	CAPTION = 'caption',
	TRANSCRIPT = 'transcript',
	CATEGORIE = 'categorie',
	DURATION = 'duration',
	LANGUAGE = 'language',
	MEDIUM = 'medium',
	CONSULTABLE_REMOTE = 'isConsultableRemote',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
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

export enum QueryType {
	TERM = 'term', // Search for a single term exactly
	TERMS = 'terms', // Must match at least one term exactly
	RANGE = 'range', // Date range or duration range
	MATCH = 'match', // Text based fuzzy search
}

export interface QueryBuilderUserInfo {
	groupId: string;
	isKeyUser: boolean;
	maintainerId: string;
	sector: IeObjectSector;
}

export interface QueryBuilderInputInfo {
	user: QueryBuilderUserInfo;
	visitorSpaceInfo?: IeObjectsVisitorSpaceInfo;
	isConsultableRemote?: boolean;
	isConsultableMedia?: boolean;
}

export const MULTI_MATCH_QUERY_MAPPING = {
	fuzzy: {
		query: searchQueryTemplateFuzzy,
		advancedQuery: searchQueryAdvancedTemplateFuzzy,
		name: nameSearchQueryTemplateFuzzy,
		description: descriptionSearchQueryTemplateFuzzy,
	},
	exact: {
		name: nameSearchQueryTemplateExact,
		identifier: identifierSearchQueryTemplateExact,
		exactQuery: searchQueryTemplateExact,
	},
};

export interface QueryBuilderConfig {
	AGGS_PROPERTIES: Array<SearchFilterField>;
	MAX_COUNT_SEARCH_RESULTS: number;
	MAX_NUMBER_SEARCH_RESULTS: number;
	NEEDS_FILTER_SUFFIX: { [prop in SearchFilterField]?: string };
	NUMBER_OF_FILTER_OPTIONS: number;
	READABLE_TO_ELASTIC_FILTER_NAMES: { [prop in SearchFilterField]?: string };
	DEFAULT_QUERY_TYPE: { [prop in SearchFilterField]?: QueryType };
	OCCURRENCE_TYPE: { [prop in Operator]?: string };
	VALUE_OPERATORS: Array<Operator>;
	ORDER_MAPPINGS: { [prop in OrderProperty]: string };
	MULTI_MATCH_FIELDS: Array<SearchFilterField>;
	MULTI_MATCH_QUERY_MAPPING: typeof MULTI_MATCH_QUERY_MAPPING;
	NEEDS_AGG_SUFFIX: { [prop in SearchFilterField]?: string };
}

export const DEFAULT_QUERY_TYPE: { [prop in SearchFilterField]?: QueryType } = {
	genre: QueryType.TERMS, // text // TODO es text -> can be match query: no longer case sensitive but issue with multiValue
	keyword: QueryType.TERMS, // text // TODO es text -> can be match query: no longer case sensitive but issue with multiValue
	name: QueryType.TERM, // used for exact (not) matching
	format: QueryType.TERMS, // es keyword
	publisher: QueryType.TERMS,
	creator: QueryType.TERMS,
	created: QueryType.RANGE,
	published: QueryType.RANGE,
	description: QueryType.TERM, // used for exact (not) matching
	era: QueryType.MATCH,
	location: QueryType.MATCH,
	maintainer: QueryType.TERMS,
	cast: QueryType.TERMS,
	caption: QueryType.TERM,
	transcript: QueryType.TERM,
	categorie: QueryType.TERMS,
	duration: QueryType.RANGE,
	language: QueryType.TERMS,
	medium: QueryType.TERMS,
};

// Max number of search results to return to the client
export const MAX_NUMBER_SEARCH_RESULTS = 2000;
// Max count to return to the client to avoid error:
// -  Result window is too large, from + size must be less than or equal to: [10000] but was [17110].
// -  See the scroll api for a more efficient way to request large data sets.
// -  This limit can be set by changing the [index.max_result_window] index level setting. // TODO Still relevant?
export const MAX_COUNT_SEARCH_RESULTS = 10000;
export const NUMBER_OF_FILTER_OPTIONS = 40;

export const READABLE_TO_ELASTIC_FILTER_NAMES: {
	[prop in Exclude<SearchFilterField, 'isConsultableRemote' | 'isConsultableMedia'>]: string;
} = {
	[SearchFilterField.QUERY]: 'query',
	[SearchFilterField.ADVANCED_QUERY]: 'query',
	[SearchFilterField.GENRE]: 'schema_genre',
	[SearchFilterField.KEYWORD]: 'schema_keywords',
	[SearchFilterField.NAME]: 'schema_name',
	[SearchFilterField.FORMAT]: 'dcterms_format',
	[SearchFilterField.PUBLISHER]: 'schema_publisher',
	[SearchFilterField.CREATOR]: 'schema_creator',
	[SearchFilterField.CREATED]: 'schema_date_created',
	[SearchFilterField.PUBLISHED]: 'schema_date_published',
	[SearchFilterField.DESCRIPTION]: 'schema_description',
	[SearchFilterField.ERA]: 'schema_temporal_coverage',
	[SearchFilterField.LOCATION]: 'schema_spatial_coverage',
	[SearchFilterField.MAINTAINER]: 'schema_maintainer.schema_identifier',
	[SearchFilterField.CAST]: 'meemoo_description_cast',
	[SearchFilterField.CAPTION]: 'schema_caption',
	[SearchFilterField.TRANSCRIPT]: 'schema_transcript',
	[SearchFilterField.CATEGORIE]: 'meemoo_description_categorie',
	[SearchFilterField.DURATION]: 'schema_duration',
	[SearchFilterField.LANGUAGE]: 'schema_in_language',
	[SearchFilterField.MEDIUM]: 'dcterms_medium',
};

export const ORDER_MAPPINGS: { [prop in OrderProperty]: string } = {
	relevance: '_score',
	created: 'schema_date_created',
	published: 'schema_date_published',
	name: 'schema_name.keyword',
};

export const MULTI_MATCH_FIELDS: Array<SearchFilterField> = [
	SearchFilterField.QUERY,
	SearchFilterField.ADVANCED_QUERY,
	SearchFilterField.NAME,
	SearchFilterField.DESCRIPTION,
];

export const OCCURRENCE_TYPE: { [prop in Operator]?: string } = {
	contains: 'must',
	containsNot: 'must_not',
	is: 'must',
	isNot: 'must_not',
};

export const VALUE_OPERATORS: Operator[] = [Operator.GTE, Operator.LTE];

// By default add the 'format' aggregation
export const AGGS_PROPERTIES: Array<SearchFilterField> = [SearchFilterField.FORMAT];

export const NEEDS_FILTER_SUFFIX: { [prop in SearchFilterField]?: string } = {
	genre: 'keyword',
	name: 'keyword',
};

export const NEEDS_AGG_SUFFIX: { [prop in SearchFilterField]?: string } = {
	genre: 'keyword',
};
