import { FindAllNavigationItemsQuery } from '~generated/graphql-db-types-hetarchief';

export type GqlNavigation = FindAllNavigationItemsQuery['app_navigation'][0];

export interface NavigationItem {
	id: string;
	label: string;
	placement: string;
	description?: string | null;
	linkTarget?: string | null;
	iconName: string;
	position: number;
	contentType: string;
	contentPath: string;
	tooltip?: string;
	updatedAt: string;
	createdAt: string;
}
