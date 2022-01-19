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

import { UsersService } from '../../users/services/users.service';
import { HetArchiefService } from '../services/het-archief.service';
import { SessionHelper } from '../session-helper';
import { Idp, LdapUser, RelayState, SamlCallbackBody } from '../types';

@Controller('auth/hetarchief')
export class HetArchiefController {
	private logger: Logger = new Logger('HetArchiefController', { timestamp: true });

	constructor(private hetArchiefService: HetArchiefService, private usersService: UsersService) {}

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
		try {
			const ldapUser: LdapUser = await this.hetArchiefService.assertSamlResponse(response);
			this.logger.debug(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);
			const info: RelayState = response.RelayState ? JSON.parse(response.RelayState) : {};
			this.logger.debug(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);

			// permissions check
			if (!get(ldapUser, 'attributes.apps', []).includes('hetarchief')) {
				// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
				this.logger.error(
					`User ${ldapUser.attributes.mail[0]} has no access to app 'hetarchief'`
				);
				throw new UnauthorizedException();
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
			} else {
				if (!isEqual(omit(archiefUser, ['id']), userDto)) {
					// update user
					this.logger.debug(`User ${ldapUser.attributes.mail[0]} must be updated`);
					archiefUser = await this.usersService.updateUser(archiefUser.id, userDto);
				}
			}

			SessionHelper.setArchiefUserInfo(session, archiefUser);

			return {
				url: info.returnToUrl,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during hetarchief auth login-callback route', err);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
