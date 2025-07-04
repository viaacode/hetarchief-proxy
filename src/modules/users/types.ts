import type { Idp } from '@viaa/avo2-types';

import type {
	GetUserByIdentityIdQuery,
	InsertUserMutation,
	UpdateUserProfileMutation,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObjectSector } from '~modules/ie-objects/ie-objects.types';
import type { Locale } from '~shared/types/types';

export enum Permission {
	SEARCH = 'SEARCH',
	// Visit Requests
	MANAGE_ALL_VISIT_REQUESTS = 'MANAGE_ALL_VISIT_REQUESTS',
	MANAGE_CP_VISIT_REQUESTS = 'MANAGE_CP_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
	CANCEL_OWN_VISIT_REQUEST = 'CANCEL_OWN_VISIT_REQUEST',
	// Objects
	SEARCH_OBJECTS = 'SEARCH_OBJECTS',
	SEARCH_ALL_OBJECTS = 'SEARCH_ALL_OBJECTS',
	EXPORT_OBJECT = 'EXPORT_OBJECT',
	DOWNLOAD_OBJECT = 'DOWNLOAD_OBJECT',
	// Collections
	MANAGE_FOLDERS = 'MANAGE_FOLDERS',
	// Spaces
	/** Spaces */
	READ_ALL_SPACES = 'READ_ALL_SPACES',
	UPDATE_OWN_SPACE = 'UPDATE_OWN_SPACE',
	UPDATE_ALL_SPACES = 'UPDATE_ALL_SPACES',
	CREATE_SPACES = 'CREATE_SPACES',
	// Kiosk
	SHOW_RESEARCH_WARNING = 'SHOW_RESEARCH_WARNING',
	MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
	CAN_EDIT_PROFILE_INFO = 'CAN_EDIT_PROFILE_INFO',
	SHOW_LINKED_SPACE_AS_HOMEPAGE = 'SHOW_LINKED_SPACE_AS_HOMEPAGE',
	// Admin-core
	CREATE_MAINTENANCE_ALERTS = 'CREATE_MAINTENANCE_ALERTS',
	DELETE_MAINTENANCE_ALERTS = 'DELETE_MAINTENANCE_ALERTS',
	EDIT_MAINTENANCE_ALERTS = 'EDIT_MAINTENANCE_ALERTS',
	EDIT_PROTECTED_PAGE_STATUS = 'EDIT_PROTECTED_PAGE_STATUS',
	PUBLISH_ANY_CONTENT_PAGE = 'PUBLISH_ANY_CONTENT_PAGE',
	UNPUBLISH_ANY_CONTENT_PAGE = 'UNPUBLISH_ANY_CONTENT_PAGE',
	VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
	VIEW_ANY_MAINTENANCE_ALERTS = 'VIEW_ANY_MAINTENANCE_ALERTS',
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	EDIT_CONTENT_PAGE_LABELS = 'EDIT_CONTENT_PAGE_LABELS',
	EDIT_PERMISSION_GROUPS = 'EDIT_PERMISSION_GROUPS',
	DELETE_ANY_CONTENT_PAGES = 'DELETE_ANY_CONTENT_PAGES',
	CREATE_CONTENT_PAGES = 'CREATE_CONTENT_PAGES',
	EDIT_NAVIGATION_BARS = 'EDIT_NAVIGATION_BARS',
	EDIT_USER_GROUPS = 'EDIT_USER_GROUPS',
	VIEW_USERS = 'VIEW_USERS',
	EDIT_ANY_USER = 'EDIT_ANY_USER',
	VIEW_COLLECTIONS_OVERVIEW = 'VIEW_COLLECTIONS_OVERVIEW',
	VIEW_BUNDLES_OVERVIEW = 'VIEW_BUNDLES_OVERVIEW',
	EDIT_ANY_COLLECTIONS = 'EDIT_ANY_COLLECTIONS',
	VIEW_USERS_IN_SAME_COMPANY = 'VIEW_USERS_IN_SAME_COMPANY',
	EDIT_TRANSLATIONS = 'EDIT_TRANSLATIONS',
	// Material Requests
	VIEW_ANY_MATERIAL_REQUESTS = 'VIEW_ANY_MATERIAL_REQUESTS',
	VIEW_OWN_MATERIAL_REQUESTS = 'VIEW_OWN_MATERIAL_REQUESTS',
	CREATE_MATERIAL_REQUESTS = 'CREATE_MATERIAL_REQUESTS',
	EDIT_OWN_MATERIAL_REQUESTS = 'EDIT_OWN_MATERIAL_REQUESTS',
	DELETE_OWN_MATERIAL_REQUESTS = 'DELETE_OWN_MATERIAL_REQUESTS',
}

export type GqlUser =
	| GetUserByIdentityIdQuery['users_profile'][0]
	| InsertUserMutation['insert_users_profile_one']
	| UpdateUserProfileMutation['update_users_profile']['returning']['0'];

export interface User {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	language: Locale;
	acceptedTosAt: string;
	groupId: string;
	groupName: GroupName;
	permissions: Permission[];
	idp: Idp;
	isKeyUser: boolean;
	visitorSpaceSlug?: string;
	sector?: IeObjectSector | null;
	organisationName?: string | null;
	organisationId?: string | null;
	lastAccessAt?: string | null;
	createdAt?: string | null;
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
}

/**
 * @deprecated At some point we would like to get rid of the GroupId enum since it contains uuids and we don't like hardcoding uuids in the code. So prefer GroupName where possible.
 */
export enum GroupId {
	KIOSK_VISITOR = '04150e6e-b779-4125-84e5-6ee6fc580757',
	MEEMOO_ADMIN = '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
	VISITOR = '0213c8d4-f459-45ef-8bbc-96268ab56d01',
	CP_ADMIN = 'c56d95aa-e918-47ca-b102-486c9449fc4a',
}

export const GroupIdToName: Record<GroupId, string> = {
	[GroupId.KIOSK_VISITOR]: 'KIOSK_VISITOR',
	[GroupId.MEEMOO_ADMIN]: 'MEEMOO_ADMIN',
	[GroupId.VISITOR]: 'VISITOR',
	[GroupId.CP_ADMIN]: 'CP_ADMIN',
};

export enum GroupName {
	KIOSK_VISITOR = 'KIOSK_VISITOR',
	MEEMOO_ADMIN = 'MEEMOO_ADMIN',
	VISITOR = 'VISITOR',
	CP_ADMIN = 'CP_ADMIN',
	ANONYMOUS = 'ANONYMOUS',
}
