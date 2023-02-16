import _ from 'lodash';

import identifierSearchQueryFuzzy from './templates/exact/identifier-search-query.json';
import nameSearchQueryExact from './templates/exact/name-search-query.json';
import descriptionSearchQueryFuzzy from './templates/fuzzy/description-search-query.json';
import nameSearchQueryFuzzy from './templates/fuzzy/name-search-query.json';
import searchQueryAdvancedFuzzy from './templates/fuzzy/search-query-advanced.json';
import searchQueryFuzzy from './templates/fuzzy/search-query.json';

const searchQueryAdvancedTemplateFuzzy = _.values(searchQueryAdvancedFuzzy);
const searchQueryTemplateFuzzy = _.values(searchQueryFuzzy);
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
	PUBLISHER = 'publisher',
	DESCRIPTION = 'description',
	ERA = 'era',
	LOCATION = 'location',
	MAINTAINER = 'maintainer',
	CAST = 'cast',
	OBJECT_TYPE = 'objectType',
	CAPTION = 'caption',
	TRANSCRIPT = 'transcript',
	SERVICE_PROVIDER = 'serviceProvider',
	CATEGORIE = 'categorie',
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
	publisher: QueryType.TERMS,
	era: QueryType.MATCH,
	location: QueryType.MATCH,
	name: QueryType.TERM, // used for exact (not) matching
	description: QueryType.TERM, // used for exact (not) matching
	maintainer: QueryType.TERMS,
	cast: QueryType.TERMS,
	objectType: QueryType.TERMS,
	caption: QueryType.TERM,
	transcript: QueryType.TERM,
	serviceProvider: QueryType.TERM,
	categorie: QueryType.TERMS,
};

// Max number of search results to return to the client
export const MAX_NUMBER_SEARCH_RESULTS = 2000;
// Max count to return to the client to avoid error:
// -  Result window is too large, from + size must be less than or equal to: [10000] but was [17110].
// -  See the scroll api for a more efficient way to request large data sets.
// -  This limit can be set by changing the [index.max_result_window] index level setting. // TODO Still relevant?
export const MAX_COUNT_SEARCH_RESULTS = 10000;
export const NUMBER_OF_FILTER_OPTIONS = 40;

export const READABLE_TO_ELASTIC_FILTER_NAMES: { [prop in SearchFilterField]: string } = {
	query: 'query',
	advancedQuery: 'query',
	genre: 'schema_genre',
	keyword: 'schema_keywords',
	name: 'schema_name',
	publisher: 'schema_publisher',
	description: 'schema_description',
	era: 'schema_temporal_coverage',
	location: 'schema_spatial_coverage',
	maintainer: 'schema_maintainer.schema_identifier',
	cast: 'meemoo_description_cast',
	objectType: 'ebucore_object_type',
	caption: 'schema_caption',
	transcript: 'schema_transcript',
	serviceProvider: 'meemoo_service_provier',
	categorie: 'meemoo_description_categorie',
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
export const AGGS_PROPERTIES: Array<SearchFilterField> = [SearchFilterField.NAME];

export const NEEDS_FILTER_SUFFIX: { [prop in SearchFilterField]?: string } = {
	genre: 'keyword',
	name: 'keyword',
};

export const NEEDS_AGG_SUFFIX: { [prop in SearchFilterField]?: string } = {
	genre: 'keyword',
};
