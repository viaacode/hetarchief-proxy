import { DataService, MaintenanceAlertsService, TranslationsService } from '@meemoo/admin-core-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { isPast } from 'date-fns';

import { DeleteNotificationDto } from '../dto/notifications.dto';
import {
	GqlCreateNotificationsForVisitorSpace,
	GqlCreateOrUpdateNotification,
	GqlNotification,
	Notification,
	NotificationStatus,
	NotificationType,
} from '../types';

import {
	DeleteNotificationsDocument,
	DeleteNotificationsMutation,
	DeleteNotificationsMutationVariables,
	FindNotificationsByUserDocument,
	FindNotificationsByUserQuery,
	FindNotificationsByUserQueryVariables,
	InsertNotificationsDocument,
	InsertNotificationsMutation,
	InsertNotificationsMutationVariables,
	UpdateAllNotificationsForUserDocument,
	UpdateAllNotificationsForUserMutation,
	UpdateAllNotificationsForUserMutationVariables,
	UpdateNotificationDocument,
	UpdateNotificationMutation,
	UpdateNotificationMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { Template } from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { Space } from '~modules/spaces/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Visit } from '~modules/visits/types';
import { convertToDate, formatAsBelgianDate } from '~shared/helpers/format-belgian-date';
import { PaginationHelper } from '~shared/helpers/pagination';
import { Recipient } from '~shared/types/types';

@Injectable()
export class NotificationsService {
	private logger: Logger = new Logger(NotificationsService.name, { timestamp: true });

	constructor(
		protected dataService: DataService,
		protected campaignMonitorService: CampaignMonitorService,
		protected translationsService: TranslationsService,
		protected maintenanceAlertsService: MaintenanceAlertsService
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
		/* istanbul ignore next */
		return {
			id: gqlNotification?.id,
			description: gqlNotification?.description,
			title: gqlNotification?.title,
			status: gqlNotification?.status as NotificationStatus,
			visitId: gqlNotification?.visit_id,
			createdAt: gqlNotification?.created_at,
			updatedAt: gqlNotification?.updated_at,
			type: gqlNotification?.type as NotificationType,
			visitorSpaceSlug: gqlNotification?.visitor_space_request?.visitor_space?.slug,
		};
	}

	public async findNotificationsByUser(
		userProfileId: string,
		moreRecentThan: string,
		page,
		size
	): Promise<IPagination<Notification>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const notificationsResponse = await this.dataService.execute<
			FindNotificationsByUserQuery,
			FindNotificationsByUserQueryVariables
		>(FindNotificationsByUserDocument, {
			userProfileId,
			moreRecentThan,
			offset,
			limit,
		});

		return Pagination<Notification>({
			items: notificationsResponse.app_notification.map((notification: any) =>
				this.adaptNotification(notification)
			),
			page,
			size,
			total: notificationsResponse.app_notification_aggregate.aggregate.count,
		});
	}

	public async create(
		notifications: Partial<GqlCreateOrUpdateNotification>[]
	): Promise<Notification[]> {
		const response = await this.dataService.execute<
			InsertNotificationsMutation,
			InsertNotificationsMutationVariables
		>(InsertNotificationsDocument, {
			objects: notifications,
		});
		const createdNotifications = response.insert_app_notification.returning;
		this.logger.debug(`${createdNotifications.length} notifications created`);

		return createdNotifications.map(this.adaptNotification);
	}

	/**
	 * Create a notification for each recipient
	 * @param notification the notification that should be sent
	 * @param recipients user profile ids to whom the notification should be sent
	 */
	public async createForMultipleRecipients(
		notification: Partial<GqlCreateNotificationsForVisitorSpace>,
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
		const response = await this.dataService.execute<
			UpdateNotificationMutation,
			UpdateNotificationMutationVariables
		>(UpdateNotificationDocument, {
			notificationId,
			userProfileId,
			notification,
		});

		const updatedNotification = response.update_app_notification.returning[0];
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
		const response = await this.dataService.execute<
			UpdateAllNotificationsForUserMutation,
			UpdateAllNotificationsForUserMutationVariables
		>(UpdateAllNotificationsForUserDocument, {
			userProfileId,
			notification,
		});

		const affectedRows = response.update_app_notification.affected_rows;
		this.logger.debug(`All Notifications for user ${userProfileId} updated`);

		return affectedRows;
	}

	public async delete(visitId: string, deleteNotificationDto: DeleteNotificationDto) {
		const where = {
			visit_id: { _eq: visitId },
			...(deleteNotificationDto.types ? { type: { _in: deleteNotificationDto.types } } : {}),
		};

		const response = await this.dataService.execute<
			DeleteNotificationsMutation,
			DeleteNotificationsMutationVariables
		>(DeleteNotificationsDocument, {
			where,
		});

		const affectedRows = response.delete_app_notification.affected_rows;
		this.logger.debug(`${affectedRows} notifications deleted for visit ${visitId}`);

		return affectedRows;
	}

	/**
	 * Send notifications and email on new visit request
	 */
	public async onCreateVisit(
		visit: Visit,
		recipients: Recipient[],
		user: SessionUserEntity
	): Promise<Notification[]> {
		const newVisitRequestEmail = visit.spaceMail || recipients[0]?.email;

		const name = user.getFullName();
		const [notifications] = await Promise.all([
			this.createForMultipleRecipients(
				{
					title: this.translationsService.t(
						'modules/notifications/services/notifications___er-is-aan-aanvraag-om-je-bezoekersruimte-te-bezoeken'
					),
					description: this.translationsService.t(
						'modules/notifications/services/notifications___name-wil-je-bezoekersruimte-bezoeken',
						{
							name,
						}
					),
					visit_id: visit.id,
					type: NotificationType.NEW_VISIT_REQUEST,
					status: NotificationStatus.UNREAD,
				},
				recipients.map((recipient) => recipient.id)
			),
			// important: the mail on new visit request is sent to the general email adres, not to all maintainers
			// See ARC-305
			this.campaignMonitorService.sendForVisit({
				to: [
					{
						id: `space-${visit.spaceId}`,
						email: this.campaignMonitorService.getAdminEmail(newVisitRequestEmail),
					},
				],
				template: Template.VISIT_REQUEST_CP,
				visit,
			}),
		]);
		return notifications;
	}

	/**
	 * Send notifications and email on approve visit request
	 */
	public async onApproveVisitRequest(visit: Visit, space: Space): Promise<Notification> {
		const startDate = formatAsBelgianDate(visit.startAt);
		const endDate = formatAsBelgianDate(visit.endAt);
		const [notifications] = await Promise.all([
			this.create([
				{
					title: this.translationsService.t(
						'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-goedgekeurd',
						{
							name: space.name,
						}
					),
					description: this.translationsService.t(
						'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-goedgekeurd-je-zal-toegang-hebben-van-start-date-tot-end-date',
						{
							name: space.name,
							startDate,
							endDate,
						}
					),
					visit_id: visit.id,
					type: NotificationType.VISIT_REQUEST_APPROVED,
					status: isPast(convertToDate(visit.startAt))
						? NotificationStatus.READ
						: NotificationStatus.UNREAD,
					recipient: visit.visitorId,
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
		reason?: string
	): Promise<Notification> {
		const reasonWithFallback =
			reason ||
			this.translationsService.t(
				'modules/notifications/services/notifications___er-werd-geen-reden-opgegeven'
			);
		const [notifications] = await Promise.all([
			this.create([
				{
					title: this.translationsService.t(
						'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-afgekeurd',
						{
							name: space.name,
						}
					),
					description: this.translationsService.t(
						'modules/notifications/services/notifications___reden-reason',
						{
							reason: reasonWithFallback,
						}
					),
					visit_id: visit.id,
					type: NotificationType.VISIT_REQUEST_DENIED,
					status: NotificationStatus.UNREAD,
					recipient: visit.visitorId,
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

	/**
	 * Send a notification to multiple recipients when a user cancels their own request
	 */
	public async onCancelVisitRequest(
		visit: Visit,
		recipients: Recipient[],
		user: SessionUserEntity
	): Promise<Notification[]> {
		const name = user.getFullName();
		return this.createForMultipleRecipients(
			{
				title: this.translationsService.t(
					'modules/notifications/services/notifications___een-aanvraag-om-je-bezoekersruimte-te-bezoeken-is-geannuleerd'
				),
				description: this.translationsService.t(
					'modules/notifications/services/notifications___name-heeft-zelf-de-aanvraag-geannuleerd',
					{
						name,
					}
				),
				visit_id: visit.id,
				type: NotificationType.VISIT_REQUEST_CANCELLED,
				status: NotificationStatus.UNREAD,
			},
			recipients.map((recipient) => recipient.id)
		);
	}

	public async createFromMaintenanceAlert(maintenanceAlertId: string, profileId: string) {
		const maintenanceAlert = await this.maintenanceAlertsService.findById(maintenanceAlertId);
		await this.create([
			{
				title: maintenanceAlert.title,
				status: NotificationStatus.READ,
				description: maintenanceAlert.message,
				type: NotificationType.MAINTENANCE_ALERT,
				recipient: profileId,
				visit_id: null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		]);
	}
}
