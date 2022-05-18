import { PermissionResponse } from '../permissions/types';

export interface UserGroupsResponse {
	id: string;
	name: string;
	label: string;
	permissions: PermissionResponse[];
}
