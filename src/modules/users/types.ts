import { Idp } from '~shared/auth/auth.types';

export enum Permission {
	// Visit Requests
	CAN_READ_ALL_VISIT_REQUESTS = 'CAN_READ_ALL_VISIT_REQUESTS',
	CAN_APPROVE_DENY_ALL_VISIT_REQUESTS = 'CAN_APPROVE_DENY_ALL_VISIT_REQUESTS',
	CAN_READ_CP_VISIT_REQUESTS = 'CAN_READ_CP_VISIT_REQUESTS',
	CAN_APPROVE_DENY_CP_VISIT_REQUESTS = 'CAN_APPROVE_DENY_CP_VISIT_REQUESTS',
	CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CAN_CREATE_VISIT_REQUEST = 'CAN_CREATE_VISIT_REQUEST',
	CAN_UPDATE_VISIT_REQUEST = 'CAN_UPDATE_VISIT_REQUEST',
	CAN_CANCEL_OWN_VISIT_REQUEST = 'CAN_CANCEL_OWN_VISIT_REQUEST',
	// Objects
	CAN_SEARCH_OBJECTS = 'CAN_SEARCH_OBJECTS',
	// Collections
	MANAGE_COLLECTIONS = 'MANAGE_COLLECTIONS',
	// Admin
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	SEARCH = 'SEARCH',
}

export interface GqlUser {
	id: string;
	full_name: string;
	first_name: string;
	last_name: string;
	mail: string;
	accepted_tos_at?: string;
	group: GqlUserGroup;
	identities: {
		identity_provider_name: string;
	}[];
}

export interface GqlUserGroup {
	permissions: {
		permission: {
			name: string;
		};
	}[];
}

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

export const GroupIdToName = {
	[Group.KIOSK_VISITOR]: 'KIOSK_VISITOR',
	[Group.MEEMOO_ADMIN]: 'MEEMOO_ADMIN',
	[Group.VISITOR]: 'VISITOR',
	[Group.CP_ADMIN]: 'CP_ADMIN',
};
