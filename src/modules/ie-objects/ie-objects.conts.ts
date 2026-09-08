import { PermissionName } from '@viaa/avo2-types';
import { isEmpty, uniq } from 'lodash';

import {
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectSector,
	HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import {
	AutocompleteEsField,
	AutocompleteField,
	type IeObject,
	IeObjectExtraUserGroupType,
	IeObjectMetadataSet,
	type IeObjectSectorLicenseMatrix,
} from './ie-objects.types';

import { GroupId } from '~modules/users/types';

export const IE_OBJECT_AV_TYPES: Readonly<HetArchiefIeObjectType[]> = [
	HetArchiefIeObjectType.AUDIO,
	HetArchiefIeObjectType.AUDIO_FRAGMENT,
	HetArchiefIeObjectType.FILM,
	HetArchiefIeObjectType.VIDEO,
	HetArchiefIeObjectType.VIDEO_FRAGMENT,
];

// Mirrors FLOWPLAYER_VIDEO_FORMATS/FLOWPLAYER_AUDIO_FORMATS/JSON_FORMATS in the hetarchief-client
// repo (src/modules/ie-objects/ie-objects.consts.tsx), which picks the first file in a
// representation matching these mime types as the file to play/visualize.
export const FLOWPLAYER_VIDEO_FORMATS: Readonly<string[]> = [
	'video/mp4',
	'video/ogv',
	'video/webm',
	'video/m3u8',
	'application/vnd.apple.mpegurl',
];
export const FLOWPLAYER_AUDIO_FORMATS: Readonly<string[]> = ['audio/mp4', 'audio/mpeg'];
export const FLOWPLAYER_FORMATS: Readonly<string[]> = [
	...FLOWPLAYER_VIDEO_FORMATS,
	...FLOWPLAYER_AUDIO_FORMATS,
];
export const JSON_FORMATS: Readonly<string[]> = ['application/json'];
// Mirrors IMAGE_API_FORMATS in the hetarchief-client repo (src/modules/ie-objects/ie-objects.consts.tsx)
export const IMAGE_API_FORMATS: Readonly<string[]> = ['image/jph', 'image/jp2'];

export const IE_OBJECT_INTRA_CP_LICENSES: Readonly<HetArchiefIeObjectLicense[]> = [
	HetArchiefIeObjectLicense.INTRA_CP_CONTENT,
	HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
	HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD,
];

export const IE_OBJECT_PUBLIC_LICENSES: Readonly<HetArchiefIeObjectLicense[]> = [
	HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
	HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
	HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
];

export const IE_OBJECT_VISITOR_LICENSES: Readonly<HetArchiefIeObjectLicense[]> = [
	HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
	HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT,
];

export const IE_OBJECT_LICENSES_BY_USER_GROUP: Readonly<
	Record<string, Readonly<HetArchiefIeObjectLicense[]>>
> = {
	[IeObjectExtraUserGroupType.ANONYMOUS]: [...IE_OBJECT_PUBLIC_LICENSES],
	[GroupId.VISITOR]: [...IE_OBJECT_PUBLIC_LICENSES],
	[GroupId.KIOSK_VISITOR]: [],
	[GroupId.CP_ADMIN]: [...IE_OBJECT_PUBLIC_LICENSES],
	[GroupId.MEEMOO_ADMIN]: [...IE_OBJECT_PUBLIC_LICENSES, ...IE_OBJECT_VISITOR_LICENSES],
};

export const IE_OBJECT_METADATA_SET_BY_LICENSE: Readonly<
	Record<HetArchiefIeObjectLicense, Readonly<IeObjectMetadataSet> | null>
> = {
	[HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,
	[HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[HetArchiefIeObjectLicense.PUBLIEK_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[HetArchiefIeObjectLicense.INTRA_CP_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,

	[HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED]: IeObjectMetadataSet.EMPTY,
	[HetArchiefIeObjectLicense.PUBLIC_DOMAIN]: IeObjectMetadataSet.EMPTY,
};

export const IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR: Readonly<
	Record<HetArchiefIeObjectSector, Readonly<IeObjectSectorLicenseMatrix>>
> = {
	// user sector => object sector => accessible licenses
	[HetArchiefIeObjectSector.CULTURE]: {
		[HetArchiefIeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.RURAL]: IE_OBJECT_INTRA_CP_LICENSES,
	},
	[HetArchiefIeObjectSector.GOVERNMENT]: {
		[HetArchiefIeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.RURAL]: IE_OBJECT_INTRA_CP_LICENSES,
	},
	[HetArchiefIeObjectSector.REGIONAL]: {
		[HetArchiefIeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.PUBLIC]: [
			HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD,
			HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
		],
		[HetArchiefIeObjectSector.RURAL]: [HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD],
	},
	[HetArchiefIeObjectSector.PUBLIC]: {
		[HetArchiefIeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.RURAL]: [HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD],
	},
	[HetArchiefIeObjectSector.RURAL]: {
		[HetArchiefIeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[HetArchiefIeObjectSector.PUBLIC]: [HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD],
		[HetArchiefIeObjectSector.RURAL]: [HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD],
	},
};

const IE_OBJECT_PROPS_METADATA_SET_LTD: Readonly<(keyof IeObject)[]> = [
	'name',
	'collectionName',
	'collectionId',
	'issueNumber',
	'meemooOriginalCp',
	'iri',
	'schemaIdentifier',
	'premisIsPartOf',
	'fragmentId',
	'meemooLocalId',
	'providerPurl',
	'maintainerId',
	'maintainerName', // Will be replaced by the slug in the future: https://meemoo.atlassian.net/browse/ARC-1372
	'maintainerSlug',
	'maintainerLogo',
	'maintainerDescription',
	'maintainerSiteUrl',
	'maintainerFormUrl',
	'maintainerOverlay',
	'maintainerIiifAgreement',
	'isPartOf',
	'dctermsFormat',
	'dctermsMedium',
	'duration',
	'dateCreated',
	'datePublished',
	'creator',
	'description',
	'keywords',
	'inLanguage',
	'licenses',
	'accessThrough',
	'carrierDate',
	'numberOfPages',
	'pageNumber',
	'abrahamInfo',
	'spatial',
	'temporal',
	'newspaperPublisher',
	'copyrightHolder',
	'children',
];
const IE_OBJECT_PROPS_METADATA_SET_ALL: Readonly<(keyof IeObject)[]> = [
	'premisIdentifier',
	'ebucoreObjectType',
	'abstract',
	'meemooDescriptionCast',
	'meemooMediaObjectId',
	'publisher',
	'alternativeTitle',
	'preceededBy',
	'succeededBy',
	'genre', // Categorie
	'width',
	'height',
	'digitizationDate',
	'bibframeProductionMethod',
	'bibframeEdition',
	'synopsis',
	// Themes are only ever linked to publicly disclosed objects. The client additionally hides the
	// section for kiosk users and for objects without a VIAA-PUBLIEK-CONTENT license. See ARC-3826.
	'themes',
];
const IE_OBJECT_PROPS_METADATA_SET_ESSENCE: Readonly<(keyof IeObject)[]> = [
	'thumbnailUrl',
	'pages',
	'mentions',
	'transcript',
	'rightsInfo',
];

export const IE_OBJECT_PROPS_BY_METADATA_SET: Readonly<Record<string, string[]>> = {
	[IeObjectMetadataSet.EMPTY]: [],
	[IeObjectMetadataSet.METADATA_LTD]: [...IE_OBJECT_PROPS_METADATA_SET_LTD],
	[IeObjectMetadataSet.METADATA_ALL]: [
		...IE_OBJECT_PROPS_METADATA_SET_LTD,
		...IE_OBJECT_PROPS_METADATA_SET_ALL,
	],
	[IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE]: [
		...IE_OBJECT_PROPS_METADATA_SET_LTD,
		...IE_OBJECT_PROPS_METADATA_SET_ALL,
		...IE_OBJECT_PROPS_METADATA_SET_ESSENCE,
	],
};

export const IE_OBJECT_PROPS_METADATA_EXPORT: Readonly<(keyof IeObject)[]> = [
	// LTD
	'schemaIdentifier',
	'meemooOriginalCp',
	'meemooLocalId',
	'meemooMediaObjectId',
	'fragmentId',
	'premisIdentifier',
	'maintainerId',
	'maintainerName',
	'name',
	'collectionName',
	'issueNumber',
	'isPartOf',
	'dctermsFormat',
	'dctermsMedium',
	'duration',
	'dateCreated',
	'datePublished',
	'creator',
	'description',
	'genre',
	'keywords',
	'inLanguage',
	'carrierDate',
	'numberOfPages',
	'abrahamInfo',
	'spatial',
	'temporal',
	'newspaperPublisher',
	'copyrightHolder',
	'pageNumber',

	// ALL
	'width',
	'height',
	'synopsis',
	'preceededBy',
	'succeededBy',
	'alternativeTitle',
	'publisher',
	'abstract',
	'ebucoreObjectType',
	'meemooDescriptionCast',

	// ESSENCE
	'transcript',
];

export type XmlNodeElement = {
	type: 'element';
	name: string;
	elements?: XmlNode[];
	attributes?: Record<string, string>;
};

export type XmlNodeText = {
	type: 'text';
	text: string;
};

export type XmlNode = XmlNodeElement | XmlNodeText;

type XmlNodeFactory = (value: any) => XmlNodeElement[];

function getXmlTextValue(value: any): XmlNode[] {
	if (isEmpty(value)) {
		return [];
	}
	if (typeof value === 'string') {
		return [
			{
				type: 'text',
				text: value,
			},
		];
	}
	return [
		{
			type: 'text',
			text: JSON.stringify(value),
		},
	];
}

function getArrayXmlValue(name: string, values: string[]): XmlNodeElement[] {
	return uniq(values || []).flatMap((value: string) => {
		if (Array.isArray(value)) {
			return getArrayXmlValue(name, value);
		}
		return [
			{
				type: 'element',
				name,
				elements: getXmlTextValue(value),
			},
		];
	});
}

export const IE_OBJECT_PROPERTY_TO_DUBLIN_CORE: Record<string, XmlNodeFactory> = {
	schemaIdentifier: (value: string) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'PID' },
		},
	],
	meemooOriginalCp: (value) => [
		{
			type: 'element',
			name: 'dc:source',
			elements: getXmlTextValue(value),
		},
	],
	meemooLocalId: (value) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'meemoo local identifier' },
		},
	],
	meemooMediaObjectId: (value) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'meemoo media object id' },
		},
	],
	fragmentId: (value) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'Fragment ID' },
		},
	],
	premisIdentifier: (value) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'premis identifier' },
		},
	],
	maintainerId: (value) => [
		{
			type: 'element',
			name: 'dc:contributor',
			elements: getXmlTextValue(value),
			attributes: { note: 'Maintainer ID' },
		},
	],
	maintainerName: (value) => [
		{
			type: 'element',
			name: 'dc:contributor',
			elements: getXmlTextValue(value),
		},
	],
	name: (value) => [
		{
			type: 'element',
			name: 'dc:title',
			elements: getXmlTextValue(value),
		},
	],
	isPartOf: (value) => [
		{
			type: 'element',
			name: 'dcterms:isPartOf',
			elements: getXmlTextValue(value?.[0]?.iri),
			attributes: { note: 'Collection id' },
		},
	],
	collectionName: (value) => [
		{
			type: 'element',
			name: 'dcterms:isPartOf',
			elements: getXmlTextValue(value),
			attributes: { note: 'Collection name' },
		},
	],
	issueNumber: (value) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'Issue number' },
		},
	],
	dctermsFormat: (value) => [
		{
			type: 'element',
			name: 'dc:format',
			elements: getXmlTextValue(value),
		},
	],
	dctermsMedium: (value) => [
		{
			type: 'element',
			name: 'dc:format',
			elements: getXmlTextValue(value),
			attributes: { note: 'Medium' },
		},
	],
	duration: (value) => [
		{
			type: 'element',
			name: 'dcterms:extent',
			elements: getXmlTextValue(value),
			attributes: { note: 'Duration' },
		},
	],
	dateCreated: (value) => [
		{
			type: 'element',
			name: 'dcterms:created',
			elements: getXmlTextValue(value),
		},
	],
	datePublished: (value) => [
		{
			type: 'element',
			name: 'dcterms:issued',
			elements: getXmlTextValue(value),
		},
	],
	creator: (value) => [
		{
			type: 'element',
			name: 'dc:creator',
			elements: getXmlTextValue(value),
		},
	],
	description: (value) => [
		{
			type: 'element',
			name: 'dc:description',
			elements: getXmlTextValue(value),
		},
	],
	genre: (value) => getArrayXmlValue('dc:type', value),
	keywords: (value) => getArrayXmlValue('dc:subject', value),
	inLanguage: (value) => getArrayXmlValue('dc:language', value),
	carrierDate: (value) => [
		{
			type: 'element',
			name: 'dcterms:available',
			elements: getXmlTextValue(value),
		},
	],
	numberOfPages: (value) => [
		{
			type: 'element',
			name: 'dcterms:extent',
			elements: getXmlTextValue(value),
			attributes: { note: 'Number of pages' },
		},
	],
	abrahamInfo: (value: IeObject['abrahamInfo']) => {
		return [
			{
				type: 'element',
				name: 'dc:identifier',
				elements: getXmlTextValue(value?.id),
				attributes: { note: 'Abraham id' },
			},
			{
				type: 'element',
				name: 'dc:identifier',
				elements: getXmlTextValue(value?.uri),
				attributes: { note: 'Abraham uri' },
			},
		];
	},
	spatial: (value) => [
		{
			type: 'element',
			name: 'dc:coverage',
			elements: getXmlTextValue(value),
		},
	],
	temporal: (value) => [
		{
			type: 'element',
			name: 'dc:coverage',
			elements: getXmlTextValue(value),
		},
	],
	newspaperPublisher: (value) => [
		{
			type: 'element',
			name: 'dc:publisher',
			elements: getXmlTextValue(value),
		},
	],
	copyrightHolder: (value) => [
		{
			type: 'element',
			name: 'dc:rights',
			elements: getXmlTextValue(value),
		},
	],
	width: (value) => [
		{
			type: 'element',
			name: 'dcterms:extent',
			elements: getXmlTextValue(value),
			attributes: { note: 'Width' },
		},
	],
	height: (value) => [
		{
			type: 'element',
			name: 'dcterms:extent',
			elements: getXmlTextValue(value),
			attributes: { note: 'Height' },
		},
	],
	synopsis: (value) => [
		{
			type: 'element',
			name: 'dc:description',
			elements: getXmlTextValue(value),
			attributes: { note: 'Synopsis' },
		},
	],
	preceededBy: (value) => [
		{
			type: 'element',
			name: 'ex:previousItem',
			elements: getXmlTextValue(value),
		},
	],
	succeededBy: (value) => [
		{
			type: 'element',
			name: 'ex:nextItem',
			elements: getXmlTextValue(value),
		},
	],
	alternativeTitle: (value) => [
		{
			type: 'element',
			name: 'dc:title',
			elements: getXmlTextValue(value),
			attributes: { note: 'Alternative Title' },
		},
	],
	publisher: (value) => getArrayXmlValue('dc:publisher', value),
	abstract: (value) => [
		{
			type: 'element',
			name: 'dcterms:abstract',
			elements: getXmlTextValue(value),
		},
	],
	transcript: (value) => [
		{
			type: 'element',
			name: 'dc:description',
			elements: getXmlTextValue(value),
			attributes: { note: 'Transcript' },
		},
	],
	ebucoreObjectType: (value) => [
		{
			type: 'element',
			name: 'dc:type',
			elements: getXmlTextValue(value),
		},
	],
	meemooDescriptionCast: (value) => [
		{
			type: 'element',
			name: 'dc:description',
			elements: getXmlTextValue(value),
			attributes: { note: 'Cast description' },
		},
	],
	pageNumber: (value) => [
		{
			type: 'element',
			name: 'dc:extend',
			elements: getXmlTextValue(value),
			attributes: { note: 'Page number' },
		},
	],

	// Computed variables
	permalink: (value) => [
		{
			type: 'element',
			name: 'dc:identifier',
			elements: getXmlTextValue(value),
			attributes: { note: 'Permalink' },
		},
	],
	rightsStatus: (value) => [
		{
			type: 'element',
			name: 'dc:rights',
			elements: getXmlTextValue(value),
		},
	],
};

