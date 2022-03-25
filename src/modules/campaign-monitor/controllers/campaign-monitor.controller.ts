import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SendMailDto } from '../dto/campaign-monitor.dto';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { ApiKeyGuard } from '~shared/guards/api-key.guard';
@ApiTags('Campaign-monitor')
@Controller('campaign-monitor')
export class CampaignMonitorController {
	constructor(private campaignMonitorService: CampaignMonitorService) {}

	/**
	 * Test call to send test emails using campaign monitor
	 */
	@UseGuards(ApiKeyGuard)
	@Post('send')
	public async sendMail(
		@Body() sendMailDto: SendMailDto,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers('apiKey') apiKey: string
	): Promise<boolean> {
		return this.campaignMonitorService.send(sendMailDto.templateId, sendMailDto.data);
	}
}
