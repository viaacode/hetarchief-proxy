import { Body, Controller, Get, Post, Query, Redirect, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CampaignMonitorNewsletterPreferences, Template } from '../campaign-monitor.types';
import {
	CampaignMonitorConfirmMailQueryDto,
	CampaignMonitorNewsletterPreferencesQueryDto,
	CampaignMonitorNewsletterUpdatePreferencesQueryDto,
	CampaignMonitorSendMailDto,
} from '../dto/campaign-monitor.dto';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Campaign-monitor')
@Controller('campaign-monitor')
export class CampaignMonitorController {
	constructor(
		private campaignMonitorService: CampaignMonitorService,
		private eventsService: EventsService
	) {}

	/**
	 * Send an email using the campaign monitor api.
	 */
	@UseGuards(LoggedInGuard)
	@Post('send')
	@ApiOperation({
		description: `Send transactional mails through Campaign Monitor. Template value is one of following values (${Object.values(
			Template
		).join(', ')}). Data custom fields are dependend on provided template type.`,
	})
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
		@Req() request: Request,
		@Body() preferences: CampaignMonitorNewsletterUpdatePreferencesQueryDto,
		@SessionUser() user?: SessionUserEntity
	): Promise<{ message: 'success' }> {
		if (!user?.getId()) {
			// Logged out user requests to subscribe => send confirm email
			await this.campaignMonitorService.sendConfirmationMail(preferences);
		} else {
			// Logged in user subscribes to the newsletter
			await this.campaignMonitorService.updateNewsletterPreferences(
				{
					firstName: user?.getFirstName(),
					lastName: user?.getLastName(),
					email: user?.getMail(),
					is_key_user: user?.getIsKeyUser(),
					usergroup: user?.getGroupName(),
					created_date: user?.getCreatedAt(),
					last_access_date: user?.getLastAccessAt(),
					organisation: user?.getOrganisationName(),
				},
				preferences.preferences
			);

			this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: LogEventType.NEWSLETTER_SUBSCRIBE,
					source: request.path,
					subject: user.getId(),
					time: new Date().toISOString(),
					data: {
						user_group_id: user.getGroupId(),
						user_group_name: user.getGroupName(),
					},
				},
			]);
		}

		return { message: 'success' };
	}

	@Get('confirm-email')
	@Redirect()
	@ApiOperation({ description: 'Confirm email with token and sign user up for newsletter' })
	async confirmMail(
		@Query() queryDto: CampaignMonitorConfirmMailQueryDto,
		@Req() request: Request
	) {
		try {
			await this.campaignMonitorService.confirmEmail(queryDto);

			this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: LogEventType.NEWSLETTER_SUBSCRIBE,
					source: request.path,
					subject: null,
					time: new Date().toISOString(),
					data: {
						user_group_id: 'ANONYMOUS',
						user_group_name: 'ANONYMOUS',
						user_email: queryDto.mail,
						user_first_name: queryDto.firstName,
						user_last_name: queryDto.lastName,
					},
				},
			]);

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
