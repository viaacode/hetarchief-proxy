import { IPagination } from '@studiohyperdrive/pagination';

import {
	FindAllObjectsByCollectionIdQuery,
	GetObjectDetailBySchemaIdentifierQuery,
	GetRelatedObjectsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { ContactInfo } from '~shared/types/types';

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
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID (not unique per object)
	premisIdentifier: any;
	maintainerId: string;
	maintainerName: string;
	datePublished: string;
	dctermsAvailable: string;
	name: string;
	description: string;
	abstract: string;
	creator: any;
	actor?: any;
	publisher: any;
	spatial: string;
	temporal: string;
	keywords: string[];
	genre: string[];
	dctermsFormat: string;
	dctermsMedium: string;
	inLanguage: string[];
	thumbnailUrl: string;
	duration: string;
	dateCreated: string;
	ebucoreObjectType: string;
	meemoofilmColor: boolean;
	meemoofilmBase: string;
	meemoofilmImageOrSound: string;
	meemooLocalId: string;
	meemooOriginalCp: string;
	meemooDescriptionProgramme: string;
	meemooDescriptionCast: string;
	licenses: IeObjectLicense[];
	series?: string[];
	accessThrough?: IeObjectAccessThrough[];
	program?: string[];
	alternativeName?: string[];
	premisIsPartOf?: string;
	contactInfo?: ContactInfo;
	copyrightHolder?: string;
	copyrightNotice?: string;
	durationInSeconds?: number;
	numberOfPages?: number;
	meemooMediaObjectId?: string;
	sector?: IeObjectSector;
	representations?: IeObjectRepresentation[];
	dateCreatedLowerBound?: string;
	ebucoreIsMediaFragmentOf?: string;
	meemoofilmCaption?: string;
	meemoofilmCaptionLanguage?: string;
	ebucoreHasMediaFragmentOf?: boolean;
	serviceProvider?: any; // type onbekend
	transcript?: string;
	caption?: string;
	categorie?: any; // type onbekend
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
	ebucore_object_type: any;
	schema_in_language: string[];
	dcterms_available: string;
	meemoo_identifier: string;
	schema_identifier: string;
	schema_publisher: any;
	schema_duration: string;
	schema_abstract: any;
	schema_keywords: string[];
	schema_genre: string[];
	schema_license: string[];
	schema_maintainer: {
		schema_identifier: string;
		schema_name: string;
	};
	schema_thumbnail_url: string;
	dcterms_format: string;
	schema_name: string;
	meemoo_description_cast: string;
	meemoo_description_programme: string;
	schema_spatial_coverage: string;
	schema_temporal_coverage: string;
	schema_copyrightholder: string;
	duration_seconds: number;
	schema_number_of_pages: number;
	meemoofilm_color: boolean;
	meemoofilm_base: string;
	meemoofilm_image_or_sound: string;
	meemoofilm_contains_embedded_caption: boolean;
	meemoo_local_id: string;
	meemoo_original_cp: string;
	schema_creator?: {
		Maker?: string[];
		Archiefvormer?: string[];
	};
	schema_description?: string;
	dcterms_medium?: string | null;
	premis_is_part_of?: string;
	premis_identifier?: {
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
	};
	schema_is_part_of?: {
		archief?: string[];
		reeks?: string[];
		alternatief?: string[];
		serie?: string[];
	};
	schema_date_created?: string;
	schema_date_published?: string;
	schema_contributor?: {
		Voorzitter: string[];
	};
}

export interface IeObjectsWithAggregations extends IPagination<Partial<IeObject>> {
	aggregations: any;
}

export interface IeObjectsVisitorSpaceInfo {
	visitorSpaceIds: string[];
	objectIds: string[];
}
