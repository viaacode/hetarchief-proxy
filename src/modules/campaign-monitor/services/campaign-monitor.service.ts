import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get } from 'lodash';

import { Template, VisitEmailInfo } from '../types';

import { Visit } from '~modules/visits/types';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

interface CampaignMonitorVisitData {
	client_firstname: string;
	client_lastname: string;
	client_email: string;
	contentpartner_name: string;
	contentpartner_email: string;
	request_reason: string;
	request_time: string;
	request_url: string;
	request_remark: string;
	start_date: string;
	start_time: string;
	end_date: string;
	end_time: string;
}
@Injectable()
export class CampaignMonitorService {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;
	private templateToCampaignMonitorIdMap: Record<Template, any>;
	private isEnabled: boolean;
	private clientHost: string;

	constructor(private configService: ConfigService) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('campaignMonitorApiEndpoint'),
			resolveBodyOnly: true,
			username: this.configService.get('campaignMonitorApiKey'),
			password: '.',
			responseType: 'json',
		});

		this.isEnabled = this.configService.get('enableSendEmail');
		this.clientHost = this.configService.get('clientHost');

		this.templateToCampaignMonitorIdMap = {
			VISIT_REQUEST_CP: this.configService.get('campaignMonitorTemplateVisitRequestCp'),
			VISIT_APPROVED: this.configService.get('campaignMonitorTemplateVisitApproved'),
			VISIT_DENIED: this.configService.get('campaignMonitorTemplateVisitDenied'),
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

	public async send(emailInfo: VisitEmailInfo): Promise<boolean> {
		if (!emailInfo.visit.spaceMail) {
			// TODO Throw exception or ignore & log error?
			throw new InternalServerErrorException(`Email adres cannot be empty`);
		}

		const data: any = {
			To: emailInfo.visit.spaceMail,
			ConsentToTrack: 'unchanged',
			Data: this.convertVisitToEmailTemplateData(emailInfo.visit),
		};

		if (this.isEnabled) {
			const cmTemplateId = this.templateToCampaignMonitorIdMap[emailInfo.template];
			if (!cmTemplateId) {
				this.logger.error(
					`Campaign monitor template ID for ${emailInfo.template} not found -- email could not be sent`
				);
				return false;
			}
			await this.gotInstance.post(
				`${this.templateToCampaignMonitorIdMap[emailInfo.template]}/send`,
				{
					json: data,
				}
			);
		} else {
			this.logger.log(
				`Mock email sent. To: '${emailInfo.visit.spaceMail}'. Template: ${
					emailInfo.template
				} - ${
					this.templateToCampaignMonitorIdMap[emailInfo.template]
				}, data: ${JSON.stringify(data.Data)}`
			);
			return false;
		}
		return true;
	}
}
