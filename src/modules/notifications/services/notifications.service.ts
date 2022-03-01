import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get } from 'lodash';

import {
	GqlCreateNotificationsForReadingRoom,
	GqlCreateOrUpdateNotification,
	GqlNotification,
	Notification,
} from '../types';

import {
	FIND_NOTIFICATIONS_BY_USER,
	INSERT_NOTIFICATION,
	UPDATE_NOTIFICATION,
} from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class NotificationsService {
	private logger: Logger = new Logger(NotificationsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a notification as returned by a typical graphQl response to our internal notification data model
	 */
	public adaptNotification(
		gqlNotification: GqlNotification | undefined
	): Notification | undefined {
		if (!gqlNotification) {
			return undefined;
		}
		return {
			id: get(gqlNotification, 'id'),
			description: get(gqlNotification, 'description'),
			title: get(gqlNotification, 'title'),
			status: get(gqlNotification, 'status'),
			visitId: get(gqlNotification, 'visit_id'),
			createdAt: get(gqlNotification, 'created_at'),
			updatedAt: get(gqlNotification, 'updated_at'),
			type: get(gqlNotification, 'type'),
			showAt: get(gqlNotification, 'show_at'),
		};
	}

	public async findNotificationsByUser(
		userProfileId: string,
		moreRecentThan: string,
		page = 1,
		size = 20
	): Promise<IPagination<Notification>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const notificationsResponse = await this.dataService.execute(FIND_NOTIFICATIONS_BY_USER, {
			userProfileId,
			moreRecentThan,
			offset,
			limit,
		});

		return Pagination<Notification>({
			items: notificationsResponse.data.app_notification.map((notification: any) =>
				this.adaptNotification(notification)
			),
			page,
			size,
			total: notificationsResponse.data.app_notification_aggregate.aggregate.count,
		});
	}

	public async create(
		notification: Partial<GqlCreateOrUpdateNotification>
	): Promise<Notification> {
		const response = await this.dataService.execute(INSERT_NOTIFICATION, {
			object: notification,
		});
		const createdNotification = response?.data?.insert_app_notification?.returning[0];
		this.logger.debug(`Notification ${createdNotification?.id} created`);

		return this.adaptNotification(createdNotification);
	}

	/**
	 * Create a notification for each recipient
	 * @param notification the notification that should be sent
	 * @param recipients user profile ids to whom the notification should be sent
	 */
	public async createForMultipleRecipients(
		notification: Partial<GqlCreateNotificationsForReadingRoom>,
		recipients: string[]
	): Promise<Notification[]> {
		return await Promise.all(
			recipients.map((recipient) =>
				this.create({
					...notification,
					recipient,
				})
			)
		);
	}

	public async update(
		notificationId: string,
		userProfileId: string,
		notification: Partial<GqlCreateOrUpdateNotification>
	): Promise<Notification> {
		const response = await this.dataService.execute(UPDATE_NOTIFICATION, {
			notificationId,
			userProfileId,
			notification,
		});

		const updatedNotification = response.data.update_app_notification.returning?.[0];
		if (!updatedNotification) {
			throw new NotFoundException(
				'Notification not found or you are not the notifications recipient.'
			);
		}
		this.logger.debug(`Notification ${updatedNotification.id} updated`);

		return this.adaptNotification(updatedNotification);
	}
}
