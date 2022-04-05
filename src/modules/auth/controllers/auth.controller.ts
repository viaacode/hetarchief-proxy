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
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { getConfig } from '~config';

import { IdpService } from '../services/idp.service';
import { LoginMessage, LoginResponse } from '../types';

import { SessionHelper } from '~shared/auth/session-helper';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	private logger: Logger = new Logger(AuthController.name, { timestamp: true });

	constructor(private idpService: IdpService, private configService: ConfigService) {}

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
		if (getConfig(this.configService, 'environment') !== 'production') {
			return session;
		}
	}

	@Post('session')
	public postSession(@Session() session: Record<string, any>) {
		if (getConfig(this.configService, 'environment') !== 'production') {
			return session;
		}
	}
}
