import { Logger } from '@nestjs/common';
import { PermissionName } from '@viaa/avo2-types';

import { GroupName, User } from '../types';

import type { IeObjectSector } from '~modules/ie-objects/ie-objects.types';
import { Locale } from '~shared/types/types';

export class SessionUserEntity {
	private logger = new Logger(SessionUserEntity.name, { timestamp: true });

	protected user: User;
	protected id: string;
	protected firstName: string;
	protected lastName: string;
	protected mail: string;
	protected maintainerId: string;
	protected visitorSpaceSlug: string;
	protected permissions: Array<PermissionName>;

	public constructor(user: User) {
		// Add permission to view any material request when the user is a key user and evaluator
		// Otherwise this user won't be able to approve/deny request for its organisation
		if (
			user?.isKeyUser &&
			user?.isEvaluator &&
			!user.permissions.includes(PermissionName.VIEW_ANY_MATERIAL_REQUESTS)
		) {
			user.permissions.push(PermissionName.VIEW_ANY_MATERIAL_REQUESTS);
		}

		this.user = user;
		// can be archief-user or avo-user, where permissions are stored differently
		// merge them into 1 unified array
		this.permissions = [
			...(user?.permissions || []),
			...((user as any)?.profile?.permissions || []),
		];
	}

	public getUser(): User {
		return this.user;
	}

	public getId(): string {
		return this.user?.id || null;
	}

	public getFirstName(): string {
		return this.user?.firstName;
	}

	public getLastName(): string {
		return this.user?.lastName;
	}

	public getFullName(): string {
		return `${this.getFirstName()} ${this.getLastName()}`;
	}

	public getMail(): string {
		return this.user?.email || null;
	}

	public getLanguage(): Locale {
		return this.user?.language || Locale.Nl;
	}

	public getOrganisationId(): string {
		return this.user?.organisationId || null;
	}

	public getSector(): IeObjectSector | null {
		return this.user?.sector || null;
	}

	public getVisitorSpaceSlug(): string {
		return this.user?.visitorSpaceSlug;
	}

	public getGroupName(): GroupName {
		return this.user?.groupName || null;
	}

	public getGroupId(): string {
		return this.user?.groupId || null;
	}

	public getIsKeyUser(): boolean {
		return this.user?.isKeyUser || false;
	}

	public getIsEvaluator(): boolean {
		return this.user?.isEvaluator || false;
	}

	public getLastAccessAt(): string {
		return this.user?.lastAccessAt || null;
	}

	public getCreatedAt(): string {
		return this.user?.createdAt || null;
	}

	public getOrganisationName(): string {
		return this.user?.organisationName || null;
	}

	public has(permission: PermissionName): boolean {
		return this.permissions.includes(permission);
	}

	public hasNot(permission: PermissionName): boolean {
		return !this.has(permission);
	}

	public hasAny(permissions: PermissionName[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.some((permission) => this.has(permission));
	}

	public hasAll(permissions: PermissionName[]): boolean {
		if (permissions.length === 0) {
			return true;
		}

		return permissions.every((permission) => this.has(permission));
	}
}
