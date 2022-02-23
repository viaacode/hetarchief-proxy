export type ContentPickerType =
	| 'CONTENT_PAGE'
	| 'ITEM'
	| 'BUNDLE'
	| 'DROPDOWN'
	| 'INTERNAL_LINK'
	| 'EXTERNAL_LINK'
	| 'SEARCH_QUERY'
	| 'PROJECTS'
	| 'ANCHOR_LINK'
	| 'PROFILE';

export enum ContentPickerTypeSchema {
	CONTENT_PAGE = 'CONTENT_PAGE',
	COLLECTION = 'COLLECTION',
	ITEM = 'ITEM',
	BUNDLE = 'BUNDLE',
	DROPDOWN = 'DROPDOWN',
	INTERNAL_LINK = 'INTERNAL_LINK',
	EXTERNAL_LINK = 'EXTERNAL_LINK',
	SEARCH_QUERY = 'SEARCH_QUERY',
	PROJECTS = 'PROJECTS',
	ANCHOR_LINK = 'ANCHOR_LINK',
	PROFILE = 'PROFILE',
}

export interface Navigation {
	id: string;
	label: string | null;
	icon_name: string;
	description: string | null;
	user_group_ids: number[] | null;
	content_type: ContentPickerType | null;
	content_path: string | number | null;
	link_target: '_blank' | '_self' | null;
	position: number;
	placement: string | null;
	created_at: string;
	updated_at: string;
	tooltip: string | null;
}
