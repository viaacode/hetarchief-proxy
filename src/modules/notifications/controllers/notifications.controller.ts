import {
	Controller,
	Get,
	Headers,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { addMonths } from 'date-fns';
import i18n from 'i18next';

import {
	GqlCreateOrUpdateNotification,
	Notification,
	NotificationStatus,
	NotificationType,
} from '../types';

import { NotificationsQueryDto } from '~modules/notifications/dto/notifications.dto';
import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { VisitsService } from '~modules/visits/services/visits.service';
import { Visit } from '~modules/visits/types';
import { SessionHelper } from '~shared/auth/session-helper';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

@UseGuards(LoggedInGuard)
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(
		private notificationsService: NotificationsService,
		private visitService: VisitsService
	) {}

	@Get()
	public async getNotifications(
		@Query() queryDto: NotificationsQueryDto,
		@Session() session: Record<string, any>
	): Promise<IPagination<Notification>> {
		const userInfo = SessionHelper.getArchiefUserInfo(session);
		const notifications = await this.notificationsService.findNotificationsByUser(
			userInfo.id,
			addMonths(new Date(), -1).toISOString(),
			queryDto.page,
			queryDto.size
		);
		return notifications;
	}

	@Patch(':notificationId/mark-as-read')
	public async markAsRead(
		@Param('notificationId') notificationId: string,
		@Session() session: Record<string, any>
	): Promise<Notification> {
		const notification = await this.notificationsService.update(
			notificationId,
			SessionHelper.getArchiefUserInfo(session).id,
			{ status: NotificationStatus.READ }
		);
		return notification;
	}

	@Patch('mark-as-read')
	public async markAllAsRead(
		@Session() session: Record<string, any>
	): Promise<{ status: string; total: number }> {
		const amountUpdated = await this.notificationsService.updateAll(
			SessionHelper.getArchiefUserInfo(session).id,
			{ status: NotificationStatus.READ }
		);
		return { status: `updated ${amountUpdated} notifications`, total: amountUpdated };
	}

	/**
	 * Check all visit requests to see if any notifications have to be triggered related to startAt or endAt times
	 *
	 * This api call will be triggered by a cron job somewhere in openshift. We do this as a route for 2 reasons:
	 *     - We can test these easily by triggering them using postman
	 *     - They can be triggered once on a single pod if the proxy every has to be load balanced across multiple pods
	 * @param apiKey
	 */
	@UseGuards(ApiKeyGuard)
	@Post('check-new')
	public async checkNewNotifications(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers('apiKey') apiKey: string
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
				status: i18n.t('Notificaties verzonden'),
				notifications: {
					[NotificationType.ACCESS_PERIOD_READING_ROOM_STARTED]:
						accessStartsNotifications.length,
					[NotificationType.ACCESS_PERIOD_READING_ROOM_END_WARNING]:
						accessAlmostEndedNotifications.length,
					[NotificationType.ACCESS_PERIOD_READING_ROOM_ENDED]:
						accessEndedNotifications.length,
				},
				total: totalNotificationsSent,
			};
		} else {
			return {
				status: i18n.t('No notifications had to be sent'),
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
			(visit): GqlCreateOrUpdateNotification => ({
				title: i18n.t('Je hebt nu toegang tot de leeszaal {{name}}', {
					name: visit.spaceName,
				}),
				description: i18n.t('Je toegang vervalt terug op {{endDate}}', {
					endDate: formatAsBelgianDate(visit.endAt),
				}),
				visit_id: visit.id,
				type: NotificationType.ACCESS_PERIOD_READING_ROOM_STARTED,
				status: NotificationStatus.UNREAD,
				recipient: visit.userProfileId,
			})
		);

		return this.notificationsService.create(notifications);
	}

	/**
	 * Check APPROVED visitRequests that have passed their warning end time and do not have an ACCESS_PERIOD_READING_ROOM_END_WARNING notification
	 * @private
	 */
	private async sendAccessAlmostEndedNotifications(): Promise<Notification[]> {
		const visits: Visit[] =
			await this.visitService.getApprovedAndAlmostEndedVisitsWithoutNotification();
		const notifications: GqlCreateOrUpdateNotification[] = visits.map(
			(visit): GqlCreateOrUpdateNotification => ({
				title: i18n.t(
					'Je toegang tot de leeszaal {{name}} loopt af over {{minutes}} minuten',
					{
						name: visit.spaceName,
						minutes: 15,
					}
				),
				description: i18n.t('Sla je werk op voor je toegang verliest'),
				visit_id: visit.id,
				type: NotificationType.ACCESS_PERIOD_READING_ROOM_ENDED,
				status: NotificationStatus.UNREAD,
				recipient: visit.userProfileId,
			})
		);

		return this.notificationsService.create(notifications);
	}

	/**
	 * Check APPROVED visitRequests that have passed their end time and do not have an ACCESS_PERIOD_READING_ROOM_ENDED notification
	 * @private
	 */
	private async sendAccessEndNotifications(): Promise<Notification[]> {
		const visits: Visit[] =
			await this.visitService.getApprovedAndEndedVisitsWithoutNotification();
		const notifications: GqlCreateOrUpdateNotification[] = visits.map(
			(visit): GqlCreateOrUpdateNotification => ({
				title: i18n.t('Je toegang tot de leeszaal {{name}} is afgelopen', {
					name: visit.spaceName,
				}),
				description: i18n.t(
					'Om opnieuw toegang te krijgen tot deze leeszaal kan je een nieuwe aanvraag indienen'
				),
				visit_id: visit.id,
				type: NotificationType.ACCESS_PERIOD_READING_ROOM_ENDED,
				status: NotificationStatus.UNREAD,
				recipient: visit.userProfileId,
			})
		);

		return this.notificationsService.create(notifications);
	}
}
