import { get } from 'lodash';

import { Permission, User } from '../types';

export class SessionUserEntity {
	protected id: string;
	protected firstName: string;
	protected lastName: string;
	protected permissions: Array<Permission>;

	public constructor(user: User) {
		this.id = get(user, 'id');
		this.firstName = get(user, 'firstName');
		this.lastName = get(user, 'lastName');
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

	public getFullName(): string {
		return this.firstName + ' ' + this.lastName;
	}

	public has(permission: Permission): boolean {
		return this.permissions.includes(permission);
	}

	public hasNot(permission: Permission): boolean {
		return !this.has(permission);
	}

	public hasAny(permissions: Permission[]): boolean {
		return permissions.some((permission) => this.has(permission));
	}
}
