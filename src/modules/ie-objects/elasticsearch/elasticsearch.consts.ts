import _ from 'lodash';

import { IeObjectSector, IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import identifierSearchQueryExact from './templates/exact/identifier-search-query.json';
import nameSearchQueryExact from './templates/exact/name-search-query.json';
import searchQueryExact from './templates/exact/search-query.json';
import descriptionSearchQueryFuzzy from './templates/fuzzy/description-search-query.json';
import nameSearchQueryFuzzy from './templates/fuzzy/name-search-query.json';
import searchQueryAdvancedFuzzy from './templates/fuzzy/search-query-advanced.json';
import searchQueryFuzzy from './templates/fuzzy/search-query.json';

import { SessionUserEntity } from '~modules/users/classes/session-user';

const searchQueryAdvancedTemplateFuzzy = _.values(searchQueryAdvancedFuzzy);
const searchQueryTemplateFuzzy = _.values(searchQueryFuzzy);
const searchQueryTemplateExact = _.values(searchQueryExact);
const nameSearchQueryTemplateFuzzy = _.values(nameSearchQueryFuzzy);
const descriptionSearchQueryTemplateFuzzy = _.values(descriptionSearchQueryFuzzy);

const nameSearchQueryTemplateExact = _.values(nameSearchQueryExact);
const identifierSearchQueryTemplateExact = _.values(identifierSearchQueryExact);

export enum IeObjectsSearchFilterField {
	ADVANCED_QUERY = 'advancedQuery',
	CREATED = 'created',
	CREATOR = 'creator',
	DESCRIPTION = 'description',
	DURATION = 'duration',
	SPACIAL_COVERAGE = 'spacialCoverage',
	TEMPORAL_COVERAGE = 'temporalCoverage',
	FORMAT = 'format',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	LANGUAGE = 'language',
	MEDIUM = 'medium',
	NAME = 'name',
	PUBLISHED = 'published',
	PUBLISHER = 'publisher',
	QUERY = 'query',
	// TODO future: rename maintainer to maintainerId and maintainers to maintainerName and also change this in the client
	MAINTAINER_ID = 'maintainer', // Contains the OR-id of the maintainer
	CONSULTABLE_ONLY_ON_LOCATION = 'isConsultableOnlyOnLocation',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
	CAST = 'cast',
	IDENTIFIER = 'identifier',
	OBJECT_TYPE = 'objectType',
	LICENSES = 'license', // Used to filter objects that are in a visitor space
	CAPTION = 'caption', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
	TRANSCRIPT = 'transcript', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
	CATEGORIE = 'categorie', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
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
	ARCHIVED = 'archived',
	NAME = 'name',
}

export enum QueryType {
	TERM = 'term', // Search for a single term exactly
	TERMS = 'terms', // Must match at least one term exactly
	RANGE = 'range', // Date range or duration range
	MATCH = 'match', // Text based fuzzy search
	QUERY_STRING = 'query_string', // Text search met wildcards: {"query_string":{"query":"arbeids*","default_field":"schema_keywords"}}
}

export interface QueryBuilderInputInfo {
	user?: SessionUserEntity;
	visitorSpaceInfo?: IeObjectsVisitorSpaceInfo;
	spacesIds?: string[];
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
		query: searchQueryTemplateExact,
	},
};

