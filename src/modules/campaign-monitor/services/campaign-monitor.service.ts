import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { compact, get, head, isArray, isNil, isString, toPairs, uniq } from 'lodash';
import * as queryString from 'query-string';

import { Configuration } from '~config';

import { getTemplateId } from '../campaign-monitor.consts';
import {
	CampaignMonitorNewsletterPreferences,
	MaterialRequestEmailInfo,
	Template,
	VisitEmailInfo,
} from '../campaign-monitor.types';
import {
	CampaignMonitorData,
	CampaignMonitorMaterialRequestData,
	CampaignMonitorSendMailDto,
	CampaignMonitorVisitData,
} from '../dto/campaign-monitor.dto';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Visit } from '~modules/visits/types';
import { checkRequiredEnvs } from '~shared/helpers/env-check';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

@Injectable()
export class CampaignMonitorService {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;
	private isEnabled: boolean;
	private clientHost: string;
	private rerouteEmailsTo: string;

	constructor(private configService: ConfigService<Configuration>) {
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

	// TODO: check sendForVisit still works (ARC-1501)
	public async sendForVisit(emailInfo: VisitEmailInfo): Promise<boolean> {
		const recipients: string[] = [];
		emailInfo.to.forEach((recipient) => {
			if (!recipient.email) {
				// Throw exception will break too much
				this.logger.error(
					`Mail will not be sent to user id ${recipient.id} - empty email address`
				);
			} else {
				recipients.push(recipient.email);
			}
		});

		const data: CampaignMonitorData = {
			to: recipients,
			consentToTrack: 'unchanged',
			data: this.convertVisitToEmailTemplateData(emailInfo.visit),
		};

		const response = await this.sendTransactionalMail({
			template: emailInfo.template,
			data,
		});
		return !!response;
	}

	public async sendForMaterialRequest(emailInfo: MaterialRequestEmailInfo): Promise<boolean> {
		const recipients: string[] = [];

		if (emailInfo.to) {
			recipients.push(emailInfo.to);
		} else {
			if (emailInfo.template === Template.MATERIAL_REQUEST_MAINTAINER) {
				this.logger.error(
					`Mail will not be sent to maintainer id ${emailInfo.materialRequests[0]?.maintainerId} - empty email address`
				);
			} else {
				this.logger.error(
					`Mail will not be sent to profile id ${emailInfo.materialRequests[0]?.profileId} - empty email address`
				);
			}
		}

		const data: CampaignMonitorData = {
			to: recipients,
			consentToTrack: 'unchanged',
			data: this.convertMaterialRequestsToEmailTemplateData(emailInfo),
		};

		const response = await this.sendTransactionalMail({
			template: emailInfo.template,
			data,
		});
		return !!response;
	}

	public async fetchNewsletterPreferences(
		email: string
	): Promise<CampaignMonitorNewsletterPreferences> {
		let url: string | null = null;

		try {
			url = `${process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION as string}/${
				process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT
			}/${
				process.env.CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF as string
			}.json/?${queryString.stringify({ email })}`;

			const response: any = await this.gotInstance({
				url,
				method: 'get',
				throwHttpErrors: true,
			});

			return {
				newsletter: response?.State === 'Active', //OR: response?.data?.State === 'Active',
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
		preferences: CampaignMonitorNewsletterPreferences,
		user: SessionUserEntity
	) {
		let url: string | null = null;

		try {
			if (!user.getMail()) {
				return null;
			}

			url = `${process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION as string}/${
				process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT
			}/${process.env.CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF as string}.json`;

			const mappedPreferences = [];

			if (preferences.newsletter) {
				mappedPreferences.push(
					process.env.CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF_NEWSLETTER
				);
			}

			const optin_mail_lists = uniq(compact(mappedPreferences || [])).join('|');

			const data = this.convertPreferencesToNewsletterTemplateData(
				user,
				optin_mail_lists,
				true
			);

			await this.gotInstance({
				url,
				method: 'post',
				json: data,
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

	public async sendTransactionalMail(emailInfo: CampaignMonitorSendMailDto): Promise<boolean> {
		try {
			if (emailInfo.data.to.length === 0) {
				this.logger.error(
					`Mail will not be sent - no recipients. emailInfo: ${JSON.stringify(emailInfo)}`
				);
				return false;
			}

			let cmTemplateId: string;
			if (Object.values(Template).includes(emailInfo.template as any)) {
				cmTemplateId = getTemplateId(emailInfo.template);
			} else {
				cmTemplateId = emailInfo.template;
			}

			if (!cmTemplateId) {
				this.logger.error(
					new InternalServerErrorException(
						{
							templateName: emailInfo.template,
							envVarPrefix: 'CAMPAIGN_MONITOR_EMAIL_TEMPLATE_',
						},
						'Cannot send email since the requested email template id has not been set as an environment variable'
					)
				);
				return false;
			}

			const url = `${
				process.env.CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION as string
			}/${
				process.env.CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT as string
			}/${cmTemplateId}/send`;

			const data: any = emailInfo.data;

			if (isArray(emailInfo.data.to)) {
				const emailInfoDataTo = emailInfo.data.to;

				data.To = [head(emailInfoDataTo)];

				emailInfoDataTo.shift();
				data.BCC = emailInfoDataTo;
			} else {
				data.To = [emailInfo.data.to];
			}

			// TODO: replace with node fetch
			if (this.isEnabled) {
				await this.gotInstance({
					url,
					method: 'post',
					throwHttpErrors: true,
					json: data,
				}).json<void>();
				return true;
			} else {
				this.logger.log(
					`Mock email sent. To: '${data.to}'. Template: ${
						emailInfo?.template
					}, data: ${JSON.stringify(data)}`
				);
				return false;
			}
		} catch (err) {
			console.error(err);
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

	public convertVisitToEmailTemplateData(visit: Visit): CampaignMonitorVisitData {
		return {
			client_firstname: visit.visitorFirstName,
			client_lastname: visit.visitorLastName,
			client_email: visit.visitorMail,
			contentpartner_name: visit.spaceName,
			contentpartner_email: visit.spaceMail,
			request_reason: visit.reason,
			request_time: visit.timeframe,
			request_url: this.buildUrlToAdminVisit(), // TODO deeplink to visit & extract to shared url builder?
			request_remark: get(visit.note, 'note', ''),
			start_date: visit.startAt ? formatAsBelgianDate(visit.startAt, 'd MMMM yyyy') : '',
			start_time: visit.startAt ? formatAsBelgianDate(visit.startAt, 'HH:mm') : '',
			end_date: visit.endAt ? formatAsBelgianDate(visit.endAt, 'd MMMM yyyy') : '',
			end_time: visit.endAt ? formatAsBelgianDate(visit.endAt, 'HH:mm') : '',
		};
	}

	public convertMaterialRequestsToEmailTemplateData(
		emailInfo: MaterialRequestEmailInfo
	): CampaignMonitorMaterialRequestData {
		// Maintainer Template
		if (emailInfo.template === Template.MATERIAL_REQUEST_MAINTAINER) {
			//TODO: change this return object to match to maintainertemplate
			return {
				user_firstname: emailInfo.firstName,
				user_lastname: emailInfo.lastName,
				cp_name: emailInfo.materialRequests[0]?.maintainerName,
				request_list: emailInfo.materialRequests.map((mr) => ({
					title: mr.objectSchemaName,
					local_cp_id: mr.objectMeemooLocalId,
					pid: mr.objectMeemooIdentifier,
					page_url: `${process.env.CLIENT_HOST}/zoeken/${mr.maintainerSlug}/${mr.objectSchemaIdentifier}`,
					request_type: mr.type,
					request_description: mr.reason,
				})),
				user_request_context: emailInfo.sendRequestListDto.type,
				user_organisation: emailInfo.sendRequestListDto.organisation,
				user_email: emailInfo.materialRequests[0]?.requesterMail,
			};
		}

		// Requester Template
		return {
			user_firstname: emailInfo.firstName,
			user_lastname: emailInfo.lastName,
			request_list: emailInfo.materialRequests.map((mr) => ({
				title: mr.objectSchemaName,
				cp_name: mr.maintainerName,
				local_cp_id: mr.objectMeemooLocalId,
				pid: mr.objectMeemooIdentifier,
				page_url: `${process.env.CLIENT_HOST}/zoeken/${mr.maintainerSlug}/${mr.objectSchemaIdentifier}`,
				request_type: mr.type,
				request_description: mr.reason,
			})),
			user_request_context: emailInfo.sendRequestListDto.type,
			user_organisation: emailInfo.sendRequestListDto.organisation,
			user_email: emailInfo.materialRequests[0]?.requesterMail,
		};
	}

	public convertPreferencesToNewsletterTemplateData(
		user: SessionUserEntity,
		optin_mail_lists: string,
		resubscribe: boolean
	) {
		const customFields = {
			optin_mail_lists: optin_mail_lists,
			usergroup: user.getGroupName(),
			is_key_user: user.getIsKeyUser(),
			firstname: user.getFirstName(),
			lastname: user.getLastName(),
			created_date: new Date(),
			last_access_date: user.getLastAccessAt(),
			organisation: user.getOrganisationName(),
		};

		return {
			EmailAddress: user.getMail(),
			Name: user.getFullName(),
			Resubscribe: resubscribe,
			ConsentToTrack: resubscribe ? 'Yes' : 'Unchanged',
			CustomFields: toPairs(customFields).map((pair) => ({
				Key: pair[0],
				Value: pair[1],
				Clear: isNil(pair[1]) || (isString(pair[1]) && pair[1] === ''),
			})),
		};
	}
}
