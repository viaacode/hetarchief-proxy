import {
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	Post,
	Query,
	Redirect,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import {
	type CampaignMonitorNewsletterPreferences,
	EmailTemplate,
} from '../campaign-monitor.types';

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

import { UsersService } from '~modules/users/services/users.service';
import { GroupName } from '~modules/users/types';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';
import { Locale } from '~shared/types/types';

@ApiTags('Campaign-monitor')
@Controller('campaign-monitor')
export class CampaignMonitorController {
	constructor(
		private campaignMonitorService: CampaignMonitorService,
		private eventsService: EventsService,
		private usersService: UsersService
	) {}

	/**
	 * Send an email using the campaign monitor api.
	 */
	@UseGuards(LoggedInGuard)
	@Post('send')
	@ApiOperation({
		description: `Send transactional mails through Campaign Monitor. Template value is one of following values (${Object.values(
			EmailTemplate
		).join(', ')}). Data custom fields are dependent on provided template type.`,
	})
	async sendTransactionalMail(
		@Body() emailInfo: CampaignMonitorSendMailDto,
		@SessionUser() user?: SessionUserEntity
	): Promise<{ message: 'success' }> {
		await this.campaignMonitorService.sendTransactionalMail(
			emailInfo,
			user?.getLanguage() || Locale.Nl
		);
		return { message: 'success' };
	}

	@UseGuards(LoggedInGuard)
	@Get('preferences')
	@ApiOperation({ description: 'Fetch user newsletter preferences' })
	async getPreferences(
		@Query() preferencesQueryDto: CampaignMonitorNewsletterPreferencesQueryDto
	): Promise<CampaignMonitorNewsletterPreferences> {
		return await this.campaignMonitorService.fetchNewsletterPreferences(preferencesQueryDto.email);
	}

	@Post('preferences')
	@ApiOperation({ description: 'Update user newsletter preferences' })
	async updatePreferences(
		@Req() request: Request,
		@Body() preferences: CampaignMonitorNewsletterUpdatePreferencesQueryDto,
		@SessionUser() user?: SessionUserEntity
	): Promise<{ message: 'success' }> {
		try {
			if (!user?.getId()) {
				// Logged out user requests to subscribe => send confirm email
				await this.campaignMonitorService.sendConfirmationMail(preferences, Locale.Nl);
			} else {
				// Logged in user subscribes to the newsletter
				const updatedUser = await this.usersService.getById(user.getId());
				if (!updatedUser) {
					throw new InternalServerErrorException({
						message: 'Failed to update preferences for campaign monitor. User was not found',
						additionalInfo: {
							preferences,
							userId: user.getId(),
						},
					});
				}
				await this.campaignMonitorService.updateNewsletterPreferences(
					{
						firstName: updatedUser.firstName,
						lastName: updatedUser.lastName,
						email: updatedUser.email,
						is_key_user: user.getIsKeyUser(),
						usergroup: user.getGroupName(),
						created_date: updatedUser.createdAt,
						last_access_date: updatedUser.lastAccessAt,
						organisation: user.getOrganisationName(),
						language: updatedUser?.language, // Get latest language setting
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
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to update preferences for campaign monitor',
				innerException: err,
				additionalInfo: {
					preferences,
					userId: user?.getId(),
				},
			});
		}
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
					subject: null, // anonymous, subject can only be null or uuid
					time: new Date().toISOString(),
					data: {
						user_group_id: null,
						user_group_name: GroupName.ANONYMOUS,
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
