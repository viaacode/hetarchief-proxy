import { PermissionResponse } from '../permissions/types';
export interface UserGroupsResponse {
	id: string;
	name: string;
	permissions: PermissionResponse[];
}
