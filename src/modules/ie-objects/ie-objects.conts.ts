import { Group } from '../users/types';

import {
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectMetadataSet,
	IeObjectSector,
	IeObjectSectorLicenseMatrix,
} from './ie-objects.types';

export const IE_OBJECT_EXTRA_USER_GROUPS = new Map<string, string>([
	[IeObjectExtraUserGroupType.ANONYMOUS, 'anonymous'][
		(IeObjectExtraUserGroupType.HAS_VISITOR_SPACE, '+hasAccessToVisitorSpace')
	],
	[IeObjectExtraUserGroupType.IS_KEY_USER, '+isKeyUser'],
	[
		IeObjectExtraUserGroupType.HAS_VISITOR_SPACE_AND_IS_KEY_USER,
		'+hasAccessToVisitorSpace+isKeyUser',
	],
]);

export const IE_OBJECT_LICENSES_BY_USER_GROUP = new Map<string, IeObjectLicense[]>([
	[
		IE_OBJECT_EXTRA_USER_GROUPS.get(IeObjectExtraUserGroupType.ANONYMOUS),
		[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
	],
	[Group.VISITOR, [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL]],
	[
		`${Group.VISITOR}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.HAS_VISITOR_SPACE
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang
		],
	],
	[
		`${Group.VISITOR}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.IS_KEY_USER
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
	[
		`${Group.VISITOR}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.HAS_VISITOR_SPACE_AND_IS_KEY_USER
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
	[
		Group.KIOSK_VISITOR,
		[IeObjectLicense.BEZOEKERTOOL_METADATA, IeObjectLicense.BEZOEKERTOOL_CONTENT],
	],
	[Group.CP_ADMIN, [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL]],
	[
		`${Group.CP_ADMIN}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.HAS_VISITOR_SPACE
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang of eigen tenant
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang of eigen tenant
		],
	],
	[
		`${Group.CP_ADMIN}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.IS_KEY_USER
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
	[
		`${Group.CP_ADMIN}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.HAS_VISITOR_SPACE_AND_IS_KEY_USER
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang of eigen tenant
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang of eigen tenant
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
	[
		Group.MEEMOO_ADMIN,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA,
			IeObjectLicense.BEZOEKERTOOL_CONTENT,
		],
	],
	[
		`${Group.MEEMOO_ADMIN}${IE_OBJECT_EXTRA_USER_GROUPS.get(
			IeObjectExtraUserGroupType.IS_KEY_USER
		)}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // altijd
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // altijd
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
]);

export const IE_OBJECT_METADATA_SET_BY_LICENSE = new Map<IeObjectLicense, IeObjectMetadataSet>([
	[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectMetadataSet.METADATA_LTD],
	[IeObjectLicense.PUBLIEK_METADATA_ALL, IeObjectMetadataSet.METADATA_ALL],
	[IeObjectLicense.BEZOEKERTOOL_METADATA, IeObjectMetadataSet.METADATA_ALL],
	[IeObjectLicense.BEZOEKERTOOL_CONTENT, IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE],
	[IeObjectLicense.INTRA_CP_METADATA_ALL, IeObjectMetadataSet.METADATA_ALL],
	[IeObjectLicense.INTRA_CP_CONTENT, IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE],
]);

export const IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR = new Map<
	IeObjectSector,
	IeObjectSectorLicenseMatrix
>([
	[
		IeObjectSector.CULTURE, // object sector
		new Map<IeObjectSector, IeObjectLicense[]>([
			[IeObjectSector.CULTURE, [IeObjectLicense.INTRA_CP_CONTENT]], // user sector and licenses (might be metadata set in the future)
			[IeObjectSector.GOVERNMENT, [IeObjectLicense.INTRA_CP_CONTENT]], // user sector and licenses (might be metadata set in the future)
			[IeObjectSector.REGIONAL, [IeObjectLicense.INTRA_CP_CONTENT]], // user sector and licenses (might be metadata set in the future)
			[IeObjectSector.PUBLIC, [IeObjectLicense.INTRA_CP_CONTENT]], // user sector and licenses (might be metadata set in the future)
			[IeObjectSector.RURAL, [IeObjectLicense.INTRA_CP_CONTENT]], // user sector and licenses (might be metadata set in the future)
		]),
	],
	[
		IeObjectSector.GOVERNMENT,
		new Map<IeObjectSector, IeObjectLicense[]>([
			[IeObjectSector.CULTURE, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.GOVERNMENT, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.REGIONAL, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.PUBLIC, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.RURAL, [IeObjectLicense.INTRA_CP_CONTENT]],
		]),
	],
	[
		IeObjectSector.REGIONAL,
		new Map<IeObjectSector, IeObjectLicense[]>([
			[IeObjectSector.CULTURE, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.GOVERNMENT, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.REGIONAL, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.PUBLIC, [IeObjectLicense.INTRA_CP_METADATA_ALL]],
			[IeObjectSector.RURAL, []],
		]),
	],
	[
		IeObjectSector.PUBLIC,
		new Map<IeObjectSector, IeObjectLicense[]>([
			[IeObjectSector.CULTURE, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.GOVERNMENT, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.REGIONAL, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.PUBLIC, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.RURAL, []],
		]),
	],
	[
		IeObjectSector.RURAL,
		new Map<IeObjectSector, IeObjectLicense[]>([
			[IeObjectSector.CULTURE, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.GOVERNMENT, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.REGIONAL, [IeObjectLicense.INTRA_CP_CONTENT]],
			[IeObjectSector.PUBLIC, []],
			[IeObjectSector.RURAL, []],
		]),
	],
]);

export const IE_OBJECT_PROPS_BY_METADATA_SET = new Map<string, string[]>([
	[
		IeObjectMetadataSet.METADATA_LTD,
		[
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
			// 'meemoofilmCaption', // BESTAAT NOG NIET
			// 'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			// 'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectMetadataSet.METADATA_ALL,
		[
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
			// 'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			// 'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			// 'categorie', // BESTAAT NOG NIET
			'meemoofilmBase',
			'meemoofilmColor',
			// 'meemoofilmCaption', // BESTAAT NOG NIET
			// 'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			// 'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
		[
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
			// 'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			// 'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			// 'categorie', // BESTAAT NOG NIET
			'meemoofilmBase',
			'meemoofilmColor',
			// 'meemoofilmCaption', // BESTAAT NOG NIET
			// 'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			// 'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
]);
