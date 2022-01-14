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

import { MeemooService } from '../services/meemoo.service';
import { LdapUser, RelayState, SamlCallbackBody } from '../types';

@Controller('auth/meemoo')
export class MeemooController {
	constructor(private meemooService: MeemooService) {}

	@Get('login')
	@Redirect()
	public async getAuth(@Query('returnToUrl') returnToUrl: string) {
		try {
			// TODO if already logged in, directly redirect to the returnToUrl
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
		@Req() request: Express.Request,
		@Body() response: SamlCallbackBody
	): Promise<any> {
		try {
			const ldapUser: LdapUser = await this.meemooService.assertSamlResponse(response);
			Logger.log(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);
			const info: RelayState = response.RelayState ? JSON.parse(response.RelayState) : {};
			Logger.log(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);
			/**
			 * TODO opm Ineke:
			 * Enkel CP medewerkers met een specifieke setting in de meemoo idp mogen toegang krijgen als admin tot de leeszaal.
				Dit zal een vinkje zijn dat manueel wordt aangezet wordt door een meemoo medewerker van team TAM.
			 */

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
