import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get } from 'lodash';

import { getConfig } from '~config';

import { CampaignMonitorData, CampaignMonitorVisitData } from '../dto/campaign-monitor.dto';
import { Template, VisitEmailInfo } from '../types';

import { Visit } from '~modules/visits/types';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

@Injectable()
export class CampaignMonitorService {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;
	private templateToCampaignMonitorIdMap: Record<Template, any>;
	private isEnabled: boolean;
	private clientHost: string;

	constructor(private configService: ConfigService) {
		this.gotInstance = got.extend({
			prefixUrl: getConfig(this.configService, 'campaignMonitorApiEndpoint'),
			resolveBodyOnly: true,
			username: getConfig(this.configService, 'campaignMonitorApiKey'),
			password: '.',
			responseType: 'json',
		});

		this.isEnabled = getConfig(this.configService, 'enableSendEmail');
		this.clientHost = getConfig(this.configService, 'clientHost');

		this.templateToCampaignMonitorIdMap = {
			VISIT_REQUEST_CP: getConfig(
				this.configService,
				'campaignMonitorTemplateVisitRequestCp'
			),
			VISIT_APPROVED: getConfig(this.configService, 'campaignMonitorTemplateVisitApproved'),
			VISIT_DENIED: getConfig(this.configService, 'campaignMonitorTemplateVisitDenied'),
		};
	}

	public setIsEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	public buildUrlToAdminVisit(): string {
		const url = new URL(this.clientHost);
		url.pathname = 'beheer/aanvragen';
		return url.href;
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
			this.logger.error('Mail will not be sent - no recipients');
			return false;
		}

		const cmTemplateId = this.templateToCampaignMonitorIdMap[emailInfo.template];
		if (!cmTemplateId) {
			this.logger.error(
				`Campaign monitor template ID for ${emailInfo.template} not found -- email could not be sent`
			);
			return false;
		}

		const data: CampaignMonitorData = {
			To: recipients,
			ConsentToTrack: 'unchanged',
			Data: this.convertVisitToEmailTemplateData(emailInfo.visit),
		};
		return this.send(cmTemplateId, data);
	}

	public async send(template: string, data: CampaignMonitorData): Promise<boolean> {
		if (this.isEnabled) {
			await this.gotInstance.post(`${template}/send`, {
				json: data,
			});
		} else {
			this.logger.log(
				`Mock email sent. To: '${data.To}'. Template: ${template}, data: ${JSON.stringify(
					data
				)}`
			);
			return false;
		}
		return true;
	}
}
