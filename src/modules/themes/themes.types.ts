import {
	GetThemeWithObjectsInRandomOrderQuery,
	GetThemeWithObjectsQuery,
} from '~generated/graphql-db-types-hetarchief';

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
	MAINTAINER_NAME = 'maintainerName',
}

export type RawThemeIeObject =
	| GetThemeWithObjectsInRandomOrderQuery['app_theme_by_pk']['ieObjectLinksRandomOrder'][0]['ieObject']
	| GetThemeWithObjectsQuery['app_theme_by_pk']['ieObjectLinks'][0]['ieObject'];
