import { Controller, Get, Param, Patch, Put, Query, Session, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { addMonths } from 'date-fns';

import { Notification, NotificationStatus } from '../types';

import { NotificationsQueryDto } from '~modules/notifications/dto/notifications.dto';
import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
	constructor(private notificationsService: NotificationsService) {}

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
}
