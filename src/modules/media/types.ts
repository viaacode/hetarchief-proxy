import { QueryType } from './elasticsearch/consts';

import {
	FindAllObjectsByCollectionIdQuery,
	GetObjectDetailBySchemaIdentifierQuery,
	GetRelatedObjectsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { ContactInfo } from '~shared/types/types';

export enum MediaFormat {
	VIDEO = 'video',
	AUDIO = 'audio',
}

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
	MULTI_MATCH_QUERY_MAPPING: { [prop in SearchFilterField]?: any };
	NEEDS_AGG_SUFFIX: { [prop in SearchFilterField]?: string };
}

export type GqlIeObject = GetObjectDetailBySchemaIdentifierQuery['object_ie'][0] &
	GetRelatedObjectsQuery['object_ie'][0];

export type GqlLimitedIeObject = FindAllObjectsByCollectionIdQuery['users_folder_ie'][0];

export interface MediaFile {
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	ebucoreMediaType: string;
	ebucoreIsMediaFragmentOf: string;
	embedUrl: string;
}

export interface Representation {
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	files: MediaFile[];
}

export interface Media {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID (not unique per object)
	premisIdentifier: any;
	premisRelationship: string;
	isPartOf: string;
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
	// spatial: string;
	// temporal: string;
	keywords: string;
	genre: string;
	dctermsFormat: string;
	inLanguage: string;
	thumbnailUrl: string;
	// embedUrl: string;
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
	MEDIUM = 'medium',
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

export enum License {
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
}
