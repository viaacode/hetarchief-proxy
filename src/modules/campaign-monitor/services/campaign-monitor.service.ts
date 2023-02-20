import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { isArray } from 'lodash';

import { Configuration } from '~config';

import { templateIds } from '../campaign-monitor.consts';
import { CampaignMonitorEmailInfo } from '../campaign-monitor.types';

@Injectable()
export class CampaignMonitorService {
	private logger: Logger = new Logger(CampaignMonitorService.name, { timestamp: true });

	private gotInstance: Got;

	constructor(private configService: ConfigService<Configuration>) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('CAMPAIGN_MONITOR_API_ENDPOINT'),
			resolveBodyOnly: true,
			username: this.configService.get('CAMPAIGN_MONITOR_API_KEY'),
			password: '.',
			responseType: 'json',
		});
	}

	public async send(emailInfo: CampaignMonitorEmailInfo): Promise<void | BadRequestException> {
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

			const data: any = {
				Data: emailInfo.data,
				ConsentToTrack: 'unchanged',
			};

			if (isArray(emailInfo.to)) {
				data.BCC = emailInfo.to;
			} else {
				data.To = [emailInfo.to];
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
}
