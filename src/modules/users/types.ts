import { Idp } from '~shared/auth/auth.types';

export interface GqlUser {
	id: string;
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
	firstName: string;
	lastName: string;
	email: string;
	acceptedTosAt: string;
	permissions: string[];
	idp: Idp;
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
}
