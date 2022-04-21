import {
	FindNavigationByIdQuery,
	InsertNavigationMutation,
	UpdateNavigationByIdMutation,
} from '~generated/graphql-db-types-hetarchief';

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

export type Navigation =
	| InsertNavigationMutation['insert_app_navigation_one']
	| UpdateNavigationByIdMutation['update_app_navigation_by_pk']
	| FindNavigationByIdQuery['app_navigation'][0];