export const DEFAULT_QUERY_TYPE: { [prop in IeObjectsSearchFilterField]: QueryType } = {
	[IeObjectsSearchFilterField.GENRE]: QueryType.TERMS,
	[IeObjectsSearchFilterField.KEYWORD]: QueryType.TERMS,
	[IeObjectsSearchFilterField.NAME]: QueryType.TERM,
	[IeObjectsSearchFilterField.FORMAT]: QueryType.TERMS,
	[IeObjectsSearchFilterField.OBJECT_TYPE]: QueryType.TERMS,
	[IeObjectsSearchFilterField.PUBLISHER]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CREATOR]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CREATED]: QueryType.RANGE,
	[IeObjectsSearchFilterField.PUBLISHED]: QueryType.RANGE,
	[IeObjectsSearchFilterField.DESCRIPTION]: QueryType.TERM,
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: QueryType.MATCH,
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: QueryType.MATCH,
	[IeObjectsSearchFilterField.MAINTAINER_ID]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CAST]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CAPTION]: QueryType.TERM,
	[IeObjectsSearchFilterField.TRANSCRIPT]: QueryType.TERM,
	[IeObjectsSearchFilterField.CATEGORIE]: QueryType.TERMS,
	[IeObjectsSearchFilterField.DURATION]: QueryType.RANGE,
	[IeObjectsSearchFilterField.LANGUAGE]: QueryType.TERMS,
	[IeObjectsSearchFilterField.MEDIUM]: QueryType.TERMS,
	[IeObjectsSearchFilterField.LICENSES]: QueryType.TERMS,

	// Should never be used since these are marked as multi match fields
	// But we include it to get stricter type checks on missing fields
	[IeObjectsSearchFilterField.ADVANCED_QUERY]: QueryType.TERMS,
	[IeObjectsSearchFilterField.IDENTIFIER]: QueryType.TERMS,
	[IeObjectsSearchFilterField.QUERY]: QueryType.TERMS,

	// Should never be used since these are handled separately using boolean filters
	// But we include it to get stricter type checks on missing fields
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: QueryType.TERMS,
};

// Max number of search results to return to the client
export const MAX_NUMBER_SEARCH_RESULTS = 2000;
// Max count to return to the client to avoid error:
// -  Result window is too large, from + size must be less than or equal to: [10000] but was [17110].
// -  See the scroll api for a more efficient way to request large data sets.
// -  This limit can be set by changing the [index.max_result_window] index level setting. // TODO Still relevant?
export const MAX_COUNT_SEARCH_RESULTS = 10000;

export const READABLE_TO_ELASTIC_FILTER_NAMES: {
	[prop in Exclude<
		IeObjectsSearchFilterField,
		| IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
		| IeObjectsSearchFilterField.CONSULTABLE_MEDIA
	>]: string;
} = {
	[IeObjectsSearchFilterField.QUERY]: 'query',
	[IeObjectsSearchFilterField.ADVANCED_QUERY]: 'query',
	[IeObjectsSearchFilterField.GENRE]: 'schema_genre',
	[IeObjectsSearchFilterField.KEYWORD]: 'schema_keywords',
	[IeObjectsSearchFilterField.NAME]: 'schema_name',
	[IeObjectsSearchFilterField.FORMAT]: 'dcterms_format',
	[IeObjectsSearchFilterField.PUBLISHER]: 'schema_publisher',
	[IeObjectsSearchFilterField.CREATOR]: 'schema_creator',
	[IeObjectsSearchFilterField.CREATED]: 'schema_date_created',
	[IeObjectsSearchFilterField.PUBLISHED]: 'schema_date_published',
	[IeObjectsSearchFilterField.DESCRIPTION]: 'schema_description',
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: 'schema_temporal_coverage',
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: 'schema_spatial_coverage',
	[IeObjectsSearchFilterField.MAINTAINER_ID]: 'schema_maintainer.schema_identifier',
	[IeObjectsSearchFilterField.CAST]: 'meemoo_description_cast',
	[IeObjectsSearchFilterField.CAPTION]: 'schema_caption',
	[IeObjectsSearchFilterField.TRANSCRIPT]: 'schema_transcript',
	[IeObjectsSearchFilterField.CATEGORIE]: 'meemoo_description_categorie',
	[IeObjectsSearchFilterField.DURATION]: 'schema_duration',
	[IeObjectsSearchFilterField.LANGUAGE]: 'schema_in_language',
	[IeObjectsSearchFilterField.MEDIUM]: 'dcterms_medium',
	[IeObjectsSearchFilterField.OBJECT_TYPE]: 'ebucore_object_type',
	[IeObjectsSearchFilterField.IDENTIFIER]: 'schema_identifier',
	[IeObjectsSearchFilterField.LICENSES]: 'schema_license',
};