export const AUTOCOMPLETE_FIELD_TO_ES_FIELD_NAME: Record<AutocompleteField, string> = {
	[AutocompleteField.creator]: AutocompleteEsField.creator,
	[AutocompleteField.locationCreated]: AutocompleteEsField.locationCreated,
	[AutocompleteField.newspaperSeriesName]: AutocompleteEsField.newspaperSeriesName,
	[AutocompleteField.mentions]: AutocompleteEsField.mentions,
};

export enum ERROR_CODE {
	USER_NO_ACCESS_TO_IE_OBJECT = 'USER_NO_ACCESS_TO_IE_OBJECT',
}

/**
 * Who may have the playable-display-data endpoint resolve objects that were passed in the request
 * body instead of read from a saved content block.
 *
 * Those objects carry their own snippet cuepoints, so honouring them means trusting the caller
 * with a cut of an object - acceptable only for someone who could save exactly that block in the
 * content page editor a second later.
 */
export const PLAYABLE_DISPLAY_DATA_UNSAVED_OBJECTS_PERMISSIONS: PermissionName[] = [
	PermissionName.CREATE_CONTENT_PAGES,
	PermissionName.EDIT_ANY_CONTENT_PAGES,
	PermissionName.EDIT_OWN_CONTENT_PAGES,
];
