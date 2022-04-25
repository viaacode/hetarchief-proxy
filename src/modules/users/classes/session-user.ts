import { Logger } from '@nestjs/common';
import { get } from 'lodash';

import { Permission, User } from '../types';

export class SessionUserEntity {
	private logger = new Logger(SessionUserEntity.name, { timestamp: true });

	protected id: string;
	protected firstName: string;
	protected lastName: string;
	protected mail: string;
	protected maintainerId: string;
	protected visitorSpaceSlug: string;
	protected permissions: Array<Permission>;

	public constructor(user: User) {
		this.id = get(user, 'id');
		this.firstName = get(user, 'firstName');
		this.lastName = get(user, 'lastName');
		this.mail = get(user, 'email');
		this.maintainerId = get(user, 'maintainerId');
		this.visitorSpaceSlug = get(user, 'visitorSpaceSlug');
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

	public getFirstName(): string {
		return this.firstName;
	}

	public getLastName(): string {
		return this.lastName;
	}

	public getMail(): string {
		return this.mail;
	}

	public getMaintainerId(): string {
		return this.maintainerId;
	}

	public getVisitorSpaceSlug(): string {
		return this.visitorSpaceSlug;
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
