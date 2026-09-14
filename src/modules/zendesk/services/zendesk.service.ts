import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addSeconds, isFuture } from 'date-fns';
import zendesk from 'node-zendesk';

import { CreateIeObjectSupportRequestDto, CreateTicketRequestDto } from '../dto/zendesk.dto';
import {
	type CreateTicketResponse,
	REPORT_LEGAL_REASON_LABELS,
	REPORT_REASON_LABELS,
	ReportReason,
	type ZendeskAccessToken,
	type ZendeskOauthTokenResponse,
} from '../zendesk.types';

import type { Configuration } from '~config';
import {
	ConsentToTrackOption,
	EmailTemplate,
} from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { ContactPointType } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { checkRequiredEnvs } from '~shared/helpers/env-check';

/**
 * Zendesk is retiring api tokens (email + token over http basic auth) as an authentication method.
 * All remaining api tokens stop working on 2027-04-30, so we authenticate with a short lived oauth
 * access token obtained through the client credentials grant instead.
 * @see https://developer.zendesk.com/documentation/authentication/oauth-migration/
 */

// Refetch the access token this many seconds before it actually expires
const TOKEN_EXPIRE_MARGIN_SECONDS = 60;

// Fallback lifetime for oauth clients that were created before 2026-04-30 and have no expires_in
const TOKEN_DEFAULT_EXPIRES_IN_SECONDS = 1800;

// Scope required by POST /requests.json. Note that this is NOT covered by tickets:write: the
// requests api (end user requests) and the tickets api (agent side tickets) have separate scopes.
// The oauth client has to be granted this scope in the zendesk admin center, otherwise the token
// endpoint replies with invalid_scope.
const TOKEN_SCOPE = 'requests:write';

@Injectable()
export class ZendeskService {
	private static logger: Logger = new Logger(ZendeskService.name, { timestamp: true });
	private static accessToken: ZendeskAccessToken | null = null;

	constructor(
		private campaignMonitorService: CampaignMonitorService,
		private organisationsService: OrganisationsService,
		private configService: ConfigService<Configuration>
	) {}

	public static initialize() {
		checkRequiredEnvs([
			'ZENDESK_ENDPOINT',
			'ZENDESK_TOKEN_ENDPOINT',
			'ZENDESK_CLIENT_ID',
			'ZENDESK_CLIENT_SECRET',
		]);
	}

