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
import { get, isEqual, omit } from 'lodash';

import { MeemooService } from '../services/meemoo.service';
import { SessionHelper } from '../session-helper';
import { Idp, LdapUser, RelayState, SamlCallbackBody } from '../types';

import { UsersService } from '~modules/users/services/users.service';

@Controller('auth/meemoo')
export class MeemooController {
	private logger: Logger = new Logger(MeemooController.name, { timestamp: true });

	constructor(private meemooService: MeemooService, private usersService: UsersService) {}

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
		@Session() session: Record<string, any>,
		@Body() response: SamlCallbackBody
	): Promise<any> {
		try {
			const ldapUser: LdapUser = await this.meemooService.assertSamlResponse(response);
			this.logger.debug(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);
			const info: RelayState = response.RelayState ? JSON.parse(response.RelayState) : {};
			this.logger.debug(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);

			/**
			 * permissions check
			 * TODO opm Ineke: - nu een dummy implementatie. Op dit moment is er nog geen apps property.
			 * Als dit uitgeklaard is wat in 'apps' gespecifieerd moet zijn, ook test hiervoor toevoegen (analoog aan het-archief controller)
			 * Enkel CP medewerkers met een specifieke setting in de meemoo idp mogen toegang krijgen als admin tot de leeszaal.
			 * Dit zal een vinkje zijn dat manueel wordt aangezet wordt door een meemoo medewerker van team TAM.
			 */
			// if (!get(ldapUser, 'attributes.apps', []).includes('meemoo')) {
			// 	// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
			// 	this.logger.error(
			// 		`User ${ldapUser.attributes.mail[0]} has no access to app 'meemoo'`
			// 	);
			// 	throw new UnauthorizedException();
			// }

			SessionHelper.setIdpUserInfo(session, Idp.MEEMOO, ldapUser);

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
					`User ${ldapUser.attributes.mail[0]} not found in our DB for ${Idp.MEEMOO}`
				);
				archiefUser = await this.usersService.createUserWithIdp(
					userDto,
					Idp.MEEMOO,
					ldapUser.attributes.entryUUID[0]
				);
			} else {
				if (!isEqual(omit(archiefUser, ['id']), userDto)) {
					// update user
					this.logger.debug(`User ${ldapUser.attributes.mail[0]} must be updated`);
					archiefUser = await this.usersService.updateUser(archiefUser.id, userDto);
				}
			}

			SessionHelper.setArchiefUserInfo(session, archiefUser);

			return {
				url: info.returnToUrl, // TODO add fallback if undefined
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
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
				url: responseUrl, // TODO add fallback if undefined (possbile scenario if the IDP initiates the logout action)
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during meemoo auth POST logout-callback route', err);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
