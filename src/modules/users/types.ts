export interface User {
	id: string;
	full_name: string;
	firstName: string;
	lastName: string;
	email: string;
	acceptedTosAt: string;
	permissions: string[];
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
}
