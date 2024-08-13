import {
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
	'issueNumber',
	'meemooOriginalCp',
	'schemaIdentifier',
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
	'licenses',
	'accessThrough',
	'carrierDate',
	'numberOfPages',
	'abrahamInfo',
	'spatial',
	'temporal',
	'newspaperPublisher',
	'copyrightHolder',
];
const IE_OBJECT_PROPS_METADATA_SET_ALL: Readonly<(keyof IeObject)[]> = [
	'premisIdentifier',
	'ebucoreObjectType',
	'abstract',
	'transcript',
	'meemooDescriptionCast',
	'meemooMediaObjectId',
	'publisher',
	'abstract',
	'transcript',
	'alternativeTitle',
	'preceededBy',
	'succeededBy',
	'width',
	'height',
	'synopsis',
];
const IE_OBJECT_PROPS_METADATA_SET_ESSENCE: Readonly<(keyof IeObject)[]> = [
	'thumbnailUrl',
	'pageRepresentations',
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
	'meemooOriginalCp',
	'schemaIdentifier',
	'meemooLocalId',
	'meemooMediaObjectId',
	'maintainerId',
	'maintainerName',
	'name',
	'isPartOf',
	'ebucoreObjectType',
	'duration',
	'dateCreated',
	'datePublished',
	'creator',
	'publisher',
	'description',
	'abstract',
	'transcript',
	'genre',
	'spatial',
	'temporal',
	'keywords',
	'inLanguage',
	'dctermsMedium',
	'dctermsFormat',
];
