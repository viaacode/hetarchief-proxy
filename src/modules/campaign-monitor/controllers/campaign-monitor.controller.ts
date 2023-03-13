import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CampaignMonitorSendMailDto } from '../dto/campaign-monitor.dto';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Campaign-monitor')
@Controller('campaign-monitor')
export class CampaignMonitorController {
	constructor(private campaignMonitorService: CampaignMonitorService) {}

	/**
	 * Send an email using the campaign monitor api.
	 */
	@Post('send')
	@ApiOperation({ description: 'Send transactional mails through Campaign Monitor' })
	async sendMail(
		@Body() emailInfo: CampaignMonitorSendMailDto
	): Promise<void | BadRequestException> {
		return this.campaignMonitorService.sendMail(emailInfo);
	}
}
