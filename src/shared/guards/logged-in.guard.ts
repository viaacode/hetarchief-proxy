import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { type Observable } from 'rxjs';

import { SessionHelper } from '~shared/auth/session-helper';

@Injectable()
export class LoggedInGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = SessionHelper.getArchiefUserInfo(request.session);
		if (!user?.id) {
			throw new UnauthorizedException('You must be logged in to use this endpoint');
		}
		return true;
	}
}
