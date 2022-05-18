import { Injectable, Logger } from '@nestjs/common';

import { UpdatePermission } from '../dto/user-groups.dto';
import { UserGroupsResponse } from '../types';

import {
	GetUserGroupsPermissionsDocument,
	GetUserGroupsPermissionsQuery,
	UpdateUserGroupsPermissionsDocument,
	UpdateUserGroupsPermissionsMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class UserGroupsService {
	private logger: Logger = new Logger(UserGroupsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public adapt(userGroup: GetUserGroupsPermissionsQuery['users_group'][0]): UserGroupsResponse {
		return {
			id: userGroup.id,
			label: userGroup.label,
			name: userGroup.name,
			permissions: userGroup.permissions.map((permissionWrap) => ({
				id: permissionWrap.permission.id,
				label: permissionWrap.permission.label,
				name: permissionWrap.permission.name,
				description: permissionWrap.permission.description,
			})),
		};
	}

	public async getUserGroups(): Promise<UserGroupsResponse[]> {
		const {
			data: { users_group: userGroups },
		} = await this.dataService.execute<GetUserGroupsPermissionsQuery>(
			GetUserGroupsPermissionsDocument
		);

		return userGroups.map((userGroup) => this.adapt(userGroup));
	}

	public async updateUserGroups(
		updates: UpdatePermission[]
	): Promise<{ deleted: number; inserted: number }> {
		const {
			data: {
				delete_users_group_permission: { affected_rows: deleted },
				insert_users_group_permission: { affected_rows: inserted },
			},
		} = await this.dataService.execute<UpdateUserGroupsPermissionsMutation>(
			UpdateUserGroupsPermissionsDocument,
			{
				deletions: {
					_or: updates
						.filter((update) => !update.hasPermission)
						.map((update) => ({
							_and: [
								{ permission_id: { _eq: update.permissionId } },
								{ group_id: { _eq: update.userGroupId } },
							],
						})),
				},
				insertions: updates
					.filter((update) => update.hasPermission)
					.map((update) => ({
						group_id: update.userGroupId,
						permission_id: update.permissionId,
					})),
			}
		);

		return { deleted, inserted };
	}
}
