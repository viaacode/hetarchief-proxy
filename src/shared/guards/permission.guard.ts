import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Observable } from 'rxjs';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { type Permission } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';

@Injectable()
export class PermissionGuard implements CanActivate {
	private logger = new Logger(PermissionGuard.name, { timestamp: true });

	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// required permissions
		const requiredPermissionsClass =
			this.reflector.get<Permission[]>('requiredPermissions', context.getClass()) || [];
		const requiredPermissions =
			this.reflector.get<Permission[]>('requiredPermissions', context.getHandler()) || [];

		// any permissions
		const anyPermissionsClass =
			this.reflector.get<Permission[]>('requireAnyPermissions', context.getClass()) || [];
		const anyPermissions =
			this.reflector.get<Permission[]>('requireAnyPermissions', context.getHandler()) || [];

		const allRequiredPermissions = [...requiredPermissionsClass, ...requiredPermissions];
		const allAnyPermissions = [...anyPermissionsClass, ...anyPermissions];
		const allPermissions = [
			...requiredPermissionsClass,
			...requiredPermissions,
			...anyPermissionsClass,
			...anyPermissions,
		];

		if (allPermissions.length === 0) {
			// no permissions specified -- passed
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = new SessionUserEntity(SessionHelper.getArchiefUserInfo(request.session));
		// User needs all required permissions
		if (!user.hasAll(allRequiredPermissions)) {
			throw new ForbiddenException("You don't have the required permission for this route");
		}
		// user needs any of the anyPermissions
		if (!user.hasAny(allAnyPermissions)) {
			throw new ForbiddenException(
				"You don't have the required permission for this route: " +
					context.getArgs()?.[0]?.url
			);
		}
		return true;
	}
}
