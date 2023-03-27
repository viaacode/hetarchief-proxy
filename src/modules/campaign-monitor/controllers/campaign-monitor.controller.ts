import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	Redirect,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CampaignMonitorNewsletterPreferences } from '../campaign-monitor.types';
import {
	CampaignMonitorConfirmMailQueryDto,
	CampaignMonitorNewsletterPreferencesQueryDto,
	CampaignMonitorNewsletterUpdatePreferencesQueryDto,
	CampaignMonitorSendMailDto,
} from '../dto/campaign-monitor.dto';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@ApiTags('Campaign-monitor')
@Controller('campaign-monitor')
export class CampaignMonitorController {
	constructor(private campaignMonitorService: CampaignMonitorService) {}

	/**
	 * Send an email using the campaign monitor api.
	 */
	@UseGuards(LoggedInGuard)
	@Post('send')
	@ApiOperation({ description: 'Send transactional mails through Campaign Monitor' })
	async sendTransactionalMail(
		@Body() emailInfo: CampaignMonitorSendMailDto
	): Promise<{ message: 'success' }> {
		await this.campaignMonitorService.sendTransactionalMail(emailInfo);
		return { message: 'success' };
	}

	@UseGuards(LoggedInGuard)
	@Get('preferences')
	@ApiOperation({ description: 'Fetch user newsletter preferences' })
	async getPreferences(
		@Query() preferencesQueryDto: CampaignMonitorNewsletterPreferencesQueryDto
	): Promise<CampaignMonitorNewsletterPreferences> {
		return await this.campaignMonitorService.fetchNewsletterPreferences(
			preferencesQueryDto.email
		);
	}

	@Post('preferences')
	@ApiOperation({ description: 'Update user newsletter preferences' })
	async updatePreferences(
		@Body() preferences: CampaignMonitorNewsletterUpdatePreferencesQueryDto,
		@SessionUser() user?: SessionUserEntity
	): Promise<void> {
		if (user.getId()) {
			return await this.campaignMonitorService.updateNewsletterPreferences(
				preferences.preferences,
				{
					firstName: user?.getFirstName(),
					lastName: user?.getLastName(),
					email: user?.getMail(),
					is_key_user: user?.getIsKeyUser(),
					usergroup: user?.getGroupName(),
					created_date: user?.getCreatedAt(),
					last_access_date: user?.getLastAccessAt(),
					organisation: user?.getOrganisationName(),
				}
			);
		}
		return await this.campaignMonitorService.sendConfirmationMail(preferences);
	}

	@Get('confirm-email')
	@Redirect()
	@ApiOperation({ description: 'Update user newsletter preferences' })
	async confirmMail(@Query() queryDto: CampaignMonitorConfirmMailQueryDto) {
		try {
			await this.campaignMonitorService.confirmEmail(queryDto);
			return {
				url: `${process.env.CLIENT_HOST}/nieuwsbrief/bevestiging`,
			};
		} catch (error) {
			return {
				url: `${process.env.CLIENT_HOST}/nieuwsbrief/mislukt`,
			};
		}
	}
}
