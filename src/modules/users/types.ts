import { Idp } from '~shared/auth/auth.types';

export enum Permission {
	CAN_READ_ALL_VISIT_REQUESTS = 'CAN_READ_ALL_VISIT_REQUESTS',
	CAN_APPROVE_DENY_ALL_VISIT_REQUESTS = 'CAN_APPROVE_DENY_ALL_VISIT_REQUESTS',
	CAN_READ_CP_VISIT_REQUESTS = 'CAN_READ_CP_VISIT_REQUESTS',
	CAN_APPROVE_DENY_CP_VISIT_REQUESTS = 'CAN_APPROVE_DENY_CP_VISIT_REQUESTS',
	CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
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
	full_name: string;
	firstName: string;
	lastName: string;
	email: string;
	acceptedTosAt: string;
	permissions: Permission[];
	idp: Idp;
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
}
