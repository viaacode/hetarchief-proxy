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
	UPDATED_AT = 'updatedAt',
}

export const THEME_ORDER_PROP_TO_DB_PROP: Record<ThemeOrderProp, string> = {
	[ThemeOrderProp.NAME_NL]: 'name_nl',
	[ThemeOrderProp.NAME_EN]: 'name_en',
	[ThemeOrderProp.SLUG]: 'slug',
	[ThemeOrderProp.UPDATED_AT]: 'updated_at',
};

export enum ThemeIeObjectOrderProp {
	NAME = 'name',
	MAINTAINER_NAME = 'maintainerName',
}

export enum AddIeObjectToThemeResult {
	/** The ie-object was newly linked to the theme */
	ADDED = 'added',
	/** The ie-object exists, but was already linked to this theme */
	ALREADY_LINKED = 'alreadyLinked',
	/** No ie-object exists with the given schema identifier */
	NOT_FOUND = 'notFound',
}

export type RawThemeIeObject =
	| GetThemeWithObjectsInRandomOrderQuery['app_theme_by_pk']['ieObjectLinksRandomOrder'][0]['ieObject']
	| GetThemeWithObjectsQuery['app_theme_by_pk']['ieObjectLinks'][0]['ieObject'];
