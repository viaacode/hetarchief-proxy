import {
	FindAllNavigationItemsQuery,
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
	| InsertNavigationMutation['insert_cms_navigation_element_one']
	| UpdateNavigationByIdMutation['update_cms_navigation_element_by_pk']
	| FindAllNavigationItemsQuery['cms_navigation_element'][0]
	| FindNavigationByIdQuery['cms_navigation_element'][0];
