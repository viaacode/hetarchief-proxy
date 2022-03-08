export interface User {
	id: string;
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
