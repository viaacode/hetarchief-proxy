import { PermissionResponse } from '../permissions/types';
export interface UserGroupsResponse {
	name: string;
	permissions: PermissionResponse[];
}
