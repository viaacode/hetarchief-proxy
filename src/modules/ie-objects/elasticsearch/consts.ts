import _ from 'lodash';

import { Operator, OrderProperty, SearchFilterField } from '../ie-objects.types';

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
	format: 'dcterms_format',
	duration: 'schema_duration',
	created: 'schema_date_created',
	published: 'schema_date_published',
	creator: 'schema_creator',
	genre: 'schema_genre',
	keyword: 'schema_keywords',
	name: 'schema_name',
	publisher: 'schema_publisher',
	description: 'schema_description',
	era: 'schema_temporal_coverage',
	location: 'schema_spatial_coverage',
	language: 'schema_in_language',
	medium: 'dcterms_medium',
	maintainer: 'schema_maintainer.schema_identifier',
};

export const ORDER_MAPPINGS: { [prop in OrderProperty]: string } = {
	relevance: '_score',
	created: 'schema_date_created',
	published: 'schema_date_published',
	name: 'schema_name.keyword',
};

export enum QueryType {
	TERM = 'term', // Search for a single term exactly
	TERMS = 'terms', // Must match at least one term exactly
	RANGE = 'range', // Date range or duration range
	MATCH = 'match', // Text based fuzzy search
}

export const MULTI_MATCH_FIELDS: Array<SearchFilterField> = [
	SearchFilterField.QUERY,
	SearchFilterField.ADVANCED_QUERY,
	SearchFilterField.NAME,
	SearchFilterField.DESCRIPTION,
];

export const MULTI_MATCH_QUERY_MAPPING = {
	fuzzy: {
		query: searchQueryTemplateFuzzy,
		advancedQuery: searchQueryAdvancedTemplateFuzzy,
		name: nameSearchQueryTemplateFuzzy,
		description: descriptionSearchQueryTemplateFuzzy,
	},
	exact: {
		name: nameSearchQueryTemplateExact,
	},
};

export const DEFAULT_QUERY_TYPE: { [prop in SearchFilterField]?: QueryType } = {
	format: QueryType.TERMS, // es keyword
	duration: QueryType.RANGE,
	created: QueryType.RANGE,
	published: QueryType.RANGE,
	creator: QueryType.TERMS, // es flattened
	genre: QueryType.TERMS, // text // TODO es text -> can be match query: no longer case sensitive but issue with multiValue
	keyword: QueryType.TERMS, // text // TODO es text -> can be match query: no longer case sensitive but issue with multiValue
	publisher: QueryType.TERMS,
	era: QueryType.MATCH,
	location: QueryType.MATCH,
	language: QueryType.TERMS,
	medium: QueryType.TERMS,
	name: QueryType.TERM, // used for exact (not) matching
	description: QueryType.TERM, // used for exact (not) matching
	maintainer: QueryType.TERM,
};

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
