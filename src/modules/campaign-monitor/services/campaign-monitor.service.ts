import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { compact, get, head, isArray, uniq } from 'lodash';
import * as queryString from 'query-string';

import { Configuration } from '~config';

import { templateIds } from '../campaign-monitor.consts';
import {
	CampaignMonitorNewsletterPreferences,
	MaterialRequestEmailInfo,
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
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

@Injectable()
export class CampaignMonitorService {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;
	private isEnabled: boolean;
	private clientHost: string;
	private rerouteEmailsTo: string;

	constructor(private configService: ConfigService<Configuration>) {
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

	// TODO: fix sendForVisit (ARC-1501)
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

		if (this.isEnabled) {
			await this.sendTransactionalMail({
				template: emailInfo.template,
				data,
			});
		} else {
			this.logger.log(
				`Mock email sent. To: '${data.to}'. Template: ${
					emailInfo?.template
				}, data: ${JSON.stringify(data)}`
			);
			return false;
		}
		return true;
	}

	// TODO: Write tests (ARC-1500)
	public async sendForMaterialRequest(emailInfo: MaterialRequestEmailInfo): Promise<boolean> {
		const recipients: string[] = [];

		if (emailInfo.to) {
			recipients.push(emailInfo.to);
		} else {
			if (emailInfo.isToMaintainer) {
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
			data: this.convertMaterialRequestsToEmailTemplateData(
				emailInfo,
				emailInfo.firstName,
				emailInfo.lastName
			),
		};

		if (this.isEnabled) {
			await this.sendTransactionalMail({
				template: emailInfo.template,
				data,
			});
		} else {
			this.logger.log(
				`Mock email sent. To: '${data.to}'. Template: ${
					emailInfo?.template
				}, data: ${JSON.stringify(data)}`
			);
			return false;
		}
		return true;
	}

	public async fetchNewsletterPreferences(
		email: string
	): Promise<CampaignMonitorNewsletterPreferences> {
		let url: string | null = null;

		try {
			url = `/${process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION as string}/${
				process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT
			}/${process.env.CAMPAIGN_MONITOR_OPTIN_LIST_05 as string}.json/?${queryString.stringify(
				{ email }
			)}`;

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
			if (!user.getMail) {
				return null;
			}

			url = `/${process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_VERSION as string}/${
				process.env.CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT
			}/${process.env.CAMPAIGN_MONITOR_OPTIN_LIST_05 as string}.json/?${queryString.stringify(
				{ email: user.getMail() }
			)}`;

			const mappedPreferences = [];

			if (preferences.newsletter) {
				mappedPreferences.push(process.env.CAMPAIGN_MONITOR_OPTIN_LIST_05_NEWSLETTER);
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

	public async sendTransactionalMail(
		emailInfo: CampaignMonitorSendMailDto
	): Promise<void | BadRequestException> {
		try {
			if (emailInfo.data.to.length === 0) {
				this.logger.error(
					`Mail will not be sent - no recipients. emailInfo: ${JSON.stringify(emailInfo)}`
				);
				return;
			}
			const cmTemplateId = templateIds[emailInfo.template];
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
				return;
			}

			const url = `${
				process.env.CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION as string
			}/${process.env.CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT as string}/${
				templateIds[emailInfo.template]
			}/send`;

			const data: any = emailInfo.data;

			if (isArray(emailInfo.data.to) && emailInfo.data.to.length > 1) {
				const emailInfoDataTo = emailInfo.data.to;

				data.To = [head(emailInfoDataTo)];

				emailInfoDataTo.shift();
				data.BCC = emailInfoDataTo;
			} else {
				data.To = [emailInfo.data.to];
			}

			// TODO: replace with node fetch
			await this.gotInstance({
				url,
				method: 'post',
				throwHttpErrors: true,
				json: data,
			}).json<void>();
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
		emailInfo: MaterialRequestEmailInfo,
		firstName: string,
		lastname: string
	): CampaignMonitorMaterialRequestData {
		// Maintainer Template
		if (emailInfo.isToMaintainer) {
			//TODO: change this return object to match to maintainertemplate
			return {
				user_firstname: firstName,
				user_lastname: lastname,
				cp_name: emailInfo.materialRequests[0].maintainerName,
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
				user_email: emailInfo.materialRequests[0].requesterMail,
			};
		}

		// Requester Template
		return {
			user_firstname: firstName,
			user_lastname: lastname,
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
			user_email: emailInfo.materialRequests[0].requesterMail,
		};
	}

	public convertPreferencesToNewsletterTemplateData(
		user: SessionUserEntity,
		optin_mail_lists: string,
		resubscribe: boolean
	) {
		return {
			Name: user.getFullName(),
			EmailAddress: user.getMail(),
			optin_mail_lists,
			gebruikersgroep: user.getGroupId(),
			is_sleutel_gebruiker: user.getIsKeyUser(),
			firstname: user.getFirstName(),
			lastname: user.getLastName(),
			aangemaakt_op: new Date(),
			Resubscribe: resubscribe,
			ConsentToTrack: resubscribe ? 'Yes' : 'Unchanged',
			laatst_ingelogd_op: user.getLastAccessAt(),
			organisatie: user.getOrganisationName(),
		};
	}
}
