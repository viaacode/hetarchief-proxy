import { Group } from '../users/types';

import {
	IeObject,
	IeObjectExtraUserGroupSubType,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectMetadataSet,
	IeObjectSector,
	IeObjectSectorLicenseMatrix,
} from './ie-objects.types';

export const IE_OBJECT_EXTRA_USER_SUB_GROUPS = {
	[IeObjectExtraUserGroupSubType.IS_KEY_USER]: '+isKeyUser',
	[IeObjectExtraUserGroupSubType.HAS_VISITOR_SPACE]: '+hasAccessToVisitorSpace',
	[IeObjectExtraUserGroupType.ANONYMOUS]: 'anonymous',
};

// TODO: Check if we can make a more dynamic lookup table instead of this
export const IE_OBJECT_EXTRA_USER_GROUPS = {
	[IeObjectExtraUserGroupType.ANONYMOUS]: IE_OBJECT_EXTRA_USER_SUB_GROUPS.ANONYMOUS,
	[IeObjectExtraUserGroupType.VISITOR_HAS_VISITOR_SPACE]: `${Group.VISITOR}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.HAS_VISITOR_SPACE}`,
	[IeObjectExtraUserGroupType.VISITOR_IS_KEY_USER]: `${Group.VISITOR}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.IS_KEY_USER}`,
	[IeObjectExtraUserGroupType.VISITOR_HAS_VISITOR_SPACE_IS_KEY_USER]: `${Group.VISITOR}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.HAS_VISITOR_SPACE}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.IS_KEY_USER}`,
	[IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE]: `${Group.CP_ADMIN}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.HAS_VISITOR_SPACE}`,
	[IeObjectExtraUserGroupType.CP_ADMIN_IS_KEY_USER]: `${Group.CP_ADMIN}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.IS_KEY_USER}`,
	[IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE_IS_KEY_USER]: `${Group.CP_ADMIN}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.HAS_VISITOR_SPACE}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.IS_KEY_USER}`,
	[IeObjectExtraUserGroupType.MEEMOO_ADMIN_IS_KEY_USER]: `${Group.MEEMOO_ADMIN}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.IS_KEY_USER}`,
	[IeObjectExtraUserGroupType.MEEMOO_ADMIN_HAS_VISITOR_SPACE]: `${Group.MEEMOO_ADMIN}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.HAS_VISITOR_SPACE}`,
	[IeObjectExtraUserGroupType.MEEMOO_ADMIN_HAS_VISITOR_SPACE_IS_KEY_USER]: `${Group.MEEMOO_ADMIN}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.HAS_VISITOR_SPACE}${IE_OBJECT_EXTRA_USER_SUB_GROUPS.IS_KEY_USER}`,
};

export const IE_OBJECT_LICENSES_BY_USER_GROUP: Record<string, IeObjectLicense[]> = {
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.ANONYMOUS]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
	],
	[Group.VISITOR]: [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.VISITOR_HAS_VISITOR_SPACE]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // indien toegang
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.CP_ADMIN_IS_KEY_USER]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.VISITOR_HAS_VISITOR_SPACE_IS_KEY_USER]]:
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // indien toegang
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	[Group.KIOSK_VISITOR]: [
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_CONTENT,
	],
	[Group.CP_ADMIN]: [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // indien toegang of eigen tenant
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang of eigen tenant
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.CP_ADMIN_IS_KEY_USER]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[
		IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE_IS_KEY_USER
	]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // indien toegang of eigen tenant
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang of eigen tenant
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
	[Group.MEEMOO_ADMIN]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_CONTENT,
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.MEEMOO_ADMIN_HAS_VISITOR_SPACE]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // altijd
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // altijd
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.MEEMOO_ADMIN_IS_KEY_USER]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // altijd
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // altijd
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[
		IeObjectExtraUserGroupType.MEEMOO_ADMIN_HAS_VISITOR_SPACE_IS_KEY_USER
	]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, // altijd
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // altijd
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
};

export const IE_OBJECT_METADATA_SET_BY_LICENSE: Record<IeObjectLicense, IeObjectMetadataSet> = {
	[IeObjectLicense.PUBLIEK_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,
	[IeObjectLicense.PUBLIEK_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.BEZOEKERTOOL_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.BEZOEKERTOOL_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
	[IeObjectLicense.INTRA_CP_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.INTRA_CP_CONTENT]: IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
};

export const IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR: Record<
	IeObjectSector,
	IeObjectSectorLicenseMatrix
> = {
	// object sector: user sector: licenses
	[IeObjectSector.CULTURE]: {
		[IeObjectSector.CULTURE]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.GOVERNMENT]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.REGIONAL]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.PUBLIC]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.RURAL]: [IeObjectLicense.INTRA_CP_CONTENT],
	},
	[IeObjectSector.GOVERNMENT]: {
		[IeObjectSector.CULTURE]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.GOVERNMENT]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.REGIONAL]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.PUBLIC]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.RURAL]: [IeObjectLicense.INTRA_CP_CONTENT],
	},
	[IeObjectSector.REGIONAL]: {
		[IeObjectSector.CULTURE]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.GOVERNMENT]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.REGIONAL]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.PUBLIC]: [IeObjectLicense.INTRA_CP_METADATA_ALL],
		[IeObjectSector.RURAL]: [],
	},
	[IeObjectSector.PUBLIC]: {
		[IeObjectSector.CULTURE]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.GOVERNMENT]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.REGIONAL]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.PUBLIC]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.RURAL]: [],
	},
	[IeObjectSector.RURAL]: {
		[IeObjectSector.CULTURE]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.GOVERNMENT]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.REGIONAL]: [IeObjectLicense.INTRA_CP_CONTENT],
		[IeObjectSector.PUBLIC]: [],
		[IeObjectSector.RURAL]: [],
	},
};

const IE_OBJECT_PROPS_METADATA_SET_LTD: (keyof IeObject)[] = [
	'meemooOriginalCp',
	'premisIsPartOf',
	'meemooIdentifier',
	'schemaIdentifier',
	'meemooLocalId',
	'maintainerId',
	'name',
	'series',
	'program',
	'alternativeName',
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
	'meemoofilmBase',
	'meemoofilmColor',
	'meemoofilmCaption', // BESTAAT NOG NIET
	'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
	'ebucoreIsMediaFragmentOf',
	'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
	'licenses',
];
const IE_OBJECT_PROPS_METADATA_SET_ALL: (keyof IeObject)[] = [
	'premisIdentifier',
	'ebucoreObjectType',
	'serviceProvider', // BESTAAT NOG NIET
	'abstract',
	'transcript', // BESTAAT NOG NIET
	'caption', // BESTAAT NOG NIET
	'meemooDescriptionProgramme',
	'meemooDescriptionCast',
	'spatial',
	'temporal',
	'categorie', // BESTAAT NOG NIET
	'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET
];
const IE_OBJECT_PROPS_METADATA_SET_ESSENCE: (keyof IeObject)[] = [
	'thumbnailUrl',
	'representations',
];

export const IE_OBJECT_PROPS_BY_METADATA_SET: Record<string, string[]> = {
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