	/**
	 * Get an oauth access token for the zendesk api, reusing the cached one while it is still valid
	 * @param forceRefresh ignore the cached token, eg: after the zendesk api rejected it with a 401
	 */
	private static async getAccessToken(forceRefresh = false): Promise<string> {
		try {
			const existingToken = ZendeskService.accessToken;
			const isTokenStillValid =
				!forceRefresh &&
				existingToken &&
				isFuture(
					addSeconds(existingToken.createdAt, existingToken.expiresIn - TOKEN_EXPIRE_MARGIN_SECONDS)
				);
			if (isTokenStillValid) {
				return existingToken.accessToken;
			}

			const response = await fetch(process.env.ZENDESK_TOKEN_ENDPOINT as string, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					grant_type: 'client_credentials',
					client_id: process.env.ZENDESK_CLIENT_ID as string,
					client_secret: process.env.ZENDESK_CLIENT_SECRET as string,
					scope: TOKEN_SCOPE,
				}),
			});
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError(
					'The zendesk oauth token endpoint returned an unexpected status code',
					null,
					{
						status: response.status,
						statusText: response.statusText,
						responseBody: await response.text().catch(() => null),
					}
				);
			}

			// The client credentials grant does not return a refresh token, we simply request a new one
			const token = (await response.json()) as ZendeskOauthTokenResponse;
			ZendeskService.accessToken = {
				accessToken: token.access_token,
				expiresIn: token.expires_in || TOKEN_DEFAULT_EXPIRES_IN_SECONDS,
				createdAt: new Date(),
			};
			return token.access_token;
		} catch (err) {
			const error = new CustomError('Failed to get an access token for the zendesk api', err, {
				tokenEndpoint: process.env.ZENDESK_TOKEN_ENDPOINT,
			});
			ZendeskService.logger.error(error);
			throw error;
		}
	}

	/**
	 * The access token expires, so the client has to be built per request instead of once at startup
	 */
	private static async getClient(forceRefreshToken = false) {
		return zendesk.createClient({
			oauth: true,
			token: await ZendeskService.getAccessToken(forceRefreshToken),
			remoteUri: process.env.ZENDESK_ENDPOINT as string,
			// Only used for basic auth, but required by the node-zendesk typings
			username: '',
		});
	}

	/**
	 * Create a new ticket in zendesk
	 * @param request
	 */
	public static async createTicket(request: CreateTicketRequestDto): Promise<CreateTicketResponse> {
		try {
			return await ZendeskService.createTicketWithToken(request);
		} catch (err) {
			// The token can be revoked before it expires, in that case retry once with a fresh token
			if ((err as { statusCode?: number })?.statusCode === 401) {
				ZendeskService.logger.warn(
					'The zendesk api rejected our access token, retrying with a new one'
				);
				return await ZendeskService.createTicketWithToken(request, true);
			}
			throw err;
		}
	}

	private static async createTicketWithToken(
		request: CreateTicketRequestDto,
		forceRefreshToken = false
	): Promise<CreateTicketResponse> {
		const client = await ZendeskService.getClient(forceRefreshToken);
		return new Promise<CreateTicketResponse>((resolve, reject) => {
			try {
				client.requests.create(
					{ request },
					(error: Error | undefined, response: any, result: any) => {
						error ? reject(error) : resolve(result);
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to create ticket through the zendesk api',
					innerException: err,
					additionalInfo: { request },
				});
				ZendeskService.logger.error(error);
				reject(error);
			}
		});
	}

	/**
	 * Report a problem with an ie-object. A metadata issue emails the object's maintainer (or
	 * meemoo support as a fallback) directly and never creates a Zendesk ticket; any other reason
	 * creates a Zendesk ticket and never sends an email.
	 */
	public async createIeObjectSupportTicket(
		dto: CreateIeObjectSupportRequestDto
	): Promise<CreateTicketResponse | undefined> {
		// The own-org self-fix screen never calls this endpoint, so METADATA_ISSUE here always
		// means the other-org variant, which needs a maintainerId to look up who to email.
		if (dto.reportReason === ReportReason.METADATA_ISSUE) {
			await this.notifyMaintainerOfMetadataIssue(dto);
			return undefined;
		}

		return await ZendeskService.createTicket(ZendeskService.buildIeObjectSupportTicket(dto));
	}

	private static buildIeObjectSupportTicket(
		dto: CreateIeObjectSupportRequestDto
	): CreateTicketRequestDto {
		const reasonLabel = REPORT_REASON_LABELS[dto.locale][dto.reportReason];
		const legalReasonLabel = dto.reportLegalReason
			? REPORT_LEGAL_REASON_LABELS[dto.locale][dto.reportLegalReason]
			: undefined;
		const subject = [reasonLabel, legalReasonLabel].filter(Boolean).join(' - ');

		return {
			subject,
			comment: {
				url: dto.url,
				body: dto.message,
				html_body: `<dl><dt>${reasonLabel}</dt><dd>${dto.message}</dd><dt>URL</dt><dd>${dto.url}</dd></dl>`,
				public: false,
			},
			requester: {
				name: dto.name || 'Anonymous',
				email: dto.email,
			},
		};
	}

	private async notifyMaintainerOfMetadataIssue(
		dto: CreateIeObjectSupportRequestDto
	): Promise<void> {
		let contactEmail: string | undefined;
		if (dto.maintainerId) {
			const [organisation] = await this.organisationsService.findOrganisationsBySchemaIdentifiers([
				dto.maintainerId,
			]);
			contactEmail = organisation?.contactPoint?.find(
				(contactPoint) => contactPoint.contactType === ContactPointType.ontsluiting
			)?.email;
		}

		if (!contactEmail) {
			ZendeskService.logger.warn(
				`No "ontsluiting" contact email found for maintainer ${dto.maintainerId}, falling back to the meemoo support address for the metadata issue notification email`
			);
		}

		await this.campaignMonitorService.sendTransactionalMail(
			{
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_REPORT_METADATA_ISSUE_IE_OBJECT,
				data: {
					to: contactEmail || this.configService.get('MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK'),
					replyTo: dto.email || null,
					consentToTrack: ConsentToTrackOption.UNCHANGED,
					data: {
						reporter_name: dto.name,
						reporter_email: dto.email,
						message: dto.message,
						object_url: dto.url,
						mam_url: dto.mamUrl,
						ai_meemoo_url: dto.aiMeemooUrl,
					},
				},
			},
			dto.locale
		);
	}
}
