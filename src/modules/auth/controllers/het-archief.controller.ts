import { TranslationsService } from '@meemoo/admin-core-api';
import {
	Body,
	Controller,
	Get,
	HttpException,
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
import { Request, Response } from 'express';
import { get, isEmpty, isEqual, pick } from 'lodash';
import { stringifyUrl } from 'query-string';

import { Configuration } from '~config';

import { NO_ORG_LINKED } from '../constants';
import { HetArchiefService } from '../services/het-archief.service';
import { IdpService } from '../services/idp.service';
import { RelayState, SamlCallbackBody } from '../types';

import { orgNotLinkedLogoutAndRedirectToErrorPage } from '~modules/auth/org-not-linked-redirect';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { CollectionsService } from '~modules/collections/services/collections.service';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { Organisation } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { UsersService } from '~modules/users/services/users.service';
import { Permission } from '~modules/users/types';
import { Idp, LdapApp, LdapUser } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Auth')
@Controller('auth/hetarchief')
export class HetArchiefController {
	private logger: Logger = new Logger(HetArchiefController.name, { timestamp: true });

	constructor(
		private hetArchiefService: HetArchiefService,
		private idpService: IdpService,
		private usersService: UsersService,
		private collectionsService: CollectionsService,
		private configService: ConfigService<Configuration>,
		private eventsService: EventsService,
		private translationsService: TranslationsService,
		private organisationService: OrganisationsService,
		private campaignMonitorService: CampaignMonitorService
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

			const url = await this.hetArchiefService.createLoginRequestUrl(returnToUrl);
			return {
				url,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during hetarchief auth login route', err);
		}
		// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
	}

	@Get('register')
	@Redirect()
	public async registerRoute(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string
	) {
		try {
			const serverRedirectUrl = stringifyUrl({
				url: `${this.configService.get('HOST')}/auth/hetarchief/login`,
				query: { returnToUrl },
			});
			const url = stringifyUrl({
				url: this.configService.get('SSUM_REGISTRATION_PAGE'),
				query: {
					redirect_to: serverRedirectUrl,
					app_name: this.configService.get('SAML_SP_ENTITY_ID'),
				},
			});
			return {
				url,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			this.logger.error('Failed during hetarchief auth register route', err);
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
		@Body() response: SamlCallbackBody,
		@Res() res
	): Promise<any> {
		let info: RelayState;
		try {
			info = response.RelayState ? JSON.parse(response.RelayState) : {};
			this.logger.debug(`login-callback relay state: ${JSON.stringify(info, null, 2)}`);
			const ldapUser: LdapUser = await this.hetArchiefService.assertSamlResponse(response);
			this.logger.debug(`login-callback ldap info: ${JSON.stringify(ldapUser, null, 2)}`);

			SessionHelper.setIdpUserInfo(session, Idp.HETARCHIEF, ldapUser);

			const apps = ldapUser?.attributes?.apps ?? [];
			const organisationId = isEmpty(ldapUser?.attributes?.o)
				? null
				: ldapUser.attributes.o[0];

			let organisation: Organisation | null = null;
			if (organisationId) {
				organisation = await this.organisationService.findOrganisationBySchemaIdentifier(
					organisationId
				);
			}

			let archiefUser = await this.usersService.getUserByIdentityId(
				ldapUser.attributes.entryUUID[0]
			);

			if (archiefUser) {
				archiefUser = {
					...archiefUser,
					organisationId: organisationId,
					organisationName: organisation?.schemaName ?? null,
				};
			}

			// determine user group
			const userGroup = await this.idpService.determineUserGroup(ldapUser, organisation);

			const userDto = {
				firstName: ldapUser.attributes.givenName[0],
				lastName: ldapUser.attributes.sn[0],
				email: ldapUser.attributes.mail[0],
				groupId: userGroup,
				isKeyUser: apps.includes(LdapApp.CATALOGUS_PRO),
				organisationId,
				organisationName: organisation?.schemaName ?? null,
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
						pick(archiefUser, [
							'firstName',
							'lastName',
							'email',
							'groupId',
							'isKeyUser',
							'organisationId',
							'organisationName',
							'sector',
						]),
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
				// Refetch user to include visitor space info
				archiefUser = await this.usersService.getUserByIdentityId(
					ldapUser.attributes.entryUUID[0]
				);
			}

			// Inject CAN_EDIT_PROFILE_INFO permission only for users in HetArchief IDP
			archiefUser.permissions.push(Permission.CAN_EDIT_PROFILE_INFO);

			if (organisation) {
				archiefUser.sector = organisation?.sector || null;
				archiefUser.organisationId = organisation?.schemaIdentifier || null;
				archiefUser.organisationName = organisation?.schemaName || null;
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
						idp: Idp.HETARCHIEF,
						user_group_name: archiefUser.groupName,
						user_group_id: archiefUser.groupId,
					},
				},
			]);

			return {
				url: info.returnToUrl, // TODO add fallback if undefined
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			};
		} catch (err) {
			const proxyHost = this.configService.get('HOST');
			if (err.message === 'SAML Response is no longer valid') {
				return {
					url: `${proxyHost}/auth/hetarchief/login&returnToUrl=${info.returnToUrl}`,
					statusCode: HttpStatus.TEMPORARY_REDIRECT,
				};
			}
			if (err.message.includes(NO_ORG_LINKED)) {
				this.logger.debug('orgNotLinkedLogoutAndRedirectToErrorPage');

				return orgNotLinkedLogoutAndRedirectToErrorPage(
					res,
					proxyHost,
					Idp.HETARCHIEF,
					`${err.message}`.replace(NO_ORG_LINKED, ''),
					this.translationsService.t(
						'modules/auth/controllers/het-archief___account-configuratie'
					)
				);
			}
			this.logger.error('Failed during hetarchief auth login-callback route', err);
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: err.message,
				},
				HttpStatus.FORBIDDEN
			);
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}

	@Get('logout')
	@Redirect()
	async logout(
		@Session() session: Record<string, any>,
		@Query('returnToUrl') returnToUrl: string,
		@Query('forceLogout') forceLogout: 'true' | 'false' = 'false'
	) {
		try {
			if (
				forceLogout === 'true' ||
				SessionHelper.isLoggedInWithIdp(Idp.HETARCHIEF, session)
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
		}
		// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
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
					this.logger.error(
						'Received logout response from idp with invalid relayState',
						err
					);
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
			// TODO redirect user to error page (see AVO - redirectToClientErrorPage)
		}
	}
}
