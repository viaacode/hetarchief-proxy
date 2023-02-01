import { Group } from '../users/types';

import { IeObjectLicense } from './ie-objects.types';

export const IE_OBJECT_LICENSES_BY_USER_GROUP = new Map<string, IeObjectLicense[]>([
	['anonymous', [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL]],
	[
		`${Group.VISITOR}`,
		[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
	],
	[
		`${Group.VISITOR}+hasAccessToVisitorSpace`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang
		],
	],
	[
		`${Group.VISITOR}+isKeyUser`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
	[
		`${Group.VISITOR}+hasAccessToVisitorSpace+isKeyUser`,
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
		`${Group.KIOSK_VISITOR}`,
		[IeObjectLicense.BEZOEKERTOOL_METADATA, IeObjectLicense.BEZOEKERTOOL_CONTENT],
	],
	[
		`${Group.CP_ADMIN}`,
		[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
	],
	[
		`${Group.CP_ADMIN}+hasAccessToVisitorSpace`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA, // indien toegang of eigen tenant
			IeObjectLicense.BEZOEKERTOOL_CONTENT, // indien toegang of eigen tenant
		],
	],
	[
		`${Group.CP_ADMIN}+isKeyUser`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.INTRA_CP_METADATA_ALL, // indien keyuser
			IeObjectLicense.INTRA_CP_CONTENT, // indien keyuser
		],
	],
	[
		`${Group.CP_ADMIN}+hasAccessToVisitorSpace+isKeyUser`,
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
		`${Group.MEEMOO_ADMIN}`,
		[
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_METADATA,
			IeObjectLicense.BEZOEKERTOOL_CONTENT,
		],
	],
	[
		`${Group.MEEMOO_ADMIN}+isKeyUser`,
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

export const IE_OBJECT_PROPS_BY_LICENSES = new Map<string, string[]>([
	[
		IeObjectLicense.PUBLIEK_METADATA_LTD,
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
			// dcterms_format for film
			// dcterms_medium for film
			'meemoofilmBase',
			'meemoofilmColor',
			'meemoofilmCaption', // BESTAAT NOG NIET
			'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectLicense.PUBLIEK_METADATA_ALL,
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
			'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			'categorie', // BESTAAT NOG NIET
			// dcterms_format for film
			// dcterms_medium for film
			'meemoofilmBase',
			'meemoofilmColor',
			'meemoofilmCaption', // BESTAAT NOG NIET
			'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectLicense.BEZOEKERTOOL_METADATA,
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
			'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			'categorie', // BESTAAT NOG NIET
			// dcterms_format for film
			// dcterms_medium for film
			'meemoofilmBase',
			'meemoofilmColor',
			'meemoofilmCaption', // BESTAAT NOG NIET
			'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectLicense.BEZOEKERTOOL_CONTENT,
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
			'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			'categorie', // BESTAAT NOG NIET
			// dcterms_format for film
			// dcterms_medium for film
			'meemoofilmBase',
			'meemoofilmColor',
			'meemoofilmCaption', // BESTAAT NOG NIET
			'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectLicense.INTRA_CP_METADATA_ALL,
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
			'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			'categorie', // BESTAAT NOG NIET
			// dcterms_format for film
			// dcterms_medium for film
			'meemoofilmBase',
			'meemoofilmColor',
			'meemoofilmCaption', // BESTAAT NOG NIET
			'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
	[
		IeObjectLicense.INTRA_CP_CONTENT,
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
			'serviceProvider', // BESTAAT NOG NIET
			'dateCreated',
			'datePublished',
			'creator',
			'publisher',
			'description',
			'abstract',
			'transcript', // BESTAAT NOG NIET
			'caption',
			'meemooDescriptionProgramme',
			'meemooDescriptionCast',
			'genre',
			'spatial',
			'temporal',
			'keywords',
			'inLanguage',
			'categorie', // BESTAAT NOG NIET
			// dcterms_format for film
			// dcterms_medium for film
			'meemoofilmBase',
			'meemoofilmColor',
			'meemoofilmCaption', // BESTAAT NOG NIET
			'meemoofilmCaptionLanguage', // BESTAAT NOG NIET
			'ebucoreIsMediaFragmentOf',
			'ebucoreHasMediaFragmentOf', // BESTAAT NOG NIET,
			'licenses',
		],
	],
]);
