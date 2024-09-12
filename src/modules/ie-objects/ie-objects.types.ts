import { type IPagination } from '@studiohyperdrive/pagination';

import {
	type FindAllIeObjectsByFolderIdQuery,
	type GetObjectDetailBySchemaIdentifiersQuery,
} from '~generated/graphql-db-types-hetarchief';
import { type IeObjectsSearchFilterField } from '~modules/ie-objects/elasticsearch/elasticsearch.consts';

export type IeObjectSectorLicenseMatrix = Readonly<
	Record<IeObjectSector, Readonly<IeObjectLicense[]>>
>;

export type IeObjectSeo = Pick<IeObject, 'name' | 'description' | 'thumbnailUrl'>;

export type GqlLimitedIeObject = FindAllIeObjectsByFolderIdQuery['users_folder_ie'][0];

export enum MediaFormat {
	VIDEO = 'video',
	AUDIO = 'audio',
}

export enum IeObjectLicense {
	// Object Licenses
	PUBLIEK_METADATA_LTD = 'VIAA-PUBLIEK-METADATA-LTD',
	PUBLIEK_METADATA_ALL = 'VIAA-PUBLIEK-METADATA-ALL',
	PUBLIEK_CONTENT = 'VIAA-PUBLIEK-CONTENT',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	INTRA_CP_METADATA_ALL = 'VIAA-INTRA_CP-METADATA-ALL',
	INTRA_CP_METADATA_LTD = 'VIAA-INTRA_CP-METADATA-LTD',
	INTRA_CP_CONTENT = 'VIAA-INTRA_CP-CONTENT',

	// Rights statuses
	PUBLIC_DOMAIN = 'Publiek-Domein',
	COPYRIGHT_UNDETERMINED = 'COPYRIGHT-UNDETERMINED',
}

export enum IeObjectMetadataSet {
	METADATA_LTD = 'METADATA_LTD',
	METADATA_ALL = 'METADATA_ALL',
	METADATA_ALL_WITH_ESSENCE = 'METADATA_ALL_WITH_ESSENCE',
	EMPTY = 'EMPTY',
}

export enum IeObjectSector {
	CULTURE = 'Cultuur',
	GOVERNMENT = 'Overheid',
	PUBLIC = 'Publieke Omroep',
	REGIONAL = 'Regionale Omroep',
	RURAL = 'Landelijke Private Omroep',
}

export enum IeObjectAccessThrough {
	PUBLIC_INFO = 'PUBLIC_INFO',
	VISITOR_SPACE_FULL = 'VISITOR_SPACE_FULL',
	VISITOR_SPACE_FOLDERS = 'VISITOR_SPACE_FOLDERS',
	SECTOR = 'SECTOR',
}

export enum IeObjectExtraUserGroupType {
	ANONYMOUS = 'ANONYMOUS',
}

export type EbucoreObjectType = 'footage' | 'program';

export interface IeObjectFile {
	id: string;
	name: string;
	mimeType: string;
	storedAt: string;
	thumbnailUrl: string;
	duration: string;
	edmIsNextInSequence: string;
	createdAt: string;
}

export interface IeObjectPageRepresentation {
	representations: IeObjectRepresentation[];
	mentions: Mention[];
}

export interface IeObjectRepresentation {
	id: string;
	schemaName: string;
	isMediaFragmentOf: string;
	schemaInLanguage: string;
	schemaStartTime: string;
	schemaEndTime: string;
	schemaTranscript: string;
	schemaTranscriptUrl: string | null;
	edmIsNextInSequence: string;
	updatedAt: string;
	files: IeObjectFile[];
}

export enum IsPartOfKey {
	alternatief = 'alternatief',
	archief = 'archief',
	deelarchief = 'deelarchief',
	deelreeks = 'deelreeks',
	programma = 'programma',
	reeks = 'reeks',
	seizoen = 'seizoen',
	serie = 'serie',
	stuk = 'stuk',
	episode = 'episode',
	aflevering = 'aflevering',
	bestanddeel = 'bestanddeel',
	registratie = 'registratie',
	serienummer = 'serienummer',
	seizoennummer = 'seizoennummer',
}

export interface IsPartOfCollection {
	iri?: string;
	schemaIdentifier?: string;
	name: string;
	collectionType: IsPartOfKey;
	isPreceededBy?: any[];
	isSucceededBy?: any[];
	locationCreated?: any;
	startDate?: any;
	endDate?: any;
	publisher?: any;
}

export enum IeObjectType {
	Video = 'video',
	Audio = 'audio',
	Film = 'film',
	Newspaper = 'newspaper',
}

