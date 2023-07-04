import { convertUserInfoToCommonUser, UserInfoType } from '@meemoo/admin-core-api';
import {
	Controller,
	Get,
	Headers,
	HttpStatus,
	Logger,
	Post,
	Query,
	Redirect,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';
import { isToday, parseISO } from 'date-fns';

import { Configuration } from '~config';

import { IdpService } from '../services/idp.service';
import { LoginMessage, LoginResponse } from '../types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { SessionUser } from '~shared/decorators/user.decorator';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';
import { SessionService } from '~shared/services/session.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	private logger: Logger = new Logger(AuthController.name, { timestamp: true });

	constructor(
		private idpService: IdpService,
		private usersService: UsersService,
		private configService: ConfigService<Configuration>,
		private sessionService: SessionService,
		private campaignMonitorService: CampaignMonitorService
	) {}

	@Get('check-login')
	public async checkLogin(
		@Session() session: Record<string, any>,
		@SessionUser() user: SessionUserEntity
	): Promise<LoginResponse> {
		if (SessionHelper.isLoggedIn(session)) {
			// To avoid updating the user and the campaign monitor info too many times, we only execute this if the last_access_at date is not up-to-date
			if (!isToday(parseISO(user.getLastAccessAt()))) {
				// A user can only have a last_access_at date if they accepted the terms and conditions
				if (user.getUser().acceptedTosAt) {
					// update last access
					this.usersService
						.updateLastAccessDate(user.getId())
						.then(() => {
							// Sync the new last-access-date to the info in campaign monitor since we do not have a nightly sync for hetarchief
							this.campaignMonitorService
								.updateNewsletterPreferences({
									firstName: user?.getFirstName(),
									lastName: user?.getLastName(),
									email: user?.getMail(),
									is_key_user: user?.getIsKeyUser(),
									usergroup: user?.getGroupName(),
									created_date: user?.getCreatedAt(),
									last_access_date: new Date().toISOString(),
									organisation: user?.getOrganisationName(),
								})
								.catch((err) => {
									this.logger.error(
										'Failed to update user in campaign monitor. user: ' +
											JSON.stringify(user) +
											'   ' +
											JSON.stringify(err)
									);
								});
						})
						.catch(() => {
							this.logger.error(
								'Failed to update user lastAccessAt date. id: ' + user.getId()
							);
						});
				}
			}

			return {
				userInfo: user.getUser(),
				commonUserInfo: convertUserInfoToCommonUser(
					user.getUser() as Avo.User.HetArchiefUser,
					UserInfoType.HetArchiefUser
				) as Avo.User.CommonUser,
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
				url: this.idpService.getSpecificLogoutUrl(idp, { returnToUrl }),
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
		if (this.configService.get('ENVIRONMENT') !== 'production') {
			return session;
		}
	}

	@Post('session')
	public postSession(@Session() session: Record<string, any>) {
		if (this.configService.get('ENVIRONMENT') !== 'production') {
			return session;
		}
	}

	@Post('clear-sessions')
	@UseGuards(ApiKeyGuard)
	async clearSessions(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers('apikey') apikey: string
	): Promise<{ message: string }> {
		await this.sessionService.clearRedis();
		return { message: 'User sessions have been cleared' };
	}
}
