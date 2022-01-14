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
} from '@nestjs/common';

import { HetArchiefService } from '../services/het-archief.service';
import { LdapUser, RelayState, SamlCallbackBody } from '../types';

@Controller('auth/hetarchief')
export class HetArchiefController {
	constructor(private hetArchiefService: HetArchiefService) {}

	@Get('login')
	@Redirect()
	public async getAuth(@Query('returnToUrl') returnToUrl: string) {
		try {
			// TODO if already logged in, directly redirect to the returnToUrl
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
		@Req() request: Express.Request,
		@Body() response: SamlCallbackBody
	): Promise<any> {
		try {
			const ldapUser: LdapUser = await this.hetArchiefService.assertSamlResponse(response);
			Logger.log(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);
			const info: RelayState = response.RelayState ? JSON.parse(response.RelayState) : {};
			Logger.log(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);

			// IdpHelper.setIdpUserInfoOnSession(request, ldapUser, 'HETARCHIEF');

			return {
				ldapUser,
				info: info.returnToUrl,
			};
		} catch (err) {
			Logger.error('Failed during hetarchief auth login-callback route', err);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
