import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Logger,
	Post,
	Query,
	Redirect,
	Req,
	Session,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { get, isEqual, pick } from 'lodash';

import { getConfig } from '~config';

import { IdpService } from '../services/idp.service';
import { MeemooService } from '../services/meemoo.service';
import { RelayState, SamlCallbackBody } from '../types';

import { CollectionsService } from '~modules/collections/services/collections.service';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { TranslationsService } from '~modules/translations/services/translations.service';
import { UsersService } from '~modules/users/services/users.service';
import { Idp, LdapUser } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Auth')
@Controller('auth/meemoo')
export class MeemooController {
	private logger: Logger = new Logger(MeemooController.name, { timestamp: true });

	constructor(
		private meemooService: MeemooService,
		private idpService: IdpService,
		private usersService: UsersService,
		private collectionsService: CollectionsService,
		private configService: ConfigService,
		private eventsService: EventsService,
		private translationsService: TranslationsService
	) {}

	@Get('login')
	@Redirect()
	public async loginRoute(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string
	) {
		try {
			if (SessionHelper.isLoggedIn(session)) {
				return {
					url: returnToUrl,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}
			const url = await this.meemooService.createLoginRequestUrl(returnToUrl);
			return {
				url,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			Logger.error('Failed during meemoo auth login route', err);
		}
		// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
	}

	/**
	 * Called by SAML service to return LDAP info if user successfully logged in
	 * This function has to redirect the browser back to the app once the information is stored in the user's session
	 */
	@Post('login-callback')
	@Redirect()
	async loginCallback(
		@Req() request: Request,
		@Session() session: Record<string, any>,
		@Body() response: SamlCallbackBody
	): Promise<any> {
		let info: RelayState;
		try {
			info = response.RelayState ? JSON.parse(response.RelayState) : {};
			this.logger.debug(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);
			const ldapUser: LdapUser = await this.meemooService.assertSamlResponse(response);
			this.logger.debug(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);

			SessionHelper.setIdpUserInfo(session, Idp.MEEMOO, ldapUser);

			let archiefUser = await this.usersService.getUserByIdentityId(
				ldapUser.attributes.entryUUID[0]
			);

			// determine user group
			const userGroup = await this.idpService.determineUserGroup(ldapUser);

			const userDto = {
				firstName: ldapUser.attributes.givenName[0],
				lastName: ldapUser.attributes.sn[0],
				email: ldapUser.attributes.mail[0],
				groupId: userGroup,
			};

			if (!archiefUser) {
				this.logger.log(
					`User ${ldapUser.attributes.mail[0]} not found in our DB for ${Idp.MEEMOO}`
				);
				archiefUser = await this.usersService.createUserWithIdp(
					userDto,
					Idp.MEEMOO,
					ldapUser.attributes.entryUUID[0]
				);
				await this.collectionsService.create(
					{
						is_default: true,
						user_profile_id: archiefUser.id,
						name: this.translationsService.t(
							'modules/collections/controllers___default-collection-name'
						),
					},
					null // referer not important here
				);
			} else {
				if (
					!isEqual(
						pick(archiefUser, ['firstName', 'lastName', 'email', 'groupId']),
						userDto
					)
				) {
					// update user
					this.logger.debug(`User ${ldapUser.attributes.mail[0]} must be updated`);
					archiefUser = await this.usersService.updateUser(archiefUser.id, userDto);
				}
			}

			// Some userGroups require a link to the maintainer
			if (this.idpService.userGroupRequiresMaintainerLink(userGroup)) {
				await this.usersService.linkUserToMaintainer(
					archiefUser.id,
					get(ldapUser, 'attributes.o[0]')
				);
			}

			SessionHelper.setArchiefUserInfo(session, archiefUser);

			// Log event
			this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: LogEventType.USER_AUTHENTICATE,
					source: request.path,
					subject: archiefUser.id,
					time: new Date().toISOString(),
				},
			]);

			return {
				url: info.returnToUrl, // TODO add fallback if undefined
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			if (err.message === 'SAML Response is no longer valid') {
				return {
					url: `${getConfig(this.configService, 'host')}/auth/meemoo/login&returnToUrl=${
						info.returnToUrl
					}`,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}
			Logger.error('Failed during meemoo auth login-callback route', err);
			throw err;
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}

	@Get('logout')
	@Redirect()
	async logout(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string
	) {
		try {
			if (SessionHelper.isLoggedInWithIdp(Idp.MEEMOO, session)) {
				const idpUser = SessionHelper.getIdpUserInfo(session);
				const idpLogoutUrl = await this.meemooService.createLogoutRequestUrl(
					idpUser.name_id,
					returnToUrl
				);
				SessionHelper.logout(session);
				return {
					url: idpLogoutUrl,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}

			return {
				url: returnToUrl,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			Logger.error('Failed during meemoo auth logout route', err);
		}
		// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
	}

	/**
	 * Called by the identity provider service when a user logs out of another platform and the idp wants all platforms to logout
	 * This call should redirect to the idp logout response url
	 */
	@Post('logout-callback')
	@Redirect()
	async logoutCallbackPost(
		@Session() session: Record<string, any>,
		@Body() response: SamlCallbackBody
	): Promise<any> {
		try {
			SessionHelper.logout(session);

			if (response.SAMLResponse) {
				// response => user was requesting a logout starting in the archief2 client
				let returnToUrl: string;
				try {
					const relayState: any = JSON.parse(response.RelayState);
					returnToUrl = get(relayState, 'returnToUrl');
				} catch (err) {
					this.logger.error(
						'Received logout response from idp with invalid relayState',
						err
					);
				}

				return {
					url: returnToUrl,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}

			// request => user requested logout starting in another app and the idp is requesting archief2 to log the user out
			const responseUrl = await this.meemooService.createLogoutResponseUrl(
				response.RelayState
			);
			return {
				url: responseUrl, // TODO add fallback if undefined (possible scenario if the IDP initiates the logout action)
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during meemoo auth POST logout-callback route', err);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
