import _ from 'lodash';

import { IeObjectSector, IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import creatorSearchQueryExact from './templates/exact/creator-query.json';
import identifierSearchQueryFuzzy from './templates/exact/identifier-search-query.json';
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
const identifierSearchQueryTemplateExact = _.values(identifierSearchQueryFuzzy);
const creatorSearchQueryTemplateExact = _.values(creatorSearchQueryExact);

export enum IeObjectsSearchFilterField {
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
	// TODO future: rename maintainer to maintainerId and maintainers to maintainerName and also change this in the client
	MAINTAINER_ID = 'maintainer', // Contains the OR-id of the maintainer
	CAST = 'cast',
	CAPTION = 'caption',
	TRANSCRIPT = 'transcript',
	CATEGORIE = 'categorie',
	DURATION = 'duration',
	LANGUAGE = 'language',
	MEDIUM = 'medium',
	CONSULTABLE_ONLY_ON_LOCATION = 'isConsultableOnlyOnLocation',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
	TYPE = 'type',
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
	user: SessionUserEntity;
	visitorSpaceInfo?: IeObjectsVisitorSpaceInfo;
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
		creator: creatorSearchQueryTemplateExact,
	},
};

export const DEFAULT_QUERY_TYPE: { [prop in IeObjectsSearchFilterField]?: QueryType } = {
	[IeObjectsSearchFilterField.GENRE]: QueryType.TERMS, // text // TODO es text -> can be match query: no longer case sensitive but issue with multiValue
	[IeObjectsSearchFilterField.KEYWORD]: QueryType.TERMS, // text // TODO es text -> can be match query: no longer case sensitive but issue with multiValue
	[IeObjectsSearchFilterField.NAME]: QueryType.TERM, // used for exact (not) matching
	[IeObjectsSearchFilterField.FORMAT]: QueryType.TERMS, // es keyword
	[IeObjectsSearchFilterField.PUBLISHER]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CREATOR]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CREATED]: QueryType.RANGE,
	[IeObjectsSearchFilterField.PUBLISHED]: QueryType.RANGE,
	[IeObjectsSearchFilterField.DESCRIPTION]: QueryType.TERM, // used for exact (not) matching
	[IeObjectsSearchFilterField.ERA]: QueryType.MATCH,
	[IeObjectsSearchFilterField.LOCATION]: QueryType.MATCH,
	[IeObjectsSearchFilterField.MAINTAINER_ID]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CAST]: QueryType.TERMS,
	[IeObjectsSearchFilterField.CAPTION]: QueryType.TERM,
	[IeObjectsSearchFilterField.TRANSCRIPT]: QueryType.TERM,
	[IeObjectsSearchFilterField.CATEGORIE]: QueryType.TERMS,
	[IeObjectsSearchFilterField.DURATION]: QueryType.RANGE,
	[IeObjectsSearchFilterField.LANGUAGE]: QueryType.TERMS,
	[IeObjectsSearchFilterField.MEDIUM]: QueryType.TERMS,
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
	[IeObjectsSearchFilterField.ERA]: 'schema_temporal_coverage',
	[IeObjectsSearchFilterField.LOCATION]: 'schema_spatial_coverage',
	[IeObjectsSearchFilterField.MAINTAINER_ID]: 'schema_maintainer.schema_identifier',
	[IeObjectsSearchFilterField.CAST]: 'meemoo_description_cast',
	[IeObjectsSearchFilterField.CAPTION]: 'schema_caption',
	[IeObjectsSearchFilterField.TRANSCRIPT]: 'schema_transcript',
	[IeObjectsSearchFilterField.CATEGORIE]: 'meemoo_description_categorie',
	[IeObjectsSearchFilterField.DURATION]: 'schema_duration',
	[IeObjectsSearchFilterField.LANGUAGE]: 'schema_in_language',
	[IeObjectsSearchFilterField.MEDIUM]: 'dcterms_medium',
	[IeObjectsSearchFilterField.TYPE]: 'ebucore_object_type',
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
	relevance: '_score',
	created: 'schema_date_created',
	published: 'schema_date_published',
	name: 'schema_name.keyword',
};

export const MULTI_MATCH_FIELDS: Array<IeObjectsSearchFilterField> = [
	IeObjectsSearchFilterField.QUERY,
	IeObjectsSearchFilterField.ADVANCED_QUERY,
	IeObjectsSearchFilterField.NAME,
	IeObjectsSearchFilterField.DESCRIPTION,
	IeObjectsSearchFilterField.CREATOR,
];

export const OCCURRENCE_TYPE: { [prop in Operator]?: string } = {
	contains: 'must',
	containsNot: 'must_not',
	is: 'must',
	isNot: 'must_not',
};

export const VALUE_OPERATORS: Operator[] = [Operator.GTE, Operator.LTE];

// By default add the 'format' aggregation
export const AGGS_PROPERTIES: Array<IeObjectsSearchFilterField> = [
	IeObjectsSearchFilterField.FORMAT,
];

export const NEEDS_FILTER_SUFFIX: { [prop in IeObjectsSearchFilterField]?: string } = {
	[IeObjectsSearchFilterField.GENRE]: 'keyword',
	[IeObjectsSearchFilterField.NAME]: 'keyword',
	[IeObjectsSearchFilterField.TYPE]: 'keyword',
};

export const NEEDS_AGG_SUFFIX: { [prop in IeObjectsSearchFilterField]?: string } = {
	[IeObjectsSearchFilterField.GENRE]: 'keyword',
	[IeObjectsSearchFilterField.TYPE]: 'keyword',
};

/*
	This prefix is added before and after every digit before jsep parses it.
	This has to be a string that's not expected to occur in any ES object's properties.
	If the searchterm is a string starting with a digit and we don't do this, jsep will throw an error saying a variable cannot start with a digit.
*/
export const JSEP_DIGIT_PREFIX = '_ç_ç_ç_ç_ç_';
