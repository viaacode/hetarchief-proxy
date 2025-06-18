import { isEmpty, uniq } from 'lodash';

import {
	AutocompleteEsField,
	AutocompleteField,
	type IeObject,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectMetadataSet,
	IeObjectSector,
	type IeObjectSectorLicenseMatrix,
} from './ie-objects.types';

import { GroupId } from '~modules/users/types';

export const IE_OBJECT_INTRA_CP_LICENSES: Readonly<IeObjectLicense[]> = [
	IeObjectLicense.INTRA_CP_CONTENT,
	IeObjectLicense.INTRA_CP_METADATA_ALL,
	IeObjectLicense.INTRA_CP_METADATA_LTD,
];

export const IE_OBJECT_PUBLIC_LICENSES: Readonly<IeObjectLicense[]> = [
	IeObjectLicense.PUBLIEK_METADATA_LTD,
	IeObjectLicense.PUBLIEK_METADATA_ALL,
	IeObjectLicense.PUBLIEK_CONTENT,
];

export const IE_OBJECT_VISITOR_LICENSES: Readonly<IeObjectLicense[]> = [
	IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
	IeObjectLicense.BEZOEKERTOOL_CONTENT,
];

export const IE_OBJECT_LICENSES_BY_USER_GROUP: Readonly<
	Record<string, Readonly<IeObjectLicense[]>>
> = {
	[IeObjectExtraUserGroupType.ANONYMOUS]: [...IE_OBJECT_PUBLIC_LICENSES],
	[GroupId.VISITOR]: [...IE_OBJECT_PUBLIC_LICENSES],
	[GroupId.KIOSK_VISITOR]: [],
	[GroupId.CP_ADMIN]: [...IE_OBJECT_PUBLIC_LICENSES],
	[GroupId.MEEMOO_ADMIN]: [...IE_OBJECT_PUBLIC_LICENSES, ...IE_OBJECT_VISITOR_LICENSES],
};

export const IE_OBJECT_METADATA_SET_BY_LICENSE: Readonly<
	Record<IeObjectLicense, Readonly<IeObjectMetadataSet> | null>
> = {
	[IeObjectLicense.PUBLIEK_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,
	[IeObjectLicense.PUBLIEK_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.PUBLIEK_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[IeObjectLicense.BEZOEKERTOOL_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.BEZOEKERTOOL_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[IeObjectLicense.INTRA_CP_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.INTRA_CP_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[IeObjectLicense.INTRA_CP_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,

	[IeObjectLicense.COPYRIGHT_UNDETERMINED]: IeObjectMetadataSet.EMPTY,
	[IeObjectLicense.PUBLIC_DOMAIN]: IeObjectMetadataSet.EMPTY,
};

export const IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR: Readonly<
	Record<IeObjectSector, Readonly<IeObjectSectorLicenseMatrix>>
> = {
	// user sector => object sector => accessible licenses
	[IeObjectSector.CULTURE]: {
		[IeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.RURAL]: IE_OBJECT_INTRA_CP_LICENSES,
	},
	[IeObjectSector.GOVERNMENT]: {
		[IeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.RURAL]: IE_OBJECT_INTRA_CP_LICENSES,
	},
	[IeObjectSector.REGIONAL]: {
		[IeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.PUBLIC]: [
			IeObjectLicense.INTRA_CP_METADATA_LTD,
			IeObjectLicense.INTRA_CP_METADATA_ALL,
		],
		[IeObjectSector.RURAL]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
	},
	[IeObjectSector.PUBLIC]: {
		[IeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.RURAL]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
	},
	[IeObjectSector.RURAL]: {
		[IeObjectSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeObjectSector.PUBLIC]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
		[IeObjectSector.RURAL]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
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
];
const IE_OBJECT_PROPS_METADATA_SET_ESSENCE: Readonly<(keyof IeObject)[]> = [
	'thumbnailUrl',
	'pages',
	'mentions',
	'transcript',
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
