import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get, isArray } from 'lodash';

import { Configuration } from '~config';

import { templateIds } from '../campaign-monitor.consts';
import { MaterialRequestEmailInfo, VisitEmailInfo } from '../campaign-monitor.types';
import {
	CampaignMonitorData,
	CampaignMonitorSendMailDto,
	CampaignMonitorVisitData,
} from '../dto/campaign-monitor.dto';

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
				templateId: cmTemplateId,
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
		console.log(emailInfo);
		// const templateId = 'b573a74d-45cf-432a-bd0b-eb74a4cdec1e';
		return false;
	}

	public async sendMail(
		emailInfo: CampaignMonitorSendMailDto
	): Promise<void | BadRequestException> {
		let url: string | null = null;

		try {
			if (!templateIds[emailInfo.templateId]) {
				this.logger.error(
					new InternalServerErrorException(
						{
							templateName: emailInfo.templateId,
							envVarPrefix: 'CAMPAIGN_MONITOR_EMAIL_TEMPLATE_',
						},
						'Cannot send email since the requested email template id has not been set as an environment variable'
					)
				);
				return;
			}

			url = `${process.env.CAMPAIGN_MONITOR_API_ENDPOINT as string}/${
				templateIds[emailInfo.templateId]
			}/send`;

			const data: any = {
				Data: emailInfo.data,
				ConsentToTrack: 'unchanged',
			};

			if (isArray(emailInfo.data.to)) {
				data.BCC = emailInfo.data.to;
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
}
