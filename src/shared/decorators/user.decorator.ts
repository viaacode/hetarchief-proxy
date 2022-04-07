import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionHelper } from '~shared/auth/session-helper';

export const SessionUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): SessionUserEntity | null => {
		const request = ctx.switchToHttp().getRequest();
		return new SessionUserEntity(SessionHelper.getArchiefUserInfo(request.session));
	}
);
