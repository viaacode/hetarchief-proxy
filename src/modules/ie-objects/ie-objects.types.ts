import type { IPagination } from '@studiohyperdrive/pagination';

import type { FindAllIeObjectsByFolderIdQuery } from '~generated/graphql-db-types-hetarchief';

import type {
	HetArchiefIeObjectAccessThrough,
	HetArchiefIeObjectFile,
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectPage,
	HetArchiefIeObjectRepresentation,
	HetArchiefIeObjectRightsInfo,
	HetArchiefIeObjectSector,
	HetArchiefIeObjectTheme,
	HetArchiefIeObjectType,
	HetArchiefIsPartOfCollection,
} from '@viaa/avo2-types';

export type IeObjectSectorLicenseMatrix = Readonly<
	Record<HetArchiefIeObjectSector, Readonly<HetArchiefIeObjectLicense[]>>
>;

export type IeObjectSeo = Pick<
	IeObject,
	'name' | 'description' | 'thumbnailUrl' | 'maintainerSlug'
>;

export type GqlLimitedIeObject = FindAllIeObjectsByFolderIdQuery['users_folder_ie'][0];

export enum IeObjectMetadataSet {
	METADATA_LTD = 'METADATA_LTD',
	METADATA_ALL = 'METADATA_ALL',
	METADATA_ALL_WITH_ESSENCE = 'METADATA_ALL_WITH_ESSENCE',
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

/**
 * This info now lives in another place and no longer resides under is_part_of
 * alternatief → table: graph.schema_alternate_name, column: schema_alternate_name
 * serienummer → table: graph.collection, column: schema_season_number
 * seizoennummer → table: graph.collection, column: schema_season_number
 * registratie → not available for now
 * stuk → not available for now
 */

/**
 * A theme this object belongs to, as shown in the metadata panel of the detail page.
 * See ARC-3826. The name and content page path are exposed in both languages, the
 * client picks the one matching the UI language.
 */

export interface IeObject {
	dctermsAvailable: string;
	dctermsFormat: HetArchiefIeObjectType;
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
	licenses: HetArchiefIeObjectLicense[];
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
	sector?: HetArchiefIeObjectSector;
	accessThrough?: HetArchiefIeObjectAccessThrough[];
	/**
	 * Whether the current user may see/play this object's essence. Computed in
	 * limitAccessToObjectDetails from the licenses the user can access, so it is independent of
	 * whether a thumbnail file exists. Clients use this instead of checking thumbnailUrl.
	 */
	hasAccessToEssence?: boolean;
	ebucoreObjectType?: string | null;
	meemoofilmContainsEmbeddedCaption?: boolean;
	contributor?: any;
	copyrightHolder?: string;
	premisIsPartOf?: string | null;
	isPartOf?: HetArchiefIsPartOfCollection[];
	numberOfPages?: number;
	pageNumber?: number;
	meemooDescriptionCast?: string;
	maintainerFormUrl?: string | null;
	maintainerDescription?: string;
	maintainerSiteUrl?: string;
	meemooLocalId?: string;
	providerPurl?: string | null;
	meemooOriginalCp?: string;
	durationInSeconds?: number;
	copyrightNotice?: string;
	meemooMediaObjectId?: string;
	abrahamInfo?: {
		id: string;
		uri: string;
	};
	synopsis: string;
	collectionName?: string;
	collectionId?: string;
	collectionSeasonNumber?: string;
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
	digitizationDate?: string;
	children?: number;
	rightsInfo?: HetArchiefIeObjectRightsInfo;
	themes?: HetArchiefIeObjectTheme[];

	// ESSENCE
	thumbnailUrl: string;
	transcript?: string;
	pages?: HetArchiefIeObjectPage[];
	mentions?: Mention[];
}

export type IeObjectForAccessCheck = Pick<
	IeObject,
	'schemaIdentifier' | 'licenses' | 'maintainerId' | 'sector'
>;

export type IeObjectForThumbnailOnly = Pick<
	IeObject,
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

export interface IeObjectPlayableDisplayData {
	schemaIdentifier: string;
	name: string;
	thumbnailUrl: string | null;
	/** Whether the current user may see/play this object's essence. See IeObject.hasAccessToEssence */
	hasAccessToEssence: boolean;
	dctermsFormat: HetArchiefIeObjectType;
	maintainerId: string;
	maintainerName: string;
	maintainerLogo: string | null;
	maintainerOverlay: boolean;
	/** Audio/video objects only: ready-to-play, signed URL for the file to feed directly into a player, or null if none is playable/accessible */
	playableUrl?: string | null;
	/** Audio/video objects only: mime type of the file playableUrl points to, so the client knows how to handle it */
	mimeType?: string | null;
	/** Audio/video objects only: peak/waveform sample data, for audio and audio fragments only - just the sample array, the rest of the peak file's metadata isn't used. Additive data for the waveform overlay, not a substitute for playableUrl */
	peakfileData?: number[] | null;
	/** Non audio/video objects only (e.g. newspapers): self-contained base64 data uri of the IIIF detail image, or null if none is accessible/couldn't be resolved. Use this directly as an <img src> */
	newspaperImage?: string | null;
	snipPoint?: {
		start?: number;
		end?: number;
	};
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

export interface IeObjectsWithAggregations extends IPagination<Partial<IeObject>> {
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
