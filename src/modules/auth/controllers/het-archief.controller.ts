import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Logger,
	Post,
	Query,
	Redirect,
	Session,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { get, isEqual, pick } from 'lodash';

import { HetArchiefService } from '../services/het-archief.service';
import { RelayState, SamlCallbackBody } from '../types';

import { CollectionsService } from '~modules/collections/services/collections.service';
import { UsersService } from '~modules/users/services/users.service';
import { Permission } from '~modules/users/types';
import { Idp, LdapUser } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import i18n from '~shared/i18n';

@ApiTags('Auth')
@Controller('auth/hetarchief')
export class HetArchiefController {
	private logger: Logger = new Logger(HetArchiefController.name, { timestamp: true });

	constructor(
		private hetArchiefService: HetArchiefService,
		private usersService: UsersService,
		private collectionsService: CollectionsService,
		private configService: ConfigService
	) {}

	@Get('login')
	@Redirect()
	public async getAuth(
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
			const url = await this.hetArchiefService.createLoginRequestUrl(returnToUrl);
			return {
				url,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			Logger.error('Failed during hetarchief auth login route', err);
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
		@Session() session: Record<string, any>,
		@Body() response: SamlCallbackBody
	): Promise<any> {
		let info: RelayState;
		try {
			info = response.RelayState ? JSON.parse(response.RelayState) : {};
			this.logger.debug(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);
			const ldapUser: LdapUser = await this.hetArchiefService.assertSamlResponse(response);
			this.logger.debug(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);

			// permissions check
			const apps = get(ldapUser, 'attributes.apps', []);
			if (
				!apps.includes('hetarchief') &&
				!apps.includes('admins') // TODO replace by a single value once archief 2.0 is launched
			) {
				// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
				this.logger.error(
					`User ${ldapUser.attributes.mail[0]} has no access to app 'hetarchief'`
				);
				throw new UnauthorizedException(
					`User ${ldapUser.attributes.mail[0]} has no access to app 'hetarchief'`
				);
			}

			SessionHelper.setIdpUserInfo(session, Idp.HETARCHIEF, ldapUser);

			let archiefUser = await this.usersService.getUserByIdentityId(
				ldapUser.attributes.entryUUID[0]
			);

			const userDto = {
				firstName: ldapUser.attributes.givenName[0],
				lastName: ldapUser.attributes.sn[0],
				email: ldapUser.attributes.mail[0],
			};

			if (!archiefUser) {
				this.logger.log(
					`User ${ldapUser.attributes.mail[0]} not found in our DB for ${Idp.HETARCHIEF}`
				);

				archiefUser = await this.usersService.createUserWithIdp(
					userDto,
					Idp.HETARCHIEF,
					ldapUser.attributes.entryUUID[0]
				);
				await this.collectionsService.create({
					is_default: true,
					user_profile_id: archiefUser.id,
					name: i18n.t('modules/collections/controllers___default-collection-name'),
				});
			} else {
				if (!isEqual(pick(archiefUser, ['firstName', 'lastName', 'email']), userDto)) {
					// update user
					this.logger.debug(`User ${ldapUser.attributes.mail[0]} must be updated`);
					archiefUser = await this.usersService.updateUser(archiefUser.id, userDto);
				}
			}

			// TODO remove this temp permissions array once we can login wit the correct user group --------------------------
			archiefUser.permissions = [
				Permission.CAN_READ_ALL_VISIT_REQUESTS,
				Permission.CAN_READ_CP_VISIT_REQUESTS,
				Permission.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
				Permission.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
			];
			// TODO remove until here ----------------------------------------------------------------------------------------

			SessionHelper.setArchiefUserInfo(session, archiefUser);

			return {
				url: info.returnToUrl, // TODO add fallback if undefined
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			if (err.message === 'SAML Response is no longer valid') {
				return {
					url: `${this.configService.get('host')}/auth/hetarchief/login&returnToUrl=${
						info.returnToUrl
					}`,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}
			this.logger.error('Failed during hetarchief auth login-callback route', err);
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
			if (SessionHelper.isLoggedInWithIdp(Idp.HETARCHIEF, session)) {
				const idpUser = SessionHelper.getIdpUserInfo(session);
				const idpLogoutUrl = await this.hetArchiefService.createLogoutRequestUrl(
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
			Logger.error('Failed during hetarchief auth logout route', err);
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
			const responseUrl = await this.hetArchiefService.createLogoutResponseUrl(
				response.RelayState
			);
			return {
				url: responseUrl, // TODO add fallback if undefined (possbile scenario if the IDP initiates the logout action)
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during hetarchief auth POST logout-callback route', err);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
