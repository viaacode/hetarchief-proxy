import { TranslationsService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	type OnApplicationBootstrap,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import * as promiseUtils from 'blend-promise-utils';
import { groupBy, head, isArray, isEmpty, isNil, toPairs } from 'lodash';
import * as queryString from 'query-string';
import { stringifyUrl } from 'query-string';

import type { Configuration } from '~config';

import { getTemplateId } from '../campaign-monitor.consts';
import {
	CampaignMonitorCustomFieldName,
	type CampaignMonitorNewsletterPreferences,
	type CampaignMonitorUserInfo,
	CmSendEmailInfo,
	type CmSubscriberResponse,
	ConsentToTrackOption,
	EmailTemplate,
	type MaterialRequestEmailInfo,
	type VisitEmailInfo,
} from '../campaign-monitor.types';
import {
	CampaignMonitorConfirmMailQueryDto,
	CampaignMonitorConfirmationData,
	CampaignMonitorData,
	CampaignMonitorMaterialRequestData,
	CampaignMonitorNewsletterUpdatePreferencesQueryDto,
	CampaignMonitorSendMailDto,
	CampaignMonitorUpdatePreferencesData,
	CampaignMonitorVisitData,
} from '../dto/campaign-monitor.dto';
import { decryptData, encryptData } from '../helpers/crypto-helper';

import {
	MaterialRequestRequesterCapacity,
	MaterialRequestType,
} from '~modules/material-requests/material-requests.types';
import type { VisitRequest } from '~modules/visits/types';
import { customError } from '~shared/helpers/custom-error';
import { checkRequiredEnvs } from '~shared/helpers/env-check';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';
import type { Locale } from '~shared/types/types';

@Injectable()
export class CampaignMonitorService implements OnApplicationBootstrap {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private isEnabled: boolean;
	private clientHost: string;
	private rerouteEmailsTo: string;
	private subscriberEndpoint: string;
	private newsletterListId: string;

	constructor(
		private configService: ConfigService<Configuration>,
		protected translationsService: TranslationsService
	) {
		checkRequiredEnvs([
			'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT',
			'CAMPAIGN_MONITOR_API_ENDPOINT',
			'CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT',
			'CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF',
		]);

		this.isEnabled = this.configService.get('ENABLE_SEND_EMAIL');
		this.rerouteEmailsTo = this.configService.get('REROUTE_EMAILS_TO');
		this.subscriberEndpoint = this.configService.get('CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT');
		this.newsletterListId = this.configService.get('CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF');

		this.clientHost = this.configService.get('CLIENT_HOST');
	}

	public async onApplicationBootstrap() {
		await this.translationsService.refreshBackendTranslations();
	}

	public async makeCmApiRequest<T>(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
		data?: any | undefined,
		throwErrors = true
	): Promise<T> {
		try {
			let normalizedPath = path;
			if (!path.startsWith('/')) {
				normalizedPath = `/${path}`;
			}
			const url = this.configService.get('CAMPAIGN_MONITOR_API_ENDPOINT') + normalizedPath;
			const response = await fetch(url, {
				method: method,
				...(data ? { body: JSON.stringify(data) } : undefined),
				credentials: 'include',
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${this.configService.get('CAMPAIGN_MONITOR_API_KEY')}:.`
					).toString('base64')}`,
				},
			});
			if (response.status < 200 || response.status >= 400) {
				if (!throwErrors) {
					return null;
				}
				let errorBody: string | null = null;
				try {
					errorBody = await response.text();
				} catch (err) {
					// this.logger.error('Failed to read error body from Campaign Monitor API response', err);
				}
				throw customError('Failed to make request to campaign monitor api', null, {
					path,
					method,
					data,
					status: response.status,
					statusText: response.statusText,
					errorBody,
				});
			}
			return (await response.json()) as T;
		} catch (err) {
			if (!throwErrors) {
				return null;
			}
			throw customError('Failed to make request to campaign monitor api', err, {
				path,
				method,
				data,
			});
		}
	}

	public async sendForVisit(emailInfo: VisitEmailInfo): Promise<void> {
		if (emailInfo.to.length === 0) {
			return;
		}

		const groupedRecipientsByLanguage = Object.entries(
			groupBy(emailInfo.to, (receiverInfo) => receiverInfo.language)
		);

		await promiseUtils.map(groupedRecipientsByLanguage, async ([language, recipients]) => {
			const recipientsForLanguage: string[] = [];
			for (const recipient of recipients) {
				if (recipient.email) {
					recipientsForLanguage.push(recipient.email);
				} else {
					// If there are no recipients, the mails will be sent to a fallback email address
					recipientsForLanguage.push(
						this.configService.get('MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK')
					);
				}
			}
			const data: CampaignMonitorData = {
				to: recipientsForLanguage,
				replyTo: emailInfo.replyTo,
				consentToTrack: ConsentToTrackOption.UNCHANGED,
				data: this.convertVisitToEmailTemplateData(emailInfo.visitRequest),
			};

			await this.sendTransactionalMail(
				{
					template: emailInfo.template,
					data,
				},
				language as Locale
			);
		});
	}

	public async sendForMaterialRequest(emailInfo: MaterialRequestEmailInfo): Promise<void> {
		const recipients: string[] = [];
		if (emailInfo.to) {
			recipients.push(emailInfo.to);
		} else {
			// If there are no recipients, the mails will be sent to a fallback email address
			recipients.push(this.configService.get('MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK'));
		}

		const data: CampaignMonitorData = {
			to: recipients,
			replyTo: emailInfo.replyTo,
			consentToTrack: ConsentToTrackOption.UNCHANGED,
			data: this.convertMaterialRequestsToEmailTemplateData(emailInfo),
		};

		await this.sendTransactionalMail(
			{
				template: emailInfo.template,
				data,
			},
			emailInfo.language
		);
	}

	/**
	 * Send confirmation email for user wanting to subscribe to the newsletter
	 * @param preferences
	 * @param language
	 */
	public async sendConfirmationMail(
		preferences: CampaignMonitorNewsletterUpdatePreferencesQueryDto,
		language: Locale
	): Promise<void> {
		const recipients: string[] = [];
		if (preferences?.mail) {
			recipients.push(preferences?.mail);
		} else {
			throw new BadRequestException(
				`Mail will not be sent to ${preferences?.firstName} ${preferences?.lastName}- empty email address`
			);
		}

		if (!preferences.firstName || !preferences.lastName) {
			throw new BadRequestException('Both "firstName" and "lastName" must be filled in');
		}

		const data: CampaignMonitorData = {
			to: recipients,
			replyTo: null,
			consentToTrack: ConsentToTrackOption.UNCHANGED,
			data: this.convertToConfirmationEmailTemplateData(preferences),
		};

		await this.sendTransactionalMail(
			{
				template: EmailTemplate.NEWSLETTER_CONFIRMATION,
				data,
			},
			language
		);
	}

	public async confirmEmail({
		token,
		mail,
		firstName,
		lastName,
	}: CampaignMonitorConfirmMailQueryDto): Promise<void> {
		if (mail !== decryptData(token)) {
			throw new BadRequestException('token is invalid');
		}
		await this.updateNewsletterPreferences(
			{
				firstName,
				lastName,
				email: mail,
			},
			{ newsletter: true }
		);
	}

	public async fetchNewsletterPreferences(
		email: string
	): Promise<CampaignMonitorNewsletterPreferences | null> {
		let url: string | null = null;

		try {
			url = stringifyUrl({
				url: `/${this.subscriberEndpoint}/${this.newsletterListId}.json`,
				query: { email },
			});

			const response: CmSubscriberResponse = await this.makeCmApiRequest(url);

			return {
				newsletter: response.State === 'Active',
			};
		} catch (err) {
			if (err?.code === 203 || JSON.stringify(err).includes('Subscriber not in list')) {
				return null;
			}

			this.logger.error(
				new InternalServerErrorException(
					{
						err,
					},
					'Failed to retrieve newsletter preference'
				)
			);
		}
	}

	/**
	 * Subscribes the user to the newsletter list or unsubscribes them based on the preferences provided.
	 * If no preferences are provided, it updates the user info in Campaign Monitor without changing their subscription status.
	 * If they don't exist yet and preferences are not provided, it will create a user in Campaign Monitor, but not subscribe them to the newsletter.
	 * @param userInfo
	 * @param preferences
	 */
	public async updateNewsletterPreferences(
		userInfo: CampaignMonitorUserInfo,
		preferences: CampaignMonitorNewsletterPreferences | null
	) {
		try {
			if (!userInfo.email) {
				return null;
			}

			if (preferences) {
				const subscribed = preferences.newsletter;
				if (subscribed) {
					// Subscribe user to list
					await this.subscribeToNewsletterList(this.newsletterListId, userInfo);
				} else {
					// Unsubscribe user from list
					await this.unsubscribeFromNewsletterList(this.newsletterListId, userInfo.email);
				}
			} else {
				const existingUserPreferences = await this.fetchNewsletterPreferences(userInfo.email);
				if (existingUserPreferences) {
					// Update user info in campaign monitor
					const subscriberData = this.convertPreferencesToNewsletterTemplateData(userInfo, false);

					const data = {
						Subscribers: [subscriberData],
						Resubscribe: false,
					};
					const path = `/${this.subscriberEndpoint}/${this.newsletterListId}/import.json`;
					await this.makeCmApiRequest(path, 'POST', data, true); // Ignore errors if user cannot be found
				}
			}
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to update newsletter preferences',
				error: err,
				preferences,
			});
		}
	}

	public async subscribeToNewsletterList(listId: string, cmUserInfo: CampaignMonitorUserInfo) {
		try {
			if (!cmUserInfo.email) {
				return;
			}

			const subscriberData = this.convertPreferencesToNewsletterTemplateData(cmUserInfo, true);

			const data = {
				Subscribers: [subscriberData],
				Resubscribe: true,
			};
			const path = `/${this.subscriberEndpoint}/${listId}/import.json`;
			await this.makeCmApiRequest(path, 'POST', data);
		} catch (err) {
			throw customError('Failed to subscribe to newsletter list', err, {
				listId,
				cmUserInfo,
			});
		}
	}

	public async unsubscribeFromNewsletterList(listId: string, email: string): Promise<void> {
		try {
			if (!email) {
				return;
			}

			const path = `/${this.subscriberEndpoint}/${listId}/unsubscribe.json`;
			await this.makeCmApiRequest(path, 'POST', { EmailAddress: email }, false);
		} catch (err) {
			throw customError('Failed to unsubscribe from newsletter list', err, { email });
		}
	}

	public async sendTransactionalMail(
		emailInfo: CampaignMonitorSendMailDto,
		lang: Locale
	): Promise<void> {
		try {
			if (emailInfo.data.to.length === 0) {
				const error = new BadRequestException(
					`Mail will not be sent - no recipients. emailInfo: ${JSON.stringify(emailInfo)}`
				);
				this.logger.error(error);
				throw error;
			}

			let cmTemplateId: string;
			if (Object.values(EmailTemplate).includes(emailInfo.template as any)) {
				cmTemplateId = getTemplateId(emailInfo.template, lang);
			} else {
				cmTemplateId = emailInfo.template;
			}

			if (!cmTemplateId) {
				const error = new InternalServerErrorException(
					{
						templateName: emailInfo.template,
						envVarPrefix: 'CAMPAIGN_MONITOR_EMAIL_TEMPLATE_',
					},
					'Cannot send email since the requested email template id has not been set as an environment variable'
				);
				this.logger.error(error);
				throw error;
			}

			const url = `/${this.configService.get(
				'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT'
			)}/${cmTemplateId}/send`;

			const data: Partial<CmSendEmailInfo> = {
				ConsentToTrack: emailInfo.data.consentToTrack,
				Data: {
					...emailInfo.data.data,
					...(emailInfo.data.replyTo ? { reply_to_email: emailInfo.data.replyTo } : {}),
				},
			};

			// If env variable REROUTE_EMAILS_TO is set to a value
			// Then set data.To prop to that value
			// -----------------------------------------------------------------
			// Remark: used for debugging en testing purposes
			// This should be at all times filled in or otherwise client receives unexpected results
			if (!isEmpty(this.rerouteEmailsTo)) {
				emailInfo.data.to = this.rerouteEmailsTo;
			}

			if (isArray(emailInfo.data.to)) {
				const emailInfoDataTo = emailInfo.data.to;

				data.To = [head(emailInfoDataTo)];

				emailInfoDataTo.shift();
				data.BCC = emailInfoDataTo;
			} else {
				data.To = [emailInfo.data.to];
			}

			if (this.isEnabled) {
				await this.makeCmApiRequest(url, 'POST', data);
			} else {
				this.logger.log(
					`Mock email sent. To: '${
						data.To
					}'. Template: ${emailInfo?.template}, data: ${JSON.stringify(data)}`
				);
			}
		} catch (err) {
			throw new BadRequestException(err, 'Failed to send email using the campaign monitor api');
		}
	}

	// Helpers
	// ------------------------------------------------------------------------
	public setIsEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	public setRerouteEmailsTo(rerouteEmailsTo: string): void {
		this.rerouteEmailsTo = rerouteEmailsTo;
	}

	public buildUrlToAdminVisit(): string {
		const url = new URL(this.clientHost);
		url.pathname = 'beheer/aanvragen';
		return url.href;
	}

	public getAdminEmail(email: string): string {
		return this.rerouteEmailsTo ? this.rerouteEmailsTo : email;
	}

	public convertVisitToEmailTemplateData(visit: VisitRequest): CampaignMonitorVisitData {
		return {
			client_firstname: visit.visitorFirstName,
			client_lastname: visit.visitorLastName,
			client_email: visit.visitorMail,
			contentpartner_name: visit.spaceName,
			contentpartner_email: visit.spaceMail,
			request_reason: visit.reason,
			request_time: visit.timeframe,
			request_url: this.buildUrlToAdminVisit(), // TODO deeplink to visit & extract to shared url builder?
			request_remark: visit.note?.note || '',
			start_date: visit.startAt ? formatAsBelgianDate(visit.startAt, 'd MMMM yyyy') : '',
			start_time: visit.startAt ? formatAsBelgianDate(visit.startAt, 'HH:mm') : '',
			end_date: visit.endAt ? formatAsBelgianDate(visit.endAt, 'd MMMM yyyy') : '',
			end_time: visit.endAt ? formatAsBelgianDate(visit.endAt, 'HH:mm') : '',
		};
	}

	public convertMaterialRequestsToEmailTemplateData(
		emailInfo: MaterialRequestEmailInfo
	): CampaignMonitorMaterialRequestData {
		const MATERIAL_REQUEST_TYPE_TRANSLATIONS: Record<MaterialRequestType, string> = {
			[MaterialRequestType.VIEW]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___ik-wil-dit-object-bekijken-beluisteren',
				null,
				emailInfo.language
			),
			[MaterialRequestType.REUSE]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___ik-wil-dit-object-hergebruiken',
				null,
				emailInfo.language
			),
			[MaterialRequestType.MORE_INFO]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___ik-wil-meer-info-over-dit-object',
				null,
				emailInfo.language
			),
		};

		const MATERIAL_REQUEST_REQUESTER_CAPACITY_TRANSLATIONS: Record<
			MaterialRequestRequesterCapacity,
			string
		> = {
			[MaterialRequestRequesterCapacity.OTHER]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___andere',
				null,
				emailInfo.language
			),
			[MaterialRequestRequesterCapacity.WORK]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___ik-vraag-de-fragmenten-op-in-het-kader-van-mijn-beroep-uitgezonderd-onderwijs',
				null,
				emailInfo.language
			),
			[MaterialRequestRequesterCapacity.PRIVATE_RESEARCH]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___ik-vraag-de-fragmenten-aan-in-het-kader-van-prive-onderzoek',
				null,
				emailInfo.language
			),
			[MaterialRequestRequesterCapacity.EDUCATION]: this.translationsService.tText(
				'modules/campaign-monitor/services/campaign-monitor___ik-ben-verbonden-aan-een-onderwijsinstelling-als-student-onderzoeker-of-lesgever',
				null,
				emailInfo.language
			),
		};

		// Maintainer Template
		if (emailInfo.template === EmailTemplate.MATERIAL_REQUEST_MAINTAINER) {
			return {
				user_firstname: emailInfo.firstName,
				user_lastname: emailInfo.lastName,
				cp_name: emailInfo.materialRequests[0]?.maintainerName,
				request_list: emailInfo.materialRequests.map((materialRequest) => {
					return {
						title: materialRequest.objectSchemaName,
						local_cp_id: materialRequest.objectMeemooLocalId,
						pid: materialRequest.objectSchemaIdentifier,
						page_url: `${this.configService.get('CLIENT_HOST')}/zoeken/${
							materialRequest.maintainerSlug
						}/${materialRequest.objectSchemaIdentifier}`,
						request_type: MATERIAL_REQUEST_TYPE_TRANSLATIONS[materialRequest.type],
						request_description: materialRequest.reason,
					};
				}),
				user_request_context:
					MATERIAL_REQUEST_REQUESTER_CAPACITY_TRANSLATIONS[emailInfo.sendRequestListDto.type],
				user_organisation: emailInfo.sendRequestListDto.organisation,
				user_email: emailInfo.materialRequests[0]?.requesterMail,
			};
		}

		// Requester Template
		return {
			user_firstname: emailInfo.firstName,
			user_lastname: emailInfo.lastName,
			request_list: emailInfo.materialRequests.map((materialRequest) => ({
				title: materialRequest.objectSchemaName,
				cp_name: materialRequest.maintainerName,
				local_cp_id: materialRequest.objectMeemooLocalId,
				pid: materialRequest.objectSchemaIdentifier,
				page_url: `${this.configService.get('CLIENT_HOST')}/zoeken/${
					materialRequest.maintainerSlug
				}/${materialRequest.objectSchemaIdentifier}`,
				request_type: MATERIAL_REQUEST_TYPE_TRANSLATIONS[materialRequest.type],
				request_description: materialRequest.reason,
			})),
			user_request_context:
				MATERIAL_REQUEST_REQUESTER_CAPACITY_TRANSLATIONS[emailInfo.sendRequestListDto.type],
			user_organisation: emailInfo.sendRequestListDto.organisation,
			user_email: emailInfo.materialRequests[0]?.requesterMail,
		};
	}

	public convertPreferencesToNewsletterTemplateData(
		userInfo: CampaignMonitorUserInfo,
		resubscribe: boolean
	): CampaignMonitorUpdatePreferencesData {
		const customFieldsObj: Record<string, string | boolean> = {
			[CampaignMonitorCustomFieldName.usergroup]: userInfo.usergroup,
			[CampaignMonitorCustomFieldName.is_key_user]: userInfo.is_key_user,
			[CampaignMonitorCustomFieldName.firstname]: userInfo.firstName,
			[CampaignMonitorCustomFieldName.lastname]: userInfo.lastName,
			[CampaignMonitorCustomFieldName.created_date]: userInfo.created_date,
			[CampaignMonitorCustomFieldName.last_access_date]: userInfo.last_access_date,
			[CampaignMonitorCustomFieldName.organisation]: userInfo.organisation,
			[CampaignMonitorCustomFieldName.language]: userInfo.language,
		};

		const customFieldsArr = toPairs(customFieldsObj)
			// Only set values that have a value, otherwise we reset existing information of the user
			.filter((pair) => !isNil(pair[1]) && pair[1] !== '')
			.map((pair) => {
				return {
					Key: pair[0],
					Value: pair[1],
				};
			});
		return {
			EmailAddress: userInfo.email,
			Name: `${userInfo.firstName} ${userInfo.lastName}`,
			Resubscribe: resubscribe,
			ConsentToTrack: resubscribe ? ConsentToTrackOption.YES : ConsentToTrackOption.UNCHANGED,
			CustomFields: customFieldsArr,
		};
	}

	public convertToConfirmationEmailTemplateData(
		preferences: CampaignMonitorNewsletterUpdatePreferencesQueryDto
	): CampaignMonitorConfirmationData {
		return {
			firstname: preferences.firstName,
			activation_url: `${this.configService.get(
				'HOST'
			)}/campaign-monitor/confirm-email?token=${encryptData(
				preferences?.mail
			)}&${queryString.stringify({ mail: preferences?.mail })}&${queryString.stringify({
				firstName: preferences?.firstName,
			})}&${queryString.stringify({
				lastName: preferences?.lastName,
			})}`,
		};
	}
}
