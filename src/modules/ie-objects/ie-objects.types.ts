import { IPagination } from '@studiohyperdrive/pagination';

import {
	FindAllObjectsByCollectionIdQuery,
	GetObjectDetailBySchemaIdentifierQuery,
	GetRelatedObjectsQuery,
} from '~generated/graphql-db-types-hetarchief';

export type IeObjectSectorLicenseMatrix = Record<IeObjectSector, IeObjectLicense[]>;

export type IeObjectSeo = Pick<IeObject, 'name'>;

export type GqlIeObject = GetObjectDetailBySchemaIdentifierQuery['object_ie'][0] &
	GetRelatedObjectsQuery['object_ie'][0];

export type GqlLimitedIeObject = FindAllObjectsByCollectionIdQuery['users_folder_ie'][0];

export enum MediaFormat {
	VIDEO = 'video',
	AUDIO = 'audio',
}

export enum IeObjectLicense {
	PUBLIEK_METADATA_LTD = 'VIAA-PUBLIEK-METADATA-LTD',
	PUBLIEK_METADATA_ALL = 'VIAA-PUBLIEK-METADATA-ALL',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	INTRA_CP_METADATA_ALL = 'VIAA-INTRA_CP-METADATA-ALL',
	INTRA_CP_METADATA_LTD = 'VIAA-INTRA_CP-METADATA-LTD',
	INTRA_CP_CONTENT = 'VIAA-INTRA_CP-CONTENT',
}

export enum IeObjectMetadataSet {
	METADATA_LTD = 'METADATA_LTD',
	METADATA_ALL = 'METADATA_ALL',
	METADATA_ALL_WITH_ESSENCE = 'METADATA_ALL_WITH_ESSENCE',
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
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	ebucoreMediaType: string;
	ebucoreIsMediaFragmentOf: string;
	embedUrl: string;
}

export interface IeObjectRepresentation {
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	files: IeObjectFile[];
}

export interface IeObject {
	dctermsAvailable: string;
	dctermsFormat: string;
	dctermsMedium: string;
	ebucoreObjectType: string;
	meemooIdentifier: string; // PID (not unique per object)
	meemoofilmBase: string;
	meemoofilmColor: boolean;
	meemoofilmImageOrSound: string;
	premisIdentifier: any;
	abstract: string;
	creator: any;
	dateCreated: string;
	datePublished: string;
	description: string;
	duration: string;
	genre: string[];
	schemaIdentifier: string; // Unique id per object
	inLanguage: string[];
	keywords: string[];
	licenses: IeObjectLicense[];
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	name: string;
	publisher: any;
	spatial: string;
	temporal: string;
	thumbnailUrl: string;
	// EXTRA
	sector?: IeObjectSector;
	accessThrough?: IeObjectAccessThrough[];
	// OPTIONAL
	meemoofilmContainsEmbeddedCaption?: boolean;
	premisIsPartOf?: string;
	alternativeName?: string;
	contributor?: any;
	copyrightHolder?: string;
	schemaIsPartOf?: any;
	series?: string[];
	programs?: string[] | null;
	numberOfPages?: number;
	meemooDescriptionCast?: string;
	representations?: IeObjectRepresentation[];
	maintainerFromUrl?: string | null;
	// FROM DB
	meemoofilmCaption?: string;
	meemoofilmCaptionLanguage?: string;
	meemooDescriptionProgramme?: string;
	meemooLocalId?: string;
	meemooOriginalCp?: string;
	durationInSeconds?: number;
	copyrightNotice?: string;
	meemooMediaObjectId?: string;
	ebucoreIsMediaFragmentOf?: string;
	ebucoreHasMediaFragmentOf?: boolean;
	dateCreatedLowerBound?: string;
	actor?: string | null;
	// Not yet available
	transcript?: string;
	caption?: string;
	categorie?: string[];
	meemooContainsEmbeddedCaption?: string;
	languageSubtitles?: string;
	meemooDescriptionCategory?: string[];
	meemoofilmEmbeddedCaption?: string;
	meemoofilmEmbeddedCaptionLanguage?: string;
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
	dcterms_medium: string | null;
	ebucore_object_type: EbucoreObjectType | null;
	meemoo_identifier: string;
	meemoofilm_base: string | null; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	meemoofilm_color: boolean | null; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	meemoofilm_contains_embedded_caption: boolean; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	meemoofilm_image_or_sound: string; // exists in _mapping but does not exist in values of INT (exists in QAS but always null)
	premis_is_part_of: string;
	premis_identifier: {
		Afbeelding?: string[];
		Objectnaam?: string[];
		object_nummer?: string[];
		kp_productie_id?: string[];
		kp_show_id?: string[];
		Inventarisnummer?: string[];
		batch?: string[];
		Acquisition_number?: string[];
		Bestandsnaam?: string[];
		Api?: string[];
		Object_number?: string[];
		MEDIA_ID?: string[];
	} | null;
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
	schema_creator: {
		Maker?: string[];
		Archiefvormer?: string[];
	} | null;
	schema_date_created: string | null;
	schema_date_published: string | null;
	schema_description: string | null;
	schema_duration: string;
	schema_genre: string[];
	schema_identifier: string;
	schema_in_language: string[];
	schema_is_part_of: {
		archief?: string[];
		reeks?: string[];
		alternatief?: string[];
		serie?: string[];
	} | null;
	schema_keywords: string[];
	schema_license: string[] | null;
	schema_maintainer: {
		schema_identifier?: string;
		schema_name?: string;
		alt_label?: string | null; // not always available
		organization_type?: IeObjectSector | null; // not always available
	};
	schema_name: string;
	schema_publisher: {
		Distributeur?: string[];
	} | null;
	schema_spatial_coverage: string;
	schema_temporal_coverage: string;
	schema_thumbnail_url: string;
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
}

export interface IeObjectsWithAggregations extends IPagination<Partial<IeObject>> {
	aggregations: any;
	searchTerms: string[];
}

export interface IeObjectsVisitorSpaceInfo {
	visitorSpaceIds: string[];
	objectIds: string[];
}
