export interface IeObjectInTheme {
	id: string;
	name: string | null;
	format: string | null;
	thumbnailUrl: string | null;
	maintainerId: string | null;
	maintainerName: string | null;
}

export interface IeObjectsInThemeResponse {
	id: string;
	slug: string;
	nameNl: string;
	nameEn: string;
	imageUrl: string | null;
	ieObjects: IeObjectInTheme[];
}

export enum ThemeOrderProp {
	NAME_NL = 'nameNl',
	NAME_EN = 'nameEn',
	SLUG = 'slug',
}

export const THEME_ORDER_PROP_TO_DB_PROP: Record<ThemeOrderProp, string> = {
	[ThemeOrderProp.NAME_NL]: 'name_nl',
	[ThemeOrderProp.NAME_EN]: 'name_en',
	[ThemeOrderProp.SLUG]: 'slug',
};

export enum ThemeIeObjectOrderProp {
	NAME = 'name',
	INTELLECTUAL_ENTITY_ID = 'intellectualEntityId',
}
