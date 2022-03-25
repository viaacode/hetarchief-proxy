import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';

export const SessionUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): User | null => {
		const request = ctx.switchToHttp().getRequest();
		return SessionHelper.getArchiefUserInfo(request.session);
	}
);
