import { TranslationsService } from '@meemoo/admin-core-api';
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
	Res,
	Session,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AvoAuthIdpType } from '@viaa/avo2-types';
import type { Request, Response } from 'express';
import { get, isEmpty, isEqual, pick } from 'lodash';
import queryString from 'query-string';

import type { Configuration } from '~config';

import { NO_ORG_LINKED } from '../constants';

import { HetArchiefService } from '../services/het-archief.service';

import { IdpService } from '../services/idp.service';
import type { RelayState, SamlCallbackBody } from '../types';

import { getErrorPageUrl } from '~modules/auth/error-page-redirect';
import { orgNotLinkedLogoutAndRedirectToErrorPage } from '~modules/auth/org-not-linked-redirect';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';

import { FoldersService } from '~modules/folders/services/folders.service';
import type { Organisation } from '~modules/organisations/organisations.types';

import { OrganisationsService } from '~modules/organisations/services/organisations.service';

import { CreateOrUpdateUserDto } from '~modules/users/dto/users.dto';
import { UsersService } from '~modules/users/services/users.service';
import { LdapApp, type LdapUser } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import { EventsHelper } from '~shared/helpers/events';
import { Locale } from '~shared/types/types';

@ApiTags('Auth')
@Controller('auth/hetarchief')
export class HetArchiefController {
	private logger: Logger = new Logger(HetArchiefController.name, { timestamp: true });

	constructor(
		private hetArchiefService: HetArchiefService,
		private idpService: IdpService,
		private usersService: UsersService,
		private foldersService: FoldersService,
		private configService: ConfigService<Configuration>,
		private eventsService: EventsService,
		private translationsService: TranslationsService,
		private organisationService: OrganisationsService
	) {}

	/**
	 * Url of the error page that explains to the user that logging in, registering or logging out failed
	 * @param action which auth action failed
	 * @param language language of the title and message
	 */
	private getAuthErrorPageUrl(
		action: 'login' | 'register' | 'logout',
		language: Locale | string | undefined
	): string {
		const locale = language === Locale.En ? Locale.En : Locale.Nl;
		const texts = {
			login: {
				title: 'modules/auth/controllers/het-archief___inloggen-mislukt',
				message:
					'modules/auth/controllers/het-archief___er-ging-iets-mis-bij-het-inloggen-probeer-het-later-opnieuw',
			},
			register: {
				title: 'modules/auth/controllers/het-archief___registreren-mislukt',
				message:
					'modules/auth/controllers/het-archief___er-ging-iets-mis-bij-het-registreren-probeer-het-later-opnieuw',
			},
			logout: {
				title: 'modules/auth/controllers/het-archief___uitloggen-mislukt',
				message:
					'modules/auth/controllers/het-archief___er-ging-iets-mis-bij-het-uitloggen-probeer-het-later-opnieuw',
			},
		}[action];
		return getErrorPageUrl(
			this.configService.get('HOST'),
			this.translationsService.tText(texts.title, null, locale),
			this.translationsService.tText(texts.message, null, locale)
		);
	}

