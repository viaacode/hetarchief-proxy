import { AdvancedQuery, SearchFilters } from '../dto/media.dto';

// Max number of search results to return to the client
export const MAX_NUMBER_SEARCH_RESULTS = 2000;
// Max count to return to the client to avoid error:
// -  Result window is too large, from + size must be less than or equal to: [10000] but was [17110].
// -  See the scroll api for a more efficient way to request large data sets.
// -  This limit can be set by changing the [index.max_result_window] index level setting. // TODO Still relevant?
export const MAX_COUNT_SEARCH_RESULTS = 10000;
export const NUMBER_OF_FILTER_OPTIONS = 40;

export const READABLE_TO_ELASTIC_FILTER_NAMES: { [prop in keyof SearchFilters]: string } = {
	query: 'query',
	format: 'dcterms_format',
	duration: 'schema_duration',
	created: 'schema_date_created',
	published: 'schema_date_published',
	creator: 'schema_creator',
	genre: 'schema_genre',
	keyword: 'schema_keywords',
	name: 'schema_name',
};

export enum QueryType {
	TERM = 'term',
	RANGE = 'range',
	MATCH = 'match',
}

export const DEFAULT_QUERY_TYPE: { [prop in keyof SearchFilters]: QueryType } = {
	format: QueryType.TERM, // es keyword
	duration: QueryType.RANGE,
	created: QueryType.RANGE,
	published: QueryType.RANGE,
	creator: QueryType.TERM, // es flattened
	genre: QueryType.TERM, // TODO es text -> ook match query? error onder filter
	keyword: QueryType.TERM, // TODO es text -> ook match query? error onder filter
	name: QueryType.MATCH, // es text
};

export const OCCURRENCE_TYPE: { [prop in keyof AdvancedQuery]: string } = {
	contains: 'must',
	containsNot: 'must_not',
	is: 'must',
	isNot: 'must_not',
};

// By default add the 'format' aggregation
export const AGGS_PROPERTIES: Array<keyof SearchFilters> = ['format'];

export const NEEDS_FILTER_SUFFIX: { [prop in keyof SearchFilters]: boolean } = {
	query: false,
	format: false,
	genre: true,
};