export interface IeObject {
	dctermsAvailable: string;
	dctermsFormat: IeObjectType;
	dctermsMedium: string[];
	premisIdentifier: Record<string, string>[];
	abstract: string;
	creator: any;
	dateCreated: string | null;
	datePublished: string;
	description: string;
	duration: string;
	genre: string[];
	iri: string;
	schemaIdentifier: string; // Unique id per object
	inLanguage: string[];
	keywords: string[];
	licenses: IeObjectLicense[];
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	maintainerLogo: string | null;
	maintainerOverlay: boolean | null;
	maintainerIiifAgreement?: boolean | null;
	name: string;
	publisher: any;
	spatial: string[];
	temporal: string[];
	thumbnailUrl: string;
	sector?: IeObjectSector;
	accessThrough?: IeObjectAccessThrough[];
	ebucoreObjectType?: string | null;
	meemoofilmContainsEmbeddedCaption?: boolean;
	contributor?: any;
	copyrightHolder?: string;
	premisIsPartOf?: string | null;
	isPartOf?: IsPartOfCollection[];
	numberOfPages?: number;
	pageNumber?: number;
	meemooDescriptionCast?: string;
	maintainerFormUrl?: string | null;
	maintainerDescription?: string;
	maintainerSiteUrl?: string;
	meemooLocalId?: string;
	meemooOriginalCp?: string;
	durationInSeconds?: number;
	copyrightNotice?: string;
	meemooMediaObjectId?: string;
	transcript?: string;
	abrahamInfo?: {
		id: string;
		uri: string;
		code: string;
	};
	synopsis: string;
	collectionName?: string;
	issueNumber?: string;
	fragmentId?: string;
	creditText?: string;
	preceededBy?: string[];
	succeededBy?: string[];
	width?: string;
	height?: string;
	bibframeProductionMethod?: string | null;
	bibframeEdition?: string | null;
	locationCreated?: string;
	startDate?: string;
	endDate?: string;
	carrierDate?: string;
	newspaperPublisher?: string;
	alternativeTitle?: string[];
	mentions?: Mention[];
	children?: number;
	pageRepresentations?: IeObjectPageRepresentation[];
}

export interface MediaSearchAggregation<T> {
	buckets: {
		key: T;
		doc_count: number;
	}[];
	doc_count_error_upper_bound: number;
	sum_other_doc_count: number;
}

export interface ElasticsearchResponse {
	took: number;
	timed_out: boolean;
	_shards: {
		total: number;
		successful: number;
		skipped: number;
		failed: number;
	};
	hits: {
		total: {
			value: number;
			relation: string;
		};
		max_score: number;
		hits: ElasticsearchHit[];
	};
	aggregations: {
		dcterms_format: MediaSearchAggregation<string>;
		dcterms_medium: MediaSearchAggregation<string>;
		schema_genre: MediaSearchAggregation<string>;
		schema_creator: MediaSearchAggregation<string>;
		schema_in_language: MediaSearchAggregation<string>;
	};
}

export interface ElasticsearchHit {
	_index: string;
	_type: string;
	_id: string;
	_score: number;
	_source: ElasticsearchObject;
}

export interface ElasticsearchObject {
	// According to _mapping
	dcterms_available: string;
	dcterms_format: string;
	dcterms_medium: string[] | null;
	ebucore_object_type: EbucoreObjectType | null;
	meemoofilm_base: string | null; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	meemoofilm_color: boolean | null; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	meemoofilm_contains_embedded_caption: boolean; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	meemoofilm_image_or_sound: string; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	premis_is_part_of: string;
	premis_identifier: Record<string, string>[] | null;
	schema_abstract: string | null; // always null in values (QAS & INT)
	schema_alternate_name: string | null; // only exists as value in INT (not QAS)
	schema_contributor: {
		presenter?: string[];
		Producer?: string[];
		director?: string[];
		onbepaald?: string[];
		Voorzitter?: string[];
	} | null;
	schema_copyrightholder: string; // exists in _mapping but does not exist in values (QAS & INT)
	schema_creator:
		| {
				Maker?: string[];
				Archiefvormer?: string[];
		  }[]
		| null;
	schema_date_created: string | null;
	schema_date_published: string | null;
	schema_description: string | null;
	schema_duration: string;
	schema_genre: string[];
	iri: string;
	schema_identifier: string;
	schema_in_language: string[];
	schema_is_part_of: IsPartOfCollection[] | null;
	schema_keywords: string[];
	schema_license: string[] | null;
	schema_maintainer: {
		schema_identifier?: string;
		schema_name?: string;
		alt_label?: string | null; // not always available
		organization_sector?: IeObjectSector | null; // not always available
		organization_type?: string | null; // not always available
	};
	schema_name: string;
	schema_publisher: {
		Distributeur?: string[];
	} | null;
	schema_spatial_coverage: string[];
	schema_temporal_coverage: string[];
	schema_thumbnail_url: string[];
	// Discrepancy props in QAS & INT
	schema_number_of_pages?: number; // exists in _mapping but does not exist in values (QAS & INT)
	meemoo_description_cast?: string; // only exists in QAS (not INT)
	meemoo_description_programme?: string | null; // only exists in QAS (not INT)
	meemoo_local_id?: string | null; // only exists in QAS (not INT)
	meemoo_original_cp?: string | null; // only exists in QAS + always null (not INT)
	duration_seconds?: number; // Missing in both _mapping and values (QAS & INT)
	premis_is_represented_by?: any; // Missing in both _mapping and values (QAS & INT)
	// Not yet available
	schema_transcript?: string;
	schema_caption?: string;
	meemoo_description_category?: string[];
	meemoofilm_embedded_caption?: string;
	meemoofilm_embedded_caption_language?: string;
	schema_location_created?: string | null;
	schema_mentions?: string[] | null;
	children?: number;
}

