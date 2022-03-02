import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';

import { EmailInfo, Template } from '../types';

@Injectable()
export class CampaignMonitorService {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;
	private templateToCampaignMonitorIdMap: Record<Template, any>;
	private isEnabled: boolean;

	constructor(private configService: ConfigService) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('campaignMonitorApiEndpoint'),
			resolveBodyOnly: true,
			username: this.configService.get('campaignMonitorApiKey'),
			password: '.',
			responseType: 'json',
		});

		this.isEnabled = this.configService.get('enableSendEmail');

		this.templateToCampaignMonitorIdMap = {
			VISIT_APPROVED: this.configService.get('campaignMonitorTemplateVisitApproved'),
			VISIT_DENIED: this.configService.get('campaignMonitorTemplateVisitDenied'),
		};
	}

	public setIsEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	// TODO call on status change
	public async send(emailInfo: EmailInfo): Promise<boolean> {
		const data: any = {
			To: emailInfo.to,
			ConsentToTrack: 'unchanged',
			Data: emailInfo.data,
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
				`Mock email sent. To: '${emailInfo.to}'. Template: ${emailInfo.template} - ${
					this.templateToCampaignMonitorIdMap[emailInfo.template]
				}`
			);
			return false;
		}
		return true;
	}
}
