import {
	GetUserByIdentityIdQuery,
	InsertUserMutation,
	UpdateUserProfileMutation,
} from '~generated/graphql-db-types-hetarchief';
import { Idp } from '~shared/auth/auth.types';

export enum Permission {
	// Visit Requests
	READ_ALL_VISIT_REQUESTS = 'READ_ALL_VISIT_REQUESTS',
	APPROVE_DENY_ALL_VISIT_REQUESTS = 'APPROVE_DENY_ALL_VISIT_REQUESTS',
	READ_CP_VISIT_REQUESTS = 'READ_CP_VISIT_REQUESTS',
	APPROVE_DENY_CP_VISIT_REQUESTS = 'APPROVE_DENY_CP_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
	UPDATE_VISIT_REQUEST = 'UPDATE_VISIT_REQUEST',
	CANCEL_OWN_VISIT_REQUEST = 'CANCEL_OWN_VISIT_REQUEST',
	// Objects
	SEARCH_OBJECTS = 'SEARCH_OBJECTS',
	SEARCH_ALL_OBJECTS = 'SEARCH_ALL_OBJECTS', // Search objects in all indexes in elasticsearch
	EXPORT_OBJECT = 'EXPORT_OBJECT',
	// Collections
	MANAGE_COLLECTIONS = 'MANAGE_COLLECTIONS',
	// Spaces
	/** Spaces */
	READ_ALL_SPACES = 'READ_ALL_SPACES',
	UPDATE_OWN_SPACE = 'UPDATE_OWN_SPACE',
	UPDATE_ALL_SPACES = 'UPDATE_ALL_SPACES',
	// Admin
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	SEARCH = 'SEARCH',
}

export type GqlUser =
	| GetUserByIdentityIdQuery['users_profile'][0]
	| InsertUserMutation['insert_users_profile_one']
	| UpdateUserProfileMutation['update_users_profile_by_pk'];

export interface User {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	acceptedTosAt: string;
	groupId: string;
	groupName: string;
	permissions: Permission[];
	idp: Idp;
	maintainerId?: string;
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
}

export enum Group {
	KIOSK_VISITOR = '04150e6e-b779-4125-84e5-6ee6fc580757',
	MEEMOO_ADMIN = '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
	VISITOR = '0213c8d4-f459-45ef-8bbc-96268ab56d01',
	CP_ADMIN = 'c56d95aa-e918-47ca-b102-486c9449fc4a',
}

export const GroupIdToName: Record<Group, string> = {
	[Group.KIOSK_VISITOR]: 'KIOSK_VISITOR',
	[Group.MEEMOO_ADMIN]: 'MEEMOO_ADMIN',
	[Group.VISITOR]: 'VISITOR',
	[Group.CP_ADMIN]: 'CP_ADMIN',
};
