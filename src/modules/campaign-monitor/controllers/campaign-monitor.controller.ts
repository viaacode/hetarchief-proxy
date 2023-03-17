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
	async sendTransactionalMail(
		@Body() emailInfo: CampaignMonitorSendMailDto
	): Promise<void | BadRequestException> {
		// TODO: replace empty string with correct url
		return this.campaignMonitorService.sendTransactionalMail(emailInfo, '');
	}
}
