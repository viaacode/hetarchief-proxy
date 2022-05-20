import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SessionHelper } from '~shared/auth/session-helper';

@Injectable()
export class LoggedInGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// TODO remove when stop working on the admin-core
		return true;

		const request = context.switchToHttp().getRequest();
		const user = SessionHelper.getArchiefUserInfo(request.session);
		if (!user?.id) {
			throw new UnauthorizedException('You must be logged in to use this endpoint');
		}
		return true;
	}
}
