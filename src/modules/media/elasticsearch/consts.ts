import { SearchFilters } from '../dto/media.dto';

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
};

export enum QueryType {
	TERM = 'term',
	RANGE = 'range',
}

export const DEFAULT_QUERY_TYPE: { [prop in keyof SearchFilters]: QueryType } = {
	format: QueryType.TERM,
	duration: QueryType.RANGE,
	created: QueryType.RANGE,
	published: QueryType.RANGE,
	creator: QueryType.TERM,
	genre: QueryType.TERM,
	keyword: QueryType.TERM,
};

// By default add the 'format' aggregation
export const AGGS_PROPERTIES: Array<keyof SearchFilters> = ['format'];

export const NEEDS_FILTER_SUFFIX: { [prop in keyof SearchFilters]: boolean } = {
	query: false,
	format: false,
};
