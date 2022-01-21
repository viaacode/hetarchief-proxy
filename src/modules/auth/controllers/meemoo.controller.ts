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
	private logger: Logger = new Logger('MeemooController', { timestamp: true });

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
		try {
			const ldapUser: LdapUser = await this.meemooService.assertSamlResponse(response);
			this.logger.debug(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);
			const info: RelayState = response.RelayState ? JSON.parse(response.RelayState) : {};
			this.logger.debug(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);

			/**
			 * permissions check
			 * TODO opm Ineke: - nu een dummy implementatie
			 * Enkel CP medewerkers met een specifieke setting in de meemoo idp mogen toegang krijgen als admin tot de leeszaal.
			 * Dit zal een vinkje zijn dat manueel wordt aangezet wordt door een meemoo medewerker van team TAM.
			 */
			if (!get(ldapUser, 'attributes.apps', []).includes('meemoo')) {
				// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
				this.logger.error(
					`User ${ldapUser.attributes.mail[0]} has no access to app 'hetarchief'`
				);
				throw new UnauthorizedException();
			}

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
				url: info.returnToUrl, // TODO add fallback if undefined (possbile scenario if the IDP initiates the logout action)
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			Logger.error('Failed during hetarchief auth login-callback route', err);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
