import { Logger } from '@nestjs/common';
import { get } from 'lodash';

import { Permission, User } from '../types';

import { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

export class SessionUserEntity {
	private logger = new Logger(SessionUserEntity.name, { timestamp: true });

	protected user: User;
	protected id: string;
	protected firstName: string;
	protected lastName: string;
	protected mail: string;
	protected maintainerId: string;
	protected visitorSpaceSlug: string;
	protected permissions: Array<Permission>;

	public constructor(user: User) {
		this.user = user;
		// can be archief-user or avo-user, where permissions are stored differently
		// merge them into 1 unified array
		this.permissions = [
			...get(user, 'permissions', []),
			...get(user, 'profile.permissions', []),
		];
	}

	public getUser(): User {
		return this.user;
	}

	public getId(): string {
		return get(this.user, 'id') || null;
	}

	public getFirstName(): string {
		return get(this.user, 'firstName');
	}

	public getLastName(): string {
		return get(this.user, 'lastName');
	}

	public getFullName(): string {
		return this.getFirstName() + ' ' + this.getLastName();
	}

	public getMail(): string {
		return get(this.user, 'mail');
	}

	public getMaintainerId(): string {
		return this.user?.maintainerId || null;
	}

	public getSector(): IeObjectSector | null {
		return this.user?.sector || null;
	}

	public getVisitorSpaceSlug(): string {
		return get(this.user, 'visitorSpaceSlug');
	}

	public getGroupName(): string {
		return this.user?.groupName || null;
	}

	public getGroupId(): string {
		return this.user?.groupId || null;
	}

	public getIsKeyUser(): boolean {
		return this.user?.isKeyUser || false;
	}

	public getLastAccessAt(): string {
		return this.user?.lastAccessAt || null;
	}

	public has(permission: Permission): boolean {
		return this.permissions.includes(permission);
	}

	public hasNot(permission: Permission): boolean {
		return !this.has(permission);
	}

	public hasAny(permissions: Permission[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.some((permission) => this.has(permission));
	}

	public hasAll(permissions: Permission[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.every((permission) => this.has(permission));
	}
}
