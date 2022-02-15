import { SearchFilters } from './dto/media.dto';

export interface Media {
	id: string;
	maintainerId: string;
	name: string;
	description: string;
}

export interface QueryBuilderConfig {
	AGGS_PROPERTIES: Array<keyof SearchFilters>;
	MAX_COUNT_SEARCH_RESULTS: number;
	MAX_NUMBER_SEARCH_RESULTS: number;
	NEEDS_FILTER_SUFFIX: { [prop in keyof SearchFilters]: boolean };
	NUMBER_OF_FILTER_OPTIONS: number;
	READABLE_TO_ELASTIC_FILTER_NAMES: { [prop in keyof SearchFilters]: string };
}
