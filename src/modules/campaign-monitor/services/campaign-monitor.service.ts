import { TranslationsService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as promiseUtils from 'blend-promise-utils';
import got, { Got } from 'got';
import { compact, groupBy, head, isArray, isEmpty, isNil, toPairs, uniq } from 'lodash';
import * as queryString from 'query-string';

import { Configuration } from '~config';

import { getTemplateId } from '../campaign-monitor.consts';
import {
	CampaignMonitorCustomFieldName,
	CampaignMonitorNewsletterPreferences,
	CampaignMonitorUserInfo,
	MaterialRequestEmailInfo,
	Template,
	VisitEmailInfo,
} from '../campaign-monitor.types';
import {
	CampaignMonitorConfirmationData,
	CampaignMonitorConfirmMailQueryDto,
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
import { VisitRequest } from '~modules/visits/types';
import { checkRequiredEnvs } from '~shared/helpers/env-check';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';
import { Locale } from '~shared/types/types';

@Injectable()
export class CampaignMonitorService implements OnApplicationBootstrap {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;
	private isEnabled: boolean;
	private clientHost: string;
	private rerouteEmailsTo: string;

	constructor(
		private configService: ConfigService<Configuration>,
		protected translationsService: TranslationsService
	) {
		checkRequiredEnvs([
			'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT',
			'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION',
			'CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION',
			'CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT',
		]);
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('CAMPAIGN_MONITOR_API_ENDPOINT'),
			resolveBodyOnly: true,
			username: this.configService.get('CAMPAIGN_MONITOR_API_KEY'),
			password: '.',
			responseType: 'json',
		});

		this.isEnabled = this.configService.get('ENABLE_SEND_EMAIL');
		this.rerouteEmailsTo = this.configService.get('REROUTE_EMAILS_TO');

		this.clientHost = this.configService.get('CLIENT_HOST');
	}

	public async onApplicationBootstrap() {
		await this.translationsService.refreshBackendTranslations();
	}

	public async sendForVisit(emailInfo: VisitEmailInfo): Promise<void> {
		const groupedRecipientsByLanguage = toPairs(
			groupBy(emailInfo.to, (receiverInfo) => receiverInfo.language)
		);
		await promiseUtils.map(groupedRecipientsByLanguage, async ([language, recipients]) => {
			recipients.forEach((recipient) => {
				if (recipient.email) {
					recipients.push(recipient.email as any);
				} else {
					// If there are no recipients, the mails will be sent to a fallback email address
					recipients.push(
						this.configService.get('MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK')
					);
				}
			});
			const data: CampaignMonitorData = {
				to: recipients,
				consentToTrack: 'unchanged',
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

	public async sendForMaterialRequest(
		emailInfo: MaterialRequestEmailInfo,
		language: 'en' | 'nl'
	): Promise<void> {
		const recipients: string[] = [];
		if (emailInfo.to) {
			recipients.push(emailInfo.to);
		} else {
			// If there are no recipients, the mails will be sent to a fallback email address
			recipients.push(this.configService.get('MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK'));
		}

		const data: CampaignMonitorData = {
			to: recipients,
			consentToTrack: 'unchanged',
			data: this.convertMaterialRequestsToEmailTemplateData(emailInfo),
		};

		await this.sendTransactionalMail(
			{
				template: emailInfo.template,
				data,
			},
			language
		);
	}

	public async sendConfirmationMail(
		preferences: CampaignMonitorNewsletterUpdatePreferencesQueryDto,
		language: 'nl' | 'en'
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
			consentToTrack: 'unchanged',
			data: this.convertToConfirmationEmailTemplateData(preferences),
		};

		await this.sendTransactionalMail(
			{
				template: Template.EMAIL_CONFIRMATION,
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
	): Promise<CampaignMonitorNewsletterPreferences> {
		let url: string | null = null;

		try {
			url = `${this.configService.get(
				'CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION'
			)}/${this.configService.get(
				'CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT'
			)}/${this.configService.get(
				'CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF'
			)}.json/?${queryString.stringify({ email })}`;

			const response: any = await this.gotInstance({
				url,
				method: 'get',
				throwHttpErrors: true,
			});

			return {
				newsletter:
					response?.CustomFields.find(
						(field) => field.Key === CampaignMonitorCustomFieldName.optin_mail_lists
					)?.Value?.includes(
						this.configService.get('CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF_NEWSLETTER')
					) ?? false,
			};
		} catch (err) {
			if (err?.code === 203) {
				return {
					newsletter: false,
				};
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

	public async updateNewsletterPreferences(
		userInfo: CampaignMonitorUserInfo,
		preferences?: CampaignMonitorNewsletterPreferences
	) {
		try {
			if (!userInfo.email) {
				return null;
			}

			const url: string | null = `${this.configService.get(
				'CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION'
			)}/${this.configService.get(
				'CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT'
			)}/${this.configService.get('CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF')}/import.json`;

			let optin_mail_lists;
			if (preferences) {
				const mappedPreferences = [];

				if (preferences.newsletter) {
					mappedPreferences.push(
						this.configService.get('CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF_NEWSLETTER')
					);
				}

				optin_mail_lists = uniq(compact(mappedPreferences || [])).join('|');
			}

			const subscriberInfo = this.convertPreferencesToNewsletterTemplateData(
				userInfo,
				true,
				optin_mail_lists
			);

			await this.gotInstance({
				url,
				method: 'post',
				json: {
					Subscribers: [subscriberInfo],
					Resubscribe: true,
				},
				throwHttpErrors: true,
			});
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to update newsletter preferences',
				error: err,
				preferences,
			});
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
			if (Object.values(Template).includes(emailInfo.template as any)) {
				cmTemplateId = getTemplateId(emailInfo.template, lang);
				console.log(cmTemplateId);
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

			const url = `${this.configService.get(
				'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION'
			)}/${this.configService.get(
				'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT'
			)}/${cmTemplateId}/send`;

			const data: any = emailInfo.data;

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
				await this.gotInstance({
					url,
					method: 'post',
					throwHttpErrors: true,
					json: data,
				}).json<void>();
			} else {
				this.logger.log(
					`Mock email sent. To: '${
						data.to
					}'. Template: ${emailInfo?.template}, data: ${JSON.stringify(data)}`
				);
			}
		} catch (err) {
			throw new BadRequestException(
				err,
				'Failed to send email using the campaign monitor api'
			);
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
		if (emailInfo.template === Template.MATERIAL_REQUEST_MAINTAINER) {
			return {
				user_firstname: emailInfo.firstName,
				user_lastname: emailInfo.lastName,
				cp_name: emailInfo.materialRequests[0]?.maintainerName,
				request_list: emailInfo.materialRequests.map((materialRequest) => {
					return {
						title: materialRequest.objectSchemaName,
						local_cp_id: materialRequest.objectMeemooLocalId,
						pid: materialRequest.objectMeemooIdentifier,
						page_url: `${this.configService.get('CLIENT_HOST')}/zoeken/${
							materialRequest.maintainerSlug
						}/${materialRequest.objectSchemaIdentifier}`,
						request_type: MATERIAL_REQUEST_TYPE_TRANSLATIONS[materialRequest.type],
						request_description: materialRequest.reason,
					};
				}),
				user_request_context:
					MATERIAL_REQUEST_REQUESTER_CAPACITY_TRANSLATIONS[
						emailInfo.sendRequestListDto.type
					],
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
				pid: materialRequest.objectMeemooIdentifier,
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
		resubscribe: boolean,
		optin_mail_lists?: string
	): CampaignMonitorUpdatePreferencesData {
		const customFields: Record<string, string | boolean> = {
			[CampaignMonitorCustomFieldName.usergroup]: userInfo.usergroup,
			[CampaignMonitorCustomFieldName.is_key_user]: userInfo.is_key_user,
			[CampaignMonitorCustomFieldName.firstname]: userInfo.firstName,
			[CampaignMonitorCustomFieldName.lastname]: userInfo.lastName,
			[CampaignMonitorCustomFieldName.created_date]: userInfo.created_date,
			[CampaignMonitorCustomFieldName.last_access_date]: userInfo.last_access_date,
			[CampaignMonitorCustomFieldName.organisation]: userInfo.organisation,
			[CampaignMonitorCustomFieldName.language]: userInfo.language,
		};
		if (!isNil(optin_mail_lists)) {
			customFields[CampaignMonitorCustomFieldName.optin_mail_lists] = optin_mail_lists;
		}

		return {
			EmailAddress: userInfo.email,
			Name: userInfo.firstName + ' ' + userInfo.lastName,
			Resubscribe: resubscribe,
			ConsentToTrack: resubscribe ? 'Yes' : 'Unchanged',
			CustomFields: toPairs(customFields).map((pair) => {
				return {
					Key: pair[0],
					Value: pair[1],
					Clear: pair[0] === 'optin_mail_lists' && !pair[1], // Clear the optin_mail_lists field if it is empty string
				};
			}),
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
