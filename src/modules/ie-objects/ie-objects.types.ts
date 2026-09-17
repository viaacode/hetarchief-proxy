import type { IPagination } from '@studiohyperdrive/pagination';

import type { FindAllIeObjectsByFolderIdQuery } from '~generated/graphql-db-types-hetarchief';

import type {
	HetArchiefIeObject,
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectPage,
	HetArchiefIeObjectSector,
	HetArchiefIsPartOfCollection,
} from '@viaa/avo2-types';

export type IeObjectSectorLicenseMatrix = Readonly<
	Record<HetArchiefIeObjectSector, Readonly<HetArchiefIeObjectLicense[]>>
>;

export type IeObjectSeo = Pick<
	HetArchiefIeObject,
	'name' | 'description' | 'thumbnailUrl' | 'maintainerSlug'
>;

export type GqlLimitedIeObject = FindAllIeObjectsByFolderIdQuery['users_folder_ie'][0];

export enum IeObjectMetadataSet {
	METADATA_LTD = 'METADATA_LTD',
	METADATA_ALL = 'METADATA_ALL',
	METADATA_ALL_WITH_ESSENCE = 'METADATA_ALL_WITH_ESSENCE',
	/**
	 * The AI-generated title and summary. Orthogonal to the tiers above rather than a level of its
	 * own: an object discloses AI metadata through a separate license, so a user can have
	 * METADATA_ALL without it, or (in theory) this without METADATA_ALL.
	 */
	METADATA_AI = 'METADATA_AI',
	EMPTY = 'EMPTY',
}

export enum IeObjectExtraUserGroupType {
	ANONYMOUS = 'ANONYMOUS',
}

export type EbucoreObjectType = 'footage' | 'program';

export interface IeObjectPages {
	pages: HetArchiefIeObjectPage[];
	mentions: Mention[];
	isCutFragment: boolean; // https://meemoo.atlassian.net/browse/ARC-3690
}

export type IeObjectForAccessCheck = Pick<
	HetArchiefIeObject,
	'schemaIdentifier' | 'licenses' | 'maintainerId' | 'sector'
>;

export type IeObjectForThumbnailOnly = Pick<
	HetArchiefIeObject,
	'thumbnailUrl' | 'schemaIdentifier' | 'licenses' | 'maintainerId' | 'sector' | 'dctermsFormat'
>;

export interface JsonWaveformData {
	version: number;
	channels: number;
	sample_rate: number;
	samples_per_pixel: number;
	bits: number;
	length: number;
	data: number[];
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
	schema_is_part_of: HetArchiefIsPartOfCollection[] | null;
	schema_keywords: string[];
	schema_license: string[] | null;
	schema_maintainer: {
		schema_identifier?: string;
		schema_name?: string;
		alt_label?: string | null; // not always available
		organization_sector?: HetArchiefIeObjectSector | null; // not always available
		// organization_type?: string | null; // should not be used, use organization_sector instead
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

export interface IeObjectsWithAggregations extends IPagination<Partial<HetArchiefIeObject>> {
	aggregations: any;
	searchTerms: { isLiteral: boolean; value: string }[];
	searchTermsParsedSuccessfully: boolean;
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
			fields: Record<AutocompleteEsField & '.sayt', string | string[]>;
			_ignored?: string[];
		}[];
	};
}

export interface Mention {
	pageNumber: number;
	pageIndex: number;
	iri: string;
	name: string;
	confidence: number;
	birthDate: number;
	birthPlace: string;
	deathDate: number;
	deathPlace: string;
	highlights: MentionHighlight[];
}

export interface MentionHighlight {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * AI-detected entities on an AV file, served by GET /ie-objects/mentions. Deliberately separate from
 * the newspaper Mention above: those are OCR highlights on a page (x/y/w/h, no time), these are
 * recognitions on a media fragment (time offsets, no coordinates). The functional analysis requires
 * the two to stay technically distinct.
 */
export enum FileMentionEntityType {
	PERSON = 'person',
	PLACE = 'place',
	ORGANIZATION = 'organization',
}

/** The only three values graph__file_has_annotation.annotation_type holds today */
export enum FileMentionAnnotationType {
	FACE = 'face',
	SPEAKER = 'speaker',
	NAMED_ENTITY = 'named-entity',
}

export interface FileMentionOccurrence {
	/** TC-in in seconds, null for annotations without a media fragment (some NER hits) */
	startTime: number | null;
	/** TC-out in seconds */
	endTime: number | null;
	confidence: number | null;
	/** Passed through as-is when it isn't one of the known values */
	annotationType: FileMentionAnnotationType | null;
	isAiGenerated: boolean;
}

export interface FileMention {
	/** wiki_id when the entity has one, else the thing iri. Stable key for the client. */
	id: string;
	/** thing iri of the first annotation in the group */
	iri: string;
	name: string;
	type: FileMentionEntityType | null;
	wikidataId: string | null;
	wikidataUrl: string | null;
	thumbnailUrl: string | null;
	occurrences: FileMentionOccurrence[];
}

export interface FileMentionsResponse {
	fileId: string;
	/** Width of the client's timeline: the full length of the AV item */
	durationSeconds: number | null;
	/** False -> the client renders the timeline non-interactively */
	hasAccessToEssence: boolean;
	mentions: FileMention[];
}
