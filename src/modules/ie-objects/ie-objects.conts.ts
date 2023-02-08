import { Group } from '../users/types';

import {
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectMetadataSet,
	IeObjectSector,
	IeObjectSectorLicenseMatrix,
} from './ie-objects.types';

export const IE_OBJECT_EXTRA_USER_GROUPS = {
	[IeObjectExtraUserGroupType.ANONYMOUS]: 'anonymous',
	[IeObjectExtraUserGroupType.HAS_VISITOR_SPACE]: '+hasAccessToVisitorSpace',
	[IeObjectExtraUserGroupType.IS_KEY_USER]: '+isKeyUser',
	[IeObjectExtraUserGroupType.VISITOR_HAS_VISITOR_SPACE]: `${Group.VISITOR}+hasAccessToVisitorSpace`,
	[IeObjectExtraUserGroupType.VISITOR_IS_KEY_USER]: `${Group.VISITOR}+isKeyUser`,
	[IeObjectExtraUserGroupType.VISITOR_HAS_VISITOR_SPACE_IS_KEY_USER]: `${Group.VISITOR}+hasAccessToVisitorSpace+isKeyUser`,
	[IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE]: `${Group.CP_ADMIN}+hasAccessToVisitorSpace`,
	[IeObjectExtraUserGroupType.CP_ADMIN_IS_KEY_USER]: `${Group.CP_ADMIN}+isKeyUser`,
	[IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE_IS_KEY_USER]: `${Group.CP_ADMIN}+hasAccessToVisitorSpace+isKeyUser`,
	[IeObjectExtraUserGroupType.MEEMOO_ADMIN_IS_KEY_USER]: `${Group.MEEMOO_ADMIN}+isKeyUser`,
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
		IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang
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
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	[Group.KIOSK_VISITOR]: [
		IeObjectLicense.BEZOEKERTOOL_METADATA,
		IeObjectLicense.BEZOEKERTOOL_CONTENT,
	],
	[Group.CP_ADMIN]: [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.CP_ADMIN_HAS_VISITOR_SPACE]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang of eigen tenant
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
		IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang of eigen tenant
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang of eigen tenant
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
	[Group.MEEMOO_ADMIN]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA,
		IeObjectLicense.BEZOEKERTOOL_CONTENT,
	],
	[IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.MEEMOO_ADMIN_IS_KEY_USER]]: [
		IeObjectLicense.PUBLIEK_METADATA_LTD,
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.BEZOEKERTOOL_METADATA, // altijd
		IeObjectLicense.BEZOEKERTOOL_CONTENT, // altijd
		IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
		IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
	],
};

export const IE_OBJECT_METADATA_SET_BY_LICENSE: Record<IeObjectLicense, IeObjectMetadataSet> = {
	[IeObjectLicense.PUBLIEK_METADATA_LTD]: IeObjectMetadataSet.METADATA_LTD,
	[IeObjectLicense.PUBLIEK_METADATA_ALL]: IeObjectMetadataSet.METADATA_ALL,
	[IeObjectLicense.BEZOEKERTOOL_METADATA]: IeObjectMetadataSet.METADATA_ALL,
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

export const IE_OBJECT_PROPS_BY_METADATA_SET: Record<string, string[]> = {
	[IeObjectMetadataSet.METADATA_LTD]: [
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
	],
	[IeObjectMetadataSet.METADATA_ALL]: [
		'meemooOriginalCp',
		'premisIsPartOf',
		'meemooIdentifier',
		'schemaIdentifier',
		'meemooLocalId',
		'premisIdentifier',
		'maintainerId',
		'name',
		'series',
		'program',
		'alternativeName',
		'dctermsFormat',
		'dctermsMedium',
		'ebucoreObjectType',
		'duration',
		'serviceProvider', // BESTAAT NOG NIET
		'dateCreated',
		'datePublished',
		'creator',
		'publisher',
		'description',
		'abstract',
		'transcript', // BESTAAT NOG NIET
		'caption', // BESTAAT NOG
		'meemooDescriptionProgramme',
		'meemooDescriptionCast',
		'genre',
		'spatial',
		'temporal',
		'keywords',
		'inLanguage',
		'categorie', // BESTAAT NOG NIET
		'meemoofilmBase',
		'meemoofilmColor',
		'meemoofilmCaption', // BESTAAT NOG NIET
		'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
		'ebucoreIsMediaFragmentOf',
		'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
		'licenses',
	],
	[IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE]: [
		'thumbnailUrl',
		'representations',
		'meemooOriginalCp',
		'premisIsPartOf',
		'meemooIdentifier',
		'schemaIdentifier',
		'meemooLocalId',
		'premisIdentifier',
		'maintainerId',
		'name',
		'series',
		'program',
		'alternativeName',
		'dctermsFormat',
		'dctermsMedium',
		'ebucoreObjectType',
		'duration',
		'serviceProvider', // BESTAAT NOG NIET
		'dateCreated',
		'datePublished',
		'creator',
		'publisher',
		'description',
		'abstract',
		'transcript', // BESTAAT NOG NIET
		'caption', // BESTAAT NOG NIET
		'meemooDescriptionProgramme',
		'meemooDescriptionCast',
		'genre',
		'spatial',
		'temporal',
		'keywords',
		'inLanguage',
		'categorie', // BESTAAT NOG NIET
		'meemoofilmBase',
		'meemoofilmColor',
		'meemoofilmCaption', // BESTAAT NOG NIET
		'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
		'ebucoreIsMediaFragmentOf',
		'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
		'licenses',
	],
};