	@Get('login')
	@Redirect()
	public async loginRoute(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string,
		@Query('language') language: Locale = Locale.Nl
	) {
		try {
			if (SessionHelper.isLoggedIn(session)) {
				return {
					url: returnToUrl,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}

			const url = await this.hetArchiefService.createLoginRequestUrl(returnToUrl, language);
			return {
				url,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during hetarchief auth login route', err);
			return {
				url: this.getAuthErrorPageUrl('login', language),
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		}
	}

	/**
	 * Called by SAML service to return LDAP info if user successfully logged in
	 * This function has to redirect the browser back to the app once the information is stored in the user's session
	 */
	@Post('login-callback')
	async loginCallback(
		@Req() request: Request,
		@Session() session: Record<string, any>,
		@Body() body: SamlCallbackBody,
		@Res() response: Response
	): Promise<any> {
		let info: RelayState;
		try {
			info = body.RelayState ? JSON.parse(body.RelayState) : {};
			const ldapUser: LdapUser = await this.hetArchiefService.assertSamlResponse(body);
			this.logger.debug(
				`login-callback ldap info: ${JSON.stringify(ldapUser, null, process.env.SINGLE_LINE_LOGGING === 'true' ? 0 : 2)}`
			);

			SessionHelper.setIdpUserInfo(session, AvoAuthIdpType.HETARCHIEF, ldapUser);

			const apps = ldapUser?.attributes?.apps ?? [];

			// Prefer an organisation with an OR-id instead of a school
			// TODO wait for schools to be available in the organisation api cache and identify the business vs the schools
			const organisationId = isEmpty(ldapUser?.attributes?.o)
				? null
				: ldapUser.attributes.o.find((org) => org.toLowerCase().startsWith('or')) ||
					ldapUser.attributes.o[0];

			let organisation: Organisation | null = null;
			if (organisationId) {
				organisation = (
					await this.organisationService.findOrganisationsBySchemaIdentifiers([organisationId])
				)[0];
			}

			let archiefUser = await this.usersService.getUserByIdentityId(
				ldapUser.attributes.entryUUID[0]
			);

			// determine user group
			const userGroup = await this.idpService.determineUserGroup(
				ldapUser,
				organisation,
				(archiefUser?.language || Locale.Nl) as Locale
			);

			const userDto: CreateOrUpdateUserDto = {
				firstName: ldapUser.attributes.givenName[0],
				lastName: ldapUser.attributes.sn[0],
				email: ldapUser.attributes.mail[0],
				groupId: userGroup,
				isKeyUser: apps.includes(LdapApp.CATALOGUS_PRO),
				isEvaluator: apps.includes(LdapApp.EVALUATOR_ROLE),
				organisationId,
				language: archiefUser?.language || info.language || Locale.Nl,
			};

			if (!archiefUser) {
				archiefUser = await this.usersService.createUserWithIdp(
					userDto,
					AvoAuthIdpType.HETARCHIEF,
					ldapUser.attributes.entryUUID[0]
				);
				const locale = (archiefUser?.language || Locale.Nl) as Locale;
				await this.foldersService.create(
					{
						is_default: true,
						user_profile_id: archiefUser.id,
						name: this.translationsService.tText(
							'modules/folders/controllers___default-collection-name',
							null,
							locale
						),
					},
					null, // referer not important here
					''
				);

				this.eventsService.insertEvents([
					{
						source: '/',
						data: {
							idp: AvoAuthIdpType.HETARCHIEF,
							...this.eventsService.mapUserToEventData(archiefUser),
						},
						subject: archiefUser.id,
						type: LogEventType.USER_CREATE,
						time: new Date().toISOString(),
						id: EventsHelper.getEventId(request),
					},
				]);
			} else {
				if (
					!isEqual(
						pick(archiefUser, [
							'firstName',
							'lastName',
							'email',
							'groupId',
							'isKeyUser',
							'isEvaluator',
							'organisationId',
							'language',
						]),
						pick(userDto, [
							'firstName',
							'lastName',
							'email',
							'groupId',
							'isKeyUser',
							'isEvaluator',
							'organisationId',
							'language',
						])
					)
				) {
					// update user
					archiefUser = await this.usersService.updateUser(archiefUser.id, userDto);
				}
			}

			if (!archiefUser) {
				throw new Error('hetarchief user could not be found nor be created');
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
					data: {
						idp: AvoAuthIdpType.HETARCHIEF,
						...this.eventsService.mapUserToEventData(archiefUser),
					},
				},
			]);

			// Replace duplicate language parameters:
			// http://localhost:3200/nl/nl/nl/account/mijn-mappen/favorieten
			// =>
			// http://localhost:3200/nl/account/mijn-mappen/favorieten
			const returnToUrlCleaned = (info.returnToUrl || this.configService.get('CLIENT_HOST'))
				.replace(/\/nl\/(nl\/)*/, '/nl/')
				.replace(/\/en\/(en\/)*/, '/en/');
			response.redirect(returnToUrlCleaned);
		} catch (err) {
			const proxyHost = this.configService.get('HOST');
			// This route uses @Res(), so redirects have to be sent through the response, returned values are ignored
			if (err?.message === 'SAML Response is no longer valid') {
				response.redirect(
					queryString.stringifyUrl({
						url: `${proxyHost}/auth/hetarchief/login`,
						query: { returnToUrl: info?.returnToUrl, language: info?.language },
					})
				);
				return;
			}
			if (err?.message?.includes(NO_ORG_LINKED)) {
				this.logger.debug('orgNotLinkedLogoutAndRedirectToErrorPage');

				const { url } = orgNotLinkedLogoutAndRedirectToErrorPage(
					response,
					proxyHost,
					AvoAuthIdpType.HETARCHIEF,
					`${err.message}`.replace(NO_ORG_LINKED, ''),
					this.translationsService.tText(
						'modules/auth/controllers/het-archief___account-configuratie',
						null,
						Locale.En
					)
				);
				response.redirect(url);
				return;
			}
			this.logger.error('Failed during hetarchief auth login-callback route', err);
			response.redirect(this.getAuthErrorPageUrl('login', info?.language));
		}
	}

	@Get('register')
	@Redirect()
	public async registerRoute(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string,
		@Query('locale') locale: Locale = Locale.Nl
	) {
		try {
			const serverRedirectUrl = queryString.stringifyUrl({
				url: `${this.configService.get('HOST')}/auth/hetarchief/login`,
				query: { returnToUrl },
			});
			const url = queryString.stringifyUrl({
				url: decodeURIComponent(this.configService.get('SSUM_REGISTRATION_PAGE')).replace(
					'{locale}',
					locale
				),
				query: {
					redirect_to: serverRedirectUrl,
					app_name: this.configService.get('SAML_SP_ENTITY_ID'),
					client_id: this.configService.get('KEYCLOAK_CLIENT_ID') ?? '',
					response_type: 'code',
					redirect_uri: serverRedirectUrl,
					prompt: 'create',
					kc_locale: locale,
				},
			});
			return {
				url,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during hetarchief auth register route', err);
			return {
				url: this.getAuthErrorPageUrl('register', locale),
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		}
	}

	@Get('logout')
	@Redirect()
	async logout(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string,
		@Query('forceLogout') forceLogout: 'true' | 'false' = 'false'
	) {
		// Read the language before logging out, since logging out clears the user from the session
		const language = SessionHelper.getArchiefUserInfo(session)?.language;
		try {
			if (
				forceLogout === 'true' ||
				SessionHelper.isLoggedInWithIdp(AvoAuthIdpType.HETARCHIEF, session)
			) {
				const idpUser = SessionHelper.getIdpUserInfo(session);
				const idpLogoutUrl = await this.hetArchiefService.createLogoutRequestUrl(
					idpUser?.name_id || 'kiosk',
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
			this.logger.error('Failed during hetarchief auth logout route', err);
			return {
				url: this.getAuthErrorPageUrl('logout', language),
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		}
	}

	/**
	 * Called by the identity provider service when a user logs out of another platform and the idp wants all platforms to logout
	 * This call should redirect to the idp logout response url
	 */
	@Post('logout-callback')
	async logoutCallbackPost(
		@Session() session: Record<string, any>,
		@Body() samlCallbackBody: SamlCallbackBody,
		@Res() response: Response
	): Promise<any> {
		try {
			SessionHelper.logout(session);

			if (samlCallbackBody.SAMLResponse) {
				// response => user was requesting a logout starting in the archief2 client
				let returnToUrl: string;
				try {
					const relayState: any = JSON.parse(samlCallbackBody.RelayState);
					returnToUrl = get(relayState, 'returnToUrl');
				} catch (err) {
					this.logger.error('Received logout response from idp with invalid relayState', err);
				}

				response.redirect(returnToUrl);
				return;
			}

			// request => user requested logout starting in another app and the idp is requesting archief2 to log the user out
			const responseUrl = await this.hetArchiefService.createLogoutResponseUrl(
				samlCallbackBody.RelayState
			);
			response.redirect(responseUrl);
		} catch (err) {
			this.logger.error('Failed during hetarchief auth POST logout-callback route', err);
			response.redirect(this.getAuthErrorPageUrl('logout', undefined));
		}
	}
}
