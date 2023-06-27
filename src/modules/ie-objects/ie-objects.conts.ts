import {
	IeObject,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectMetadataSet,
	IeObjectSectorLicenseMatrix,
	IeSector,
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
	Record<IeObjectLicense, Readonly<IeObjectMetadataSet>>
> = {
	[IeObjectLicense.PUBLIEK_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,
	[IeObjectLicense.PUBLIEK_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.BEZOEKERTOOL_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.BEZOEKERTOOL_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[IeObjectLicense.INTRA_CP_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.INTRA_CP_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[IeObjectLicense.INTRA_CP_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,
};

export const IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR: Readonly<
	Record<IeSector, Readonly<IeObjectSectorLicenseMatrix>>
> = {
	// user sector => object sector => accessible licenses
	[IeSector.CULTURE]: {
		[IeSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.RURAL]: IE_OBJECT_INTRA_CP_LICENSES,
	},
	[IeSector.GOVERNMENT]: {
		[IeSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.RURAL]: IE_OBJECT_INTRA_CP_LICENSES,
	},
	[IeSector.REGIONAL]: {
		[IeSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.PUBLIC]: [
			IeObjectLicense.INTRA_CP_METADATA_LTD,
			IeObjectLicense.INTRA_CP_METADATA_ALL,
		],
		[IeSector.RURAL]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
	},
	[IeSector.PUBLIC]: {
		[IeSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.PUBLIC]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.RURAL]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
	},
	[IeSector.RURAL]: {
		[IeSector.CULTURE]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.GOVERNMENT]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.REGIONAL]: IE_OBJECT_INTRA_CP_LICENSES,
		[IeSector.PUBLIC]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
		[IeSector.RURAL]: [IeObjectLicense.INTRA_CP_METADATA_LTD],
	},
};

const IE_OBJECT_PROPS_METADATA_SET_LTD: Readonly<(keyof IeObject)[]> = [
	'meemooOriginalCp',
	'premisIsPartOf',
	'meemooIdentifier',
	'schemaIdentifier',
	'meemooLocalId',
	'maintainerId',
	'maintainerName', // Will be replaced by the slug in the future: https://meemoo.atlassian.net/browse/ARC-1372
	'maintainerSlug',
	'maintainerLogo',
	'maintainerDescription',
	'maintainerSiteUrl',
	'maintainerFormUrl',
	'name',
	'isPartOf',
	'dctermsFormat',
	'dctermsMedium',
	'duration',
	'dateCreated',
	'dateCreatedLowerBound',
	'datePublished',
	'creator',
	'description',
	'genre',
	'keywords',
	'inLanguage',
	'meemoofilmBase',
	'meemoofilmColor',
	'ebucoreIsMediaFragmentOf',
	'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
	'licenses',
	'meemoofilmImageOrSound',
	'languageSubtitles',
];
const IE_OBJECT_PROPS_METADATA_SET_ALL: Readonly<(keyof IeObject)[]> = [
	'premisIdentifier',
	'ebucoreObjectType',
	'abstract',
	'transcript', // BESTAAT NOG NIET
	'caption', // BESTAAT NOG NIET
	'meemooDescriptionProgramme',
	'meemooDescriptionCast',
	'spatial',
	'temporal',
	'meemooMediaObjectId',
	'publisher',
];
const IE_OBJECT_PROPS_METADATA_SET_ESSENCE: Readonly<(keyof IeObject)[]> = [
	'thumbnailUrl',
	'representations',
];

export const IE_OBJECT_PROPS_BY_METADATA_SET: Readonly<Record<string, string[]>> = {
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
	'premisIsPartOf',
	'schemaIdentifier',
	'meemooIdentifier',
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
	'caption',
	'meemooDescriptionProgramme',
	'meemooDescriptionCast',
	'genre',
	'spatial',
	'temporal',
	'keywords',
	'inLanguage',
	// 'meemooDescriptionCategory', // Still has to be added to the graphQl db, might have to change to meemooDescriptionCategorie
	'dctermsMedium',
	'dctermsFormat',
	'meemoofilmColor',
	'meemoofilmBase',
	'meemoofilmImageOrSound',
	'meemoofilmContainsEmbeddedCaption',
	'languageSubtitles',
	'ebucoreIsMediaFragmentOf',
];
