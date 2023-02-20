import { BadRequestException, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CampaignMonitorEmailInfo } from '../campaign-monitor.types';
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
	async send(emailInfo: CampaignMonitorEmailInfo): Promise<void | BadRequestException> {
		return this.campaignMonitorService.send(emailInfo);
	}
}
