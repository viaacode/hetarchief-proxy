import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CampaignMonitorSendMailDto, PreferencesQueryDto } from '../dto/campaign-monitor.dto';
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

	@Get('preferences')
	@ApiOperation({ description: 'Fetch user newsletter preferences' })
	async getPreferences(@Query() preferencesQueryDto: PreferencesQueryDto): Promise<void> {
		//TODO change return type
		// CampaignMonitorService.fetchNewsletterPreferences(preferencesQueryDto.email);
		return null;
	}

	@Post('preferences')
	@ApiOperation({ description: 'Update user newsletter preferences' })
	async updatePreferences(): Promise<void> {
		//TODO change return type
		return null;
	}
}