export interface IeObjectsWithAggregations extends IPagination<Partial<IeObject>> {
	aggregations: any;
	searchTerms: string[];
}

export interface IeObjectsVisitorSpaceInfo {
	visitorSpaceIds: string[];
	objectIds: string[];
}

export interface IeObjectsSitemap {
	schemaIdentifier: string;
	maintainerSlug: string;
	name: string;
	updatedAt: string;
}

export interface NewspaperTitle {
	title: string;
}

export type FilterOptions = {
	[IeObjectsSearchFilterField.OBJECT_TYPE]: string[];
	[IeObjectsSearchFilterField.LANGUAGE]: string[];
	[IeObjectsSearchFilterField.MEDIUM]: string[];
	[IeObjectsSearchFilterField.GENRE]: string[];
	[IeObjectsSearchFilterField.MAINTAINER_ID]: {
		id: string;
		name: string;
	}[];
};

export type GqlIeObject = GetObjectDetailBySchemaIdentifiersQuery['graph__intellectual_entity'][0];

export type RelatedIeObject = Pick<
	IeObject,
	| 'dctermsAvailable'
	| 'dctermsFormat'
	| 'dateCreated'
	| 'datePublished'
	| 'description'
	| 'duration'
	| 'schemaIdentifier'
	| 'licenses'
	| 'maintainerId'
	| 'maintainerName'
	| 'maintainerSlug'
	| 'name'
	| 'thumbnailUrl'
	| 'sector'
	| 'accessThrough'
	| 'transcript'
	| 'iri'
>;

export interface RelatedIeObjects {
	parent: Partial<RelatedIeObject> | null;
	children: Partial<RelatedIeObject>[];
}

export enum AutocompleteField {
	creator = 'creator',
	locationCreated = 'locationCreated',
	newspaperSeriesName = 'newspaperSeriesName',
	mentions = 'mentions',
}

export enum AutocompleteEsField {
	creator = 'schema_creator_text',
	locationCreated = 'schema_location_created',
	newspaperSeriesName = 'schema_is_part_of.newspaper',
	mentions = 'schema_mentions',
}

export enum AutocompleteQueryType {
	match_phrase_prefix = 'match_phrase_prefix',
	suggest = 'suggest',
}

export interface EsQueryAutocompleteMatchPhraseResponse {
	took: number;
	timed_out: boolean;
	_shards: {
		total: number;
		successful: number;
		skipped: number;
		failed: number;
	};
	hits: {
		total: {
			value: number;
			relation: string;
		};
		max_score: number;
		hits: {
			_index: string;
			_id: string;
			_score: number;
			fields: Record<AutocompleteEsField, string | string[]>;
			_ignored?: string[];
		}[];
	};
}

export interface EsQueryAutocompleteSuggestResponse {
	took: number;
	timed_out: boolean;
	_shards: {
		total: number;
		successful: number;
		skipped: number;
		failed: number;
	};
	hits: {
		total: {
			value: number;
			relation: string;
		};
		max_score: any;
		hits: any[];
	};
	suggest: {
		'keyword-suggest': {
			text: string;
			offset: number;
			length: number;
			options: {
				text: string;
				_index: string;
				_id: string;
				_score: number;
				fields: Record<Partial<AutocompleteEsField>, string>;
			}[];
		}[];
	};
}

export interface Mention {
	iri: string;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	confidence: number;
	birthDate: number;
	birthPlace: string;
	deathDate: number;
	deathPlace: string;
}
