import { TranslationsService } from '@meemoo/admin-core-api';
import {
	Controller,
	ForbiddenException,
	Get,
	Headers,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { addMonths } from 'date-fns';

import {
	GqlCreateOrUpdateNotification,
	Notification,
	NotificationStatus,
	NotificationType,
} from '../types';

import {
	CreateFromMaintenanceAlertDto,
	NotificationsQueryDto,
} from '~modules/notifications/dto/notifications.dto';
import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { VisitsService } from '~modules/visits/services/visits.service';
import { Visit } from '~modules/visits/types';
import { SessionUser } from '~shared/decorators/user.decorator';
import { APIKEY, ApiKeyGuard } from '~shared/guards/api-key.guard';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(
		private notificationsService: NotificationsService,
		private visitService: VisitsService,
		private translationsService: TranslationsService
	) {}

	@UseGuards(LoggedInGuard)
	@Get()
	public async getNotifications(
		@Query() queryDto: NotificationsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Notification>> {
		if (!user.getId()) {
			throw new ForbiddenException('You need to be logged in to get your notifications');
		}
		return await this.notificationsService.findNotificationsByUser(
			user.getId(),
			addMonths(new Date(), -1).toISOString(),
			queryDto.page,
			queryDto.size
		);
	}

	@UseGuards(LoggedInGuard)
	@Patch(':notificationId/mark-as-read')
	public async markAsRead(
		@Param('notificationId') notificationId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Notification> {
		return await this.notificationsService.update(notificationId, user.getId(), {
			status: NotificationStatus.READ,
		});
	}

	@UseGuards(LoggedInGuard)
	@Patch('mark-as-read')
	public async markAllAsRead(
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string; total: number }> {
		const amountUpdated = await this.notificationsService.updateAll(user.getId(), {
			status: NotificationStatus.READ,
		});
		return { status: `updated ${amountUpdated} notifications`, total: amountUpdated };
	}

	/**
	 * Check all visit requests to see if any notifications have to be triggered related to startAt or endAt times
	 *
	 * This api call will be triggered by a cron job somewhere in openshift. We do this as a route for 2 reasons:
	 *     - We can test these easily by triggering them using postman
	 *     - They can be triggered once on a single pod if the proxy every has to be load balanced across multiple pods
	 * @param apikey
	 */
	@UseGuards(ApiKeyGuard)
	@Post('check-new')
	public async checkNewNotifications(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers(APIKEY) apikey: string
	): Promise<{
		status: string;
		notifications?: Partial<Record<NotificationType, number>>;
		total: number;
	}> {
		const accessStartsNotifications = await this.sendAccessStartNotifications();
		const accessAlmostEndedNotifications = await this.sendAccessAlmostEndedNotifications();
		const accessEndedNotifications = await this.sendAccessEndNotifications();

		const totalNotificationsSent =
			accessStartsNotifications.length +
			accessAlmostEndedNotifications.length +
			accessEndedNotifications.length;
		if (totalNotificationsSent > 0) {
			return {
				status: this.translationsService.tText(
					'modules/notifications/controllers/notifications___notificaties-verzonden'
				),
				notifications: {
					[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED]:
						accessStartsNotifications.length,
					[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING]:
						accessAlmostEndedNotifications.length,
					[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED]:
						accessEndedNotifications.length,
				},
				total: totalNotificationsSent,
			};
		} else {
			return {
				status: this.translationsService.tText(
					'modules/notifications/controllers/notifications___no-notifications-had-to-be-sent'
				),
				total: 0,
			};
		}
	}

	/**
	 * Check APPROVED visitRequests that have passed their start time, but not their end time and do not have a VISIT_REQUEST_ACCESS_STARTS notification
	 * @private
	 */
	private async sendAccessStartNotifications(): Promise<Notification[]> {
		const visits: Visit[] =
			await this.visitService.getApprovedAndStartedVisitsWithoutNotification();
		const notifications: GqlCreateOrUpdateNotification[] = visits.map(
			(visit): GqlCreateOrUpdateNotification => {
				const endDate = formatAsBelgianDate(visit.endAt);
				return {
					title: this.translationsService.tText(
						'modules/notifications/controllers/notifications___je-hebt-nu-toegang-tot-de-bezoekersruimte-name',
						{
							name: visit.spaceName,
						}
					),
					description: this.translationsService.tText(
						'modules/notifications/controllers/notifications___je-toegang-vervalt-terug-op-end-date',
						{
							endDate,
						}
					),
					visit_id: visit.id,
					type: NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED,
					status: NotificationStatus.UNREAD,
					recipient: visit.userProfileId,
				};
			}
		);

		return this.notificationsService.create(notifications);
	}

	/**
	 * Check APPROVED visitRequests that have passed their warning end time and do not have an ACCESS_PERIOD_VISITOR_SPACE_END_WARNING notification
	 * @private
	 */
	private async sendAccessAlmostEndedNotifications(): Promise<Notification[]> {
		const visits: Visit[] =
			await this.visitService.getApprovedAndAlmostEndedVisitsWithoutNotification();
		const notifications: GqlCreateOrUpdateNotification[] = visits.map(
			(visit): GqlCreateOrUpdateNotification => ({
				title: this.translationsService.tText(
					'modules/notifications/controllers/notifications___je-toegang-tot-de-bezoekersruimte-name-loopt-af-over-minutes-minuten',
					{
						name: visit.spaceName,
						minutes: 15,
					}
				),
				description: this.translationsService.tText(
					'modules/notifications/controllers/notifications___sla-je-werk-op-voor-je-toegang-verliest'
				),
				visit_id: visit.id,
				type: NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING,
				status: NotificationStatus.UNREAD,
				recipient: visit.userProfileId,
			})
		);

		return this.notificationsService.create(notifications);
	}

	/**
	 * Check APPROVED visitRequests that have passed their end time and do not have an ACCESS_PERIOD_VISITOR_SPACE_ENDED notification
	 * @private
	 */
	private async sendAccessEndNotifications(): Promise<Notification[]> {
		const visits: Visit[] =
			await this.visitService.getApprovedAndEndedVisitsWithoutNotification();
		const notifications: GqlCreateOrUpdateNotification[] = visits.map(
			(visit): GqlCreateOrUpdateNotification => ({
				title: this.translationsService.tText(
					'modules/notifications/controllers/notifications___je-toegang-tot-de-bezoekersruimte-name-is-afgelopen',
					{
						name: visit.spaceName,
					}
				),
				description: this.translationsService.tText(
					'modules/notifications/controllers/notifications___om-opnieuw-toegang-te-krijgen-tot-deze-bezoekersruimte-kan-je-een-nieuwe-aanvraag-indienen'
				),
				visit_id: visit.id,
				type: NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED,
				status: NotificationStatus.UNREAD,
				recipient: visit.userProfileId,
			})
		);

		return this.notificationsService.create(notifications);
	}

	/**
	 * Endpoint used for debugging the translations that are used for sending out notifications
	 */
	@Get('translations')
	public async checkNotificationTranslations(): Promise<Record<string, string>> {
		const notificationTranslationKeys = [
			'modules/notifications/controllers/notifications___je-hebt-nu-toegang-tot-de-bezoekersruimte-name',
			'modules/notifications/controllers/notifications___je-toegang-tot-de-bezoekersruimte-name-is-afgelopen',
			'modules/notifications/controllers/notifications___je-toegang-tot-de-bezoekersruimte-name-loopt-af-over-minutes-minuten',
			'modules/notifications/controllers/notifications___je-toegang-vervalt-terug-op-end-date',
			'modules/notifications/controllers/notifications___no-notifications-had-to-be-sent',
			'modules/notifications/controllers/notifications___notificaties-verzonden',
			'modules/notifications/controllers/notifications___om-opnieuw-toegang-te-krijgen-tot-deze-bezoekersruimte-kan-je-een-nieuwe-aanvraag-indienen',
			'modules/notifications/controllers/notifications___sla-je-werk-op-voor-je-toegang-verliest',
			'modules/notifications/services/notifications___een-aanvraag-om-je-bezoekersruimte-te-bezoeken-is-geannuleerd',
			'modules/notifications/services/notifications___er-is-aan-aanvraag-om-je-bezoekersruimte-te-bezoeken',
			'modules/notifications/services/notifications___er-werd-geen-reden-opgegeven',
			'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-afgekeurd',
			'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-goedgekeurd',
			'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-goedgekeurd-je-zal-toegang-hebben-van-start-date-tot-end-date',
			'modules/notifications/services/notifications___name-heeft-zelf-de-aanvraag-geannuleerd',
			'modules/notifications/services/notifications___name-wil-je-bezoekersruimte-bezoeken',
			'modules/notifications/services/notifications___reden-reason',
		];
		return Object.fromEntries(
			notificationTranslationKeys.map((translationKey) => [
				translationKey,
				this.translationsService.tText(translationKey),
			])
		);
	}

	/**
	 * Is called when a user closes a maintenance alert on the client
	 * We create a read notification for that user, so they can always see the maintenance alerts in their notification center
	 * @param createFromMaintenanceAlert
	 * @param user
	 */
	@Post('create-from-maintenance-alert')
	@ApiOperation({
		description: 'Create a new maintenance alert',
	})
	@UseGuards(LoggedInGuard)
	public async dismissMaintenanceAlert(
		@Query() createFromMaintenanceAlert: CreateFromMaintenanceAlertDto,
		@SessionUser() user: SessionUserEntity
	): Promise<{ message: 'success' }> {
		await this.notificationsService.createFromMaintenanceAlert(
			createFromMaintenanceAlert.id,
			user.getId()
		);
		return { message: 'success' };
	}
}
