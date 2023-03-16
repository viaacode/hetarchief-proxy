import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get, groupBy, isArray } from 'lodash';

import { Configuration } from '~config';

import { templateIds } from '../campaign-monitor.consts';
import { MaterialRequestEmailInfo, VisitEmailInfo } from '../campaign-monitor.types';
import {
	CampaignMonitorData,
	CampaignMonitorMaterialRequestData,
	CampaignMonitorSendMailDto,
	CampaignMonitorVisitData,
} from '../dto/campaign-monitor.dto';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
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
			// prefixUrl: this.configService.get('CAMPAIGN_MONITOR_API_ENDPOINT'), //blokeerde verzenden van mails
			resolveBodyOnly: true,
			username: this.configService.get('CAMPAIGN_MONITOR_API_KEY'),
			password: '.',
			responseType: 'json',
		});

		this.isEnabled = this.configService.get('ENABLE_SEND_EMAIL');
		this.rerouteEmailsTo = this.configService.get('REROUTE_EMAILS_TO');

		this.clientHost = this.configService.get('CLIENT_HOST');
	}

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

		if (recipients.length === 0) {
			this.logger.error(
				`Mail will not be sent - no recipients. emailInfo: ${JSON.stringify(emailInfo)}`
			);
			return false;
		}

		const cmTemplateId = templateIds[emailInfo.template];
		if (!cmTemplateId) {
			this.logger.error(
				`Campaign monitor template ID for ${emailInfo.template} not found -- email could not be sent`
			);
			return false;
		}

		const data: CampaignMonitorData = {
			to: recipients,
			consentToTrack: 'unchanged',
			data: this.convertVisitToEmailTemplateData(emailInfo.visit),
		};

		if (this.isEnabled) {
			await this.sendMail({
				template: emailInfo.template,
				data,
			});
		} else {
			this.logger.log(
				`Mock email sent. To: '${
					data.to
				}'. Template: ${cmTemplateId}, data: ${JSON.stringify(data)}`
			);
			return false;
		}
		return true;
	}
	public async sendForMaterialRequest(emailInfo: MaterialRequestEmailInfo): Promise<boolean> {
		const recipients: string[] = [];
		if (emailInfo.to) {
			recipients.push(emailInfo.to);
		} else {
			// Throw exception will break too much
			this.logger.error(
				`Mail will not be sent to maintainer id ${emailInfo.materialRequests[0].maintainerId} - empty email address`
			);
		}

		if (recipients.length === 0) {
			this.logger.error(
				`Mail will not be sent - no recipients. emailInfo: ${JSON.stringify(emailInfo)}`
			);
			return false;
		}

		const cmTemplateId = templateIds[emailInfo.template];
		if (!cmTemplateId) {
			this.logger.error(
				`Campaign monitor template ID for ${emailInfo.template} not found -- email could not be sent`
			);
			return false;
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
			await this.sendMail({
				template: emailInfo.template,
				data,
			});
			console.log('REAL MAIL');
		} else {
			this.logger.log(
				`Mock email sent. To: '${
					data.to
				}'. Template: ${cmTemplateId}, data: ${JSON.stringify(data)}`
			);
			return false;
		}
		return true;
	}

	public async sendMail(
		emailInfo: CampaignMonitorSendMailDto
	): Promise<void | BadRequestException> {
		let url: string | null = null;

		try {
			if (!templateIds[emailInfo.template]) {
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

			url = `${process.env.CAMPAIGN_MONITOR_API_ENDPOINT as string}/${
				templateIds[emailInfo.template]
			}/send`;

			const data: any = emailInfo.data;

			if (isArray(emailInfo.data.to)) {
				// data.BCC = emailInfo.data.to; //Not sure what this is doing, it made the mails send 2 times
			} else {
				data.To = [emailInfo.data.to];
			}

			this.logger.log(`mail data: ${JSON.stringify(data)}`);

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
		if (emailInfo.isToMaintainer) {
			//TODO: change this return object to match to maintainertemplate
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
			};
		}
		//Convert to requesterTemplate
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
		};
	}
}
