import { get } from 'lodash';

import { Permission, User } from '../types';

export class SessionUserEntity {
	protected id: string;
	protected permissions: Array<Permission>;

	public constructor(user: User) {
		this.id = get(user, 'id');
		// can be archief-user or avo-user, where permissions are stored differently
		// merge them into 1 unified array
		this.permissions = [
			...get(user, 'permissions', []),
			...get(user, 'profile.permissions', []),
		];
	}

	public getId(): string {
		return this.id;
	}

	public has(permission: Permission): boolean {
		return this.permissions.includes(permission);
	}
}
