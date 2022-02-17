export interface DeleteResponse {
	affectedRows: number;
}

export enum SpecialPermissionGroups {
	loggedOutUsers = -1,
	loggedInUsers = -2,
}
