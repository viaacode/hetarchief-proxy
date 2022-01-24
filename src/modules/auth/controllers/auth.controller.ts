import { Controller, Get, Logger, Session } from '@nestjs/common';

import { SessionHelper } from '../session-helper';
import { LoginMessage, LoginResponse } from '../types';

@Controller('auth')
export class AuthController {
	private logger: Logger = new Logger(AuthController.name, { timestamp: true });

	@Get('check-login')
	public async checkLogin(@Session() session: Record<string, any>): Promise<LoginResponse> {
		if (SessionHelper.isLoggedIn(session)) {
			const userInfo = SessionHelper.getArchiefUserInfo(session);
			/**
			 * In AVO there is extra logic here:
			 * - check on accepted terms and conditions
			 * - Update user last access date
			 * - Send a log event
			 */

			return {
				userInfo,
				message: LoginMessage.LOGGED_IN,
				sessionExpiresAt: SessionHelper.getExpiresAt(new Date()),
			};
		}

		return { message: LoginMessage.LOGGED_OUT };
	}
}
