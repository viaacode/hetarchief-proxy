import type { IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import identifierSearchQueryExact from './templates/exact/identifier-search-query.json';
import nameSearchQueryExact from './templates/exact/name-search-query.json';
import searchQueryAllExact from './templates/exact/search-query--metadata-all.json';
import searchQueryLimitedExact from './templates/exact/search-query--metadata-limited.json';
import descriptionSearchQueryFuzzy from './templates/fuzzy/description-search-query.json';
import nameSearchQueryFuzzy from './templates/fuzzy/name-search-query.json';
import searchQueryAllFuzzy from './templates/fuzzy/search-query--metadata-all.json';
import searchQueryLimitedFuzzy from './templates/fuzzy/search-query--metadata-limited.json';

import { SessionUserEntity } from '~modules/users/classes/session-user';

export const ALL_INDEXES = 'or-*';

export enum IeObjectsSearchFilterField {
	// Searches in metadata LTD fields
	CREATED = 'created',
	RELEASE_DATE = 'releaseDate', // Searches in both creation date and publish date
	CREATOR = 'creator',
	LOCATION_CREATED = 'locationCreated',
	MENTIONS = 'mentions',
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
	NEWSPAPER_SERIES_NAME = 'newspaperSeriesName',
	// TODO future: rename maintainer to maintainerId and maintainers to maintainerName and also change this in the client
	MAINTAINER_ID = 'maintainer', // Contains the OR-id of the maintainer
	CONSULTABLE_ONLY_ON_LOCATION = 'isConsultableOnlyOnLocation',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
	CONSULTABLE_PUBLIC_DOMAIN = 'isConsultablePublicDomain',
	CAST = 'cast',
	IDENTIFIER = 'identifier',
	CATEGORIE = 'categorie', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
	LICENSES = 'license', // Used to filter objects that are in a visitor space

	// Searches in metadata ALL fields
	QUERY = 'query',
	TRANSCRIPT = 'transcript',
	CAPTION = 'caption', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
	OBJECT_TYPE = 'objectType',
	PUBLISHER = 'publisher',
}

export const IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_LIMITED: IeObjectsSearchFilterField[] = [
	// LTD
	IeObjectsSearchFilterField.QUERY,
	IeObjectsSearchFilterField.CREATED,
	IeObjectsSearchFilterField.CREATOR,
	IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
	IeObjectsSearchFilterField.LOCATION_CREATED,
	IeObjectsSearchFilterField.MENTIONS,
	IeObjectsSearchFilterField.DESCRIPTION,
	IeObjectsSearchFilterField.DURATION,
	IeObjectsSearchFilterField.SPACIAL_COVERAGE,
	IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
	IeObjectsSearchFilterField.FORMAT,
	IeObjectsSearchFilterField.GENRE,
	IeObjectsSearchFilterField.KEYWORD,
	IeObjectsSearchFilterField.LANGUAGE,
	IeObjectsSearchFilterField.MEDIUM,
	IeObjectsSearchFilterField.NAME,
	IeObjectsSearchFilterField.PUBLISHED,
	IeObjectsSearchFilterField.RELEASE_DATE,
	IeObjectsSearchFilterField.MAINTAINER_ID,
	IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
	IeObjectsSearchFilterField.CAST,
	IeObjectsSearchFilterField.IDENTIFIER,
	IeObjectsSearchFilterField.LICENSES,
	IeObjectsSearchFilterField.CATEGORIE,
];

export const IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_ALL: IeObjectsSearchFilterField[] = [
	...IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_LIMITED,
	// ALL
	IeObjectsSearchFilterField.TRANSCRIPT,
	IeObjectsSearchFilterField.CAPTION,
	IeObjectsSearchFilterField.PUBLISHER,
	IeObjectsSearchFilterField.OBJECT_TYPE,
	IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
	IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN,
];

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

export enum MetadataAccessType {
	LIMITED = 'limited',
	ALL = 'all',
}

export const MULTI_MATCH_QUERY_MAPPING: Record<
	'fuzzy' | 'exact',
	Record<string, Record<'limited' | 'all', any>>
> = {
	fuzzy: {
		query: {
			limited: searchQueryLimitedFuzzy,
			all: searchQueryAllFuzzy,
		},
		name: {
			limited: nameSearchQueryFuzzy,
			all: nameSearchQueryFuzzy,
		},
		description: {
			limited: descriptionSearchQueryFuzzy,
			all: descriptionSearchQueryFuzzy,
		},
	},
	exact: {
		name: {
			limited: nameSearchQueryExact,
			all: nameSearchQueryExact,
		},
		identifier: {
			limited: identifierSearchQueryExact,
			all: identifierSearchQueryExact,
		},
		query: {
			limited: searchQueryLimitedExact,
			all: searchQueryAllExact,
		},
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
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: QueryType.TERM,
	[IeObjectsSearchFilterField.LOCATION_CREATED]: QueryType.MATCH,
	[IeObjectsSearchFilterField.MENTIONS]: QueryType.MATCH,
	[IeObjectsSearchFilterField.CREATED]: QueryType.RANGE,
	[IeObjectsSearchFilterField.PUBLISHED]: QueryType.RANGE,
	[IeObjectsSearchFilterField.RELEASE_DATE]: QueryType.RANGE,
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
	[IeObjectsSearchFilterField.IDENTIFIER]: QueryType.TERMS,
	[IeObjectsSearchFilterField.QUERY]: QueryType.TERMS,

	// Should never be used since these are handled separately using boolean filters
	// But we include it to get stricter type checks on missing fields
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: QueryType.TERMS,
};

// Max number of search results to return to the client
export const MAX_NUMBER_SEARCH_RESULTS = 2000;
// Max count to return to the client to avoid error:
// -  Result window is too large, from + size must be less than or equal to: [10000] but was [17110].
// -  See the scroll api for a more efficient way to request large data sets.
// -  This limit can be set by changing the [index.max_result_window] index level setting.
export const MAX_COUNT_SEARCH_RESULTS = 10000;

export enum ElasticsearchField {
	query = 'query',
	schema_genre = 'schema_genre',
	schema_keywords = 'schema_keywords',
	schema_name = 'schema_name',
	dcterms_format = 'dcterms_format',
	schema_publisher = 'schema_publisher',
	schema_creator = 'schema_creator',
	schema_creator_text = 'schema_creator_text',
	schema_date_created = 'schema_date_created',
	schema_date_published = 'schema_date_published',
	schema_description = 'schema_description',
	schema_temporal_coverage = 'schema_temporal_coverage',
	schema_spatial_coverage = 'schema_spatial_coverage',
	schema_maintainer = 'schema_maintainer',
	organization_sector = 'organization_sector',
	meemoo_description_cast = 'meemoo_description_cast',
	schema_caption = 'schema_caption',
	schema_transcript = 'schema_transcript',
	meemoo_description_categorie = 'meemoo_description_categorie',
	schema_duration = 'schema_duration',
	schema_in_language = 'schema_in_language',
	dcterms_medium = 'dcterms_medium',
	ebucore_object_type = 'ebucore_object_type',
	iri = 'iri',
	schema_identifier = 'schema_identifier',
	schema_license = 'schema_license',
	schema_mentions = 'schema_mentions',
	schema_is_part_of = 'schema_is_part_of',
	newspaper = 'newspaper',
	schema_location_created = 'schema_location_created',
}

export const READABLE_TO_ELASTIC_FILTER_NAMES: {
	[prop in Exclude<
		IeObjectsSearchFilterField,
		| IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
		| IeObjectsSearchFilterField.CONSULTABLE_MEDIA
		| IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN
		| IeObjectsSearchFilterField.RELEASE_DATE // Custom filter: creation date OR publish date
	>]: ElasticsearchField | `${ElasticsearchField}.${ElasticsearchField}`;
} = {
	[IeObjectsSearchFilterField.QUERY]: ElasticsearchField.query,
	[IeObjectsSearchFilterField.GENRE]: ElasticsearchField.schema_genre,
	[IeObjectsSearchFilterField.KEYWORD]: ElasticsearchField.schema_keywords,
	[IeObjectsSearchFilterField.NAME]: ElasticsearchField.schema_name,
	[IeObjectsSearchFilterField.FORMAT]: ElasticsearchField.dcterms_format,
	[IeObjectsSearchFilterField.PUBLISHER]: ElasticsearchField.schema_publisher,
	[IeObjectsSearchFilterField.CREATOR]: ElasticsearchField.schema_creator,
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: `${ElasticsearchField.schema_is_part_of}.${ElasticsearchField.newspaper}`,
	[IeObjectsSearchFilterField.LOCATION_CREATED]: ElasticsearchField.schema_location_created,
	[IeObjectsSearchFilterField.MENTIONS]: ElasticsearchField.schema_mentions,
	[IeObjectsSearchFilterField.CREATED]: ElasticsearchField.schema_date_created,
	[IeObjectsSearchFilterField.PUBLISHED]: ElasticsearchField.schema_date_published,
	[IeObjectsSearchFilterField.DESCRIPTION]: ElasticsearchField.schema_description,
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: ElasticsearchField.schema_temporal_coverage,
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: ElasticsearchField.schema_spatial_coverage,
	[IeObjectsSearchFilterField.MAINTAINER_ID]: `${ElasticsearchField.schema_maintainer}.${ElasticsearchField.schema_identifier}`,
	[IeObjectsSearchFilterField.CAST]: ElasticsearchField.meemoo_description_cast,
	[IeObjectsSearchFilterField.CAPTION]: ElasticsearchField.schema_caption,
	[IeObjectsSearchFilterField.TRANSCRIPT]: ElasticsearchField.schema_transcript,
	[IeObjectsSearchFilterField.CATEGORIE]: ElasticsearchField.meemoo_description_categorie,
	[IeObjectsSearchFilterField.DURATION]: ElasticsearchField.schema_duration,
	[IeObjectsSearchFilterField.LANGUAGE]: ElasticsearchField.schema_in_language,
	[IeObjectsSearchFilterField.MEDIUM]: ElasticsearchField.dcterms_medium,
	[IeObjectsSearchFilterField.OBJECT_TYPE]: ElasticsearchField.ebucore_object_type,
	[IeObjectsSearchFilterField.IDENTIFIER]: ElasticsearchField.schema_identifier,
	[IeObjectsSearchFilterField.LICENSES]: ElasticsearchField.schema_license,
};

export const NUMBER_OF_FILTER_OPTIONS_DEFAULT = 40;
export const NUMBER_OF_OPTIONS_PER_AGGREGATE = {
	[IeObjectsSearchFilterField.FORMAT]: NUMBER_OF_FILTER_OPTIONS_DEFAULT, // Only contains a few options: video, audio and in the future maybe newspaper and images
	[IeObjectsSearchFilterField.GENRE]: NUMBER_OF_FILTER_OPTIONS_DEFAULT,
	[IeObjectsSearchFilterField.MEDIUM]: 500, // Fetch all options at once
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
	IeObjectsSearchFilterField.NAME,
	IeObjectsSearchFilterField.DESCRIPTION,
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
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: 'keyword',
	[IeObjectsSearchFilterField.MENTIONS]: 'keyword',

	// http://es-qas-hetarchief.private.cloud.meemoo.be/_mapping
	// These are already type keyword:
	// [IeObjectsSearchFilterField.FORMAT]: 'keyword',
	// [IeObjectsSearchFilterField.MAINTAINER_ID]: 'keyword',
	// [IeObjectsSearchFilterField.LANGUAGE]: 'keyword',
	// [IeObjectsSearchFilterField.MEDIUM]: 'keyword',
	// [IeObjectsSearchFilterField.IDENTIFIER]: 'keyword',
	// [IeObjectsSearchFilterField.LICENSES]: 'keyword',
};

export const NEEDS_AGG_SUFFIX: { [prop in IeObjectsSearchFilterField]?: 'keyword' } = {
	[IeObjectsSearchFilterField.GENRE]: 'keyword',
	[IeObjectsSearchFilterField.OBJECT_TYPE]: 'keyword',
};

export const FLATTENED_FIELDS: IeObjectsSearchFilterField[] = [
	IeObjectsSearchFilterField.CREATOR,
	IeObjectsSearchFilterField.PUBLISHER,
];

/*
	This prefix is added before and after every digit before jsep parses it.
	This has to be a string that's not expected to occur in any ES object's properties.
	If the search term is a string starting with a digit, and we don't do this, jsep will throw an error saying a variable cannot start with a digit.
*/
export const JSEP_DIGIT_PREFIX = '_ç_ç_ç_ç_ç_';

/**
 * Used to identify return types that are single or arrays of elasticsearch sub queries
 * eg:
 * {
 *     bool: {
 *         should: [
 *     	       { term: { 'schema_name.keyword': 'test' } },
 *     	   ],
 *     }
 * }
 * or
 * {
 *     term: {
 *         'schema_name.keyword': 'test'
 *     }
 * }
 */
export type ElasticsearchSubQuery = Record<string, any>;
