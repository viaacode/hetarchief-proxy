import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import type { Observable } from 'rxjs';

import { GroupName } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';

@Injectable()
export class IsMeemooAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = SessionHelper.getArchiefUserInfo(request.session);
		if (user.groupName !== GroupName.MEEMOO_ADMIN) {
			throw new UnauthorizedException('You must be evaluator to use this endpoint');
		}
		return true;
	}
}
