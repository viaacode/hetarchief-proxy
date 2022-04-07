import { get } from 'lodash';

import { Permission, User } from '../types';

export class SessionUserEntity {
	protected id: string;
	protected permissions: Array<Permission>;

	public constructor(user: User) {
		this.id = get(user, 'id');
		this.permissions = get(user, 'permissions', []);
	}

	public getId(): string {
		return this.id;
	}

	public has(permission: Permission): boolean {
		return this.permissions.includes(permission);
	}
}
