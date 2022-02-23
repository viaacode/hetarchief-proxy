export enum ContentPickerType {
	CONTENT_PAGE = 'CONTENT_PAGE',
	COLLECTION = 'COLLECTION',
	OBJECT = 'OBJECT',
	DROPDOWN = 'DROPDOWN',
	INTERNAL_LINK = 'INTERNAL_LINK',
	EXTERNAL_LINK = 'EXTERNAL_LINK',
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
