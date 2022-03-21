import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get } from 'lodash';

import {
	GqlCreateNotificationsForReadingRoom,
	GqlCreateOrUpdateNotification,
	GqlNotification,
	Notification,
	NotificationStatus,
	NotificationType,
} from '../types';

import {
	FIND_NOTIFICATIONS_BY_USER,
	INSERT_NOTIFICATIONS,
	UPDATE_ALL_NOTIFICATION_FOR_USER,
	UPDATE_NOTIFICATION,
} from './queries.gql';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { Template } from '~modules/campaign-monitor/types';
import { DataService } from '~modules/data/services/data.service';
import { Space } from '~modules/spaces/types';
import { User } from '~modules/users/types';
import { Visit } from '~modules/visits/types';
import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';
import { PaginationHelper } from '~shared/helpers/pagination';
import i18n from '~shared/i18n';
import { Recipient } from '~shared/types/types';

@Injectable()
export class NotificationsService {
	private logger: Logger = new Logger(NotificationsService.name, { timestamp: true });

	constructor(
		protected dataService: DataService,
		protected campaignMonitorService: CampaignMonitorService
	) {}

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
			readingRoomId: get(gqlNotification, 'visit.cp_space_id'),
		};
	}

	public async findNotificationsByUser(
		userProfileId: string,
		moreRecentThan: string,
		page,
		size
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
		notifications: Partial<GqlCreateOrUpdateNotification>[]
	): Promise<Notification[]> {
		const response = await this.dataService.execute(INSERT_NOTIFICATIONS, {
			objects: notifications,
		});
		const createdNotifications = response.data.insert_app_notification.returning;
		this.logger.debug(`${createdNotifications.length} notifications created`);

		return createdNotifications.map(this.adaptNotification);
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
		return this.create(
			recipients.map((recipient) => ({
				...notification,
				recipient,
			}))
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

		const updatedNotification = response.data.update_app_notification.returning[0];
		if (!updatedNotification) {
			throw new NotFoundException(
				'Notification not found or you are not the notifications recipient.'
			);
		}
		this.logger.debug(`Notification ${updatedNotification.id} updated`);

		return this.adaptNotification(updatedNotification);
	}

	public async updateAll(
		userProfileId: string,
		notification: Partial<GqlCreateOrUpdateNotification>
	): Promise<number> {
		const response = await this.dataService.execute(UPDATE_ALL_NOTIFICATION_FOR_USER, {
			userProfileId,
			notification,
		});

		const affectedRows = response.data.update_app_notification.affectedRows;
		this.logger.debug(`All Notifications for user ${userProfileId} updated`);

		return affectedRows;
	}

	/**
	 * Send notifications and email on new visit request
	 */
	public async onCreateVisit(
		visit: Visit,
		recipients: Recipient[],
		user: User
	): Promise<Notification[]> {
		const [notifications] = await Promise.all([
			this.createForMultipleRecipients(
				{
					title: i18n.t('Er is aan aanvraag om je leeszaal te bezoeken'),
					description: i18n.t('{{name}} wil je leeszaal bezoeken', {
						name: user.firstName + ' ' + user.lastName,
					}),
					visit_id: visit.id,
					type: NotificationType.NEW_VISIT_REQUEST,
					status: NotificationStatus.UNREAD,
				},
				recipients.map((recipient) => recipient.id)
			),
			this.campaignMonitorService.sendForVisit({
				to: recipients,
				template: Template.VISIT_REQUEST_CP,
				visit,
			}),
		]);
		return notifications;
	}

	/**
	 * Send notifications and email on approve visit request
	 */
	public async onApproveVisitRequest(
		visit: Visit,
		space: Space,
		user: User
	): Promise<Notification> {
		const [notifications] = await Promise.all([
			this.create([
				{
					title: i18n.t('Je aanvraag voor leeszaal {{name}} is goedgekeurd', {
						name: space.name,
					}),
					description: i18n.t(
						'Je aanvraag voor leeszaal {{name}} is goedgekeurd. Je zal toegang hebben van {{startDate}} tot {{endDate}}',
						{
							name: space.name,
							startDate: formatAsBelgianDate(visit.startAt),
							endDate: formatAsBelgianDate(visit.endAt),
						}
					),
					visit_id: visit.id,
					type: NotificationType.VISIT_REQUEST_APPROVED,
					status: NotificationStatus.UNREAD,
					recipient: user.id, // TODO question this should be the visit.visitorId, because user is the logged in user??
				},
			]),
			this.campaignMonitorService.sendForVisit({
				to: [{ id: visit.visitorId, email: visit.visitorMail }],
				template: Template.VISIT_APPROVED,
				visit,
			}),
		]);
		return notifications[0];
	}

	/**
	 * Send notifications and email on deny visit request
	 */
	public async onDenyVisitRequest(
		visit: Visit,
		space: Space,
		user: User,
		reason?: string
	): Promise<Notification> {
		const [notifications] = await Promise.all([
			this.create([
				{
					title: i18n.t('Je aanvraag voor leeszaal {{name}} is afgekeurd', {
						name: space.name,
					}),
					description: i18n.t('Reden: {{reason}}', {
						reason: reason || i18n.t('Er werd geen reden opgegeven'),
					}),
					visit_id: visit.id,
					type: NotificationType.VISIT_REQUEST_DENIED,
					status: NotificationStatus.UNREAD,
					recipient: user.id, // TODO question this should be the visit.visitorId, because user is the logged in user??
				},
			]),
			this.campaignMonitorService.sendForVisit({
				to: [{ id: visit.visitorId, email: visit.visitorMail }],
				template: Template.VISIT_DENIED,
				visit,
			}),
		]);
		return notifications[0];
	}
}