export const NUMBER_OF_FILTER_OPTIONS_DEFAULT = 40;
export const NUMBER_OF_OPTIONS_PER_AGGREGATE = {
	[IeObjectsSearchFilterField.FORMAT]: NUMBER_OF_FILTER_OPTIONS_DEFAULT, // Only contains a few options: video, audio and in the future maybe newspaper and images
	[IeObjectsSearchFilterField.GENRE]: NUMBER_OF_FILTER_OPTIONS_DEFAULT,
	[IeObjectsSearchFilterField.MEDIUM]: 500, // Fetch all options at once
	[IeObjectsSearchFilterField.CREATOR]: NUMBER_OF_FILTER_OPTIONS_DEFAULT,
	[IeObjectsSearchFilterField.LANGUAGE]: 500, // Fetch all options at once
	[IeObjectsSearchFilterField.MAINTAINER_ID]: 500, // Fetch all options at once
};

export const ORDER_MAPPINGS: { [prop in OrderProperty]: string } = {
	[OrderProperty.RELEVANCE]: '_score',
	[OrderProperty.CREATED]: 'schema_date_created',
	[OrderProperty.ARCHIVED]: 'dcterms_available',
	[OrderProperty.NAME]: 'schema_name.keyword',
};

export const MULTI_MATCH_FIELDS: Array<IeObjectsSearchFilterField> = [
	IeObjectsSearchFilterField.QUERY,
	IeObjectsSearchFilterField.ADVANCED_QUERY,
	IeObjectsSearchFilterField.NAME,
	IeObjectsSearchFilterField.DESCRIPTION,
	IeObjectsSearchFilterField.CREATOR,
	IeObjectsSearchFilterField.IDENTIFIER,
];

export const OCCURRENCE_TYPE: { [prop in Operator]?: string } = {
	contains: 'must',
	containsNot: 'must_not',
	is: 'must',
	isNot: 'must_not',
};

export const VALUE_OPERATORS: Operator[] = [Operator.GTE, Operator.LTE];

// By default, add the 'format' aggregation
export const AGGS_PROPERTIES: Array<IeObjectsSearchFilterField> = [
	IeObjectsSearchFilterField.FORMAT,
];

export const NEEDS_FILTER_SUFFIX: { [prop in IeObjectsSearchFilterField]?: string } = {
	[IeObjectsSearchFilterField.GENRE]: 'keyword',
	[IeObjectsSearchFilterField.KEYWORD]: 'keyword',
	[IeObjectsSearchFilterField.NAME]: 'keyword',
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: 'keyword',
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: 'keyword',
	[IeObjectsSearchFilterField.OBJECT_TYPE]: 'keyword',

	// http://es-qas-hetarchief.private.cloud.meemoo.be/_mapping
	// These are already type keyword:
	// [IeObjectsSearchFilterField.FORMAT]: 'keyword',
	// [IeObjectsSearchFilterField.MAINTAINER_ID]: 'keyword',
	// [IeObjectsSearchFilterField.LANGUAGE]: 'keyword',
	// [IeObjectsSearchFilterField.MEDIUM]: 'keyword',
	// [IeObjectsSearchFilterField.IDENTIFIER]: 'keyword',
	// [IeObjectsSearchFilterField.LICENSES]: 'keyword',
};

export const NEEDS_AGG_SUFFIX: { [prop in IeObjectsSearchFilterField]?: string } = {
	[IeObjectsSearchFilterField.GENRE]: 'keyword',
	[IeObjectsSearchFilterField.OBJECT_TYPE]: 'keyword',
};

/*
	This prefix is added before and after every digit before jsep parses it.
	This has to be a string that's not expected to occur in any ES object's properties.
	If the search term is a string starting with a digit, and we don't do this, jsep will throw an error saying a variable cannot start with a digit.
*/
export const JSEP_DIGIT_PREFIX = '_ç_ç_ç_ç_ç_';
