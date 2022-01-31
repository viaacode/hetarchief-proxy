import {
	Controller,
	Get,
	HttpStatus,
	Logger,
	Post,
	Query,
	Redirect,
	Session,
} from '@nestjs/common';

import { IdpService } from '../services/idp.service';
import { SessionHelper } from '../session-helper';
import { LoginResponse } from '../types';

@Controller('auth')
export class AuthController {
	private logger: Logger = new Logger(AuthController.name, { timestamp: true });

	constructor(private idpService: IdpService) {}

	@Get('check-login')
	public checkLogin(): LoginResponse {
		// TODO real implementation
		return { message: 'LOGGED_OUT' };
	}

	@Get('global-logout')
	@Redirect()
	public async globalLogout(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string
	) {
		this.logger.log('Global-logout called');
		const idp = SessionHelper.getIdp(session);
		if (this.idpService.hasSpecificLogoutPage(idp)) {
			this.logger.log('-> Specific logout');
			return {
				url: this.idpService.getSpecificLogoutUrl(idp, returnToUrl),
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		}
		this.logger.log('Global but no specific logout, clearing session...');
		SessionHelper.logout(session);
		return {
			url: returnToUrl,
			statusCode: HttpStatus.TEMPORARY_REDIRECT,
		};
	}

	/**
	 * Debug calls for local / int / tst environments
	 */
	@Get('session')
	public getSession(@Session() session: Record<string, any>) {
		if (process.env.NODE_ENV !== 'production') {
			return session;
		}
	}

	@Post('session')
	public postSession(@Session() session: Record<string, any>) {
		if (process.env.NODE_ENV !== 'production') {
			return session;
		}
	}
}
