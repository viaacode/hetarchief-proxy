import {
	DataService,
	Locale,
	MaintenanceAlertsService,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { isPast } from 'date-fns';

import { DeleteNotificationDto } from '../dto/notifications.dto';
import {
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
import { VisitorSpace } from '~modules/spaces/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { VisitRequest } from '~modules/visits/types';
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
		visitRequest: VisitRequest,
		recipients: Recipient[],
		user: SessionUserEntity
	): Promise<Notification[]> {
		const newVisitRequestEmail = visitRequest.spaceMail || recipients[0]?.email;

		const name = user.getFullName();
		const [notifications] = await Promise.all([
			this.create(
				recipients.map((recipient) => ({
					title: this.translationsService.tText(
						'modules/notifications/services/notifications___er-is-aan-aanvraag-om-je-bezoekersruimte-te-bezoeken',
						null,
						user.getLanguage()
					),
					description: this.translationsService.tText(
						'modules/notifications/services/notifications___name-wil-je-bezoekersruimte-bezoeken',
						{
							name,
						},
						user.getLanguage()
					),
					visit_id: visitRequest.id,
					type: NotificationType.NEW_VISIT_REQUEST,
					status: NotificationStatus.UNREAD,
					recipient: recipient.id,
				}))
			),
			// important: the mail on new visit request is sent to the general email address, not to all maintainers
			// See ARC-305
			this.campaignMonitorService.sendForVisit({
				to: [
					{
						id: `space-${visitRequest.spaceId}`,
						email: this.campaignMonitorService.getAdminEmail(newVisitRequestEmail),
						language: Locale.Nl, // Visitor spaces are always contacted in dutch: ARC-2117
					},
				],
				template: Template.VISIT_REQUEST_CP,
				visitRequest: visitRequest,
			}),
		]);
		return notifications;
	}

	/**
	 * Send notifications and email on approve visit request
	 */
	public async onApproveVisitRequest(
		visitRequest: VisitRequest,
		space: VisitorSpace
	): Promise<Notification> {
		const startDate = formatAsBelgianDate(visitRequest.startAt);
		const endDate = formatAsBelgianDate(visitRequest.endAt);
		const [notifications] = await Promise.all([
			this.create([
				{
					title: this.translationsService.tText(
						'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-goedgekeurd',
						{
							name: space.name,
						},
						visitRequest.visitorLanguage
					),
					description: this.translationsService.tText(
						'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-goedgekeurd-je-zal-toegang-hebben-van-start-date-tot-end-date',
						{
							name: space.name,
							startDate,
							endDate,
						},
						visitRequest.visitorLanguage
					),
					visit_id: visitRequest.id,
					type: NotificationType.VISIT_REQUEST_APPROVED,
					status: isPast(convertToDate(visitRequest.startAt))
						? NotificationStatus.READ
						: NotificationStatus.UNREAD,
					recipient: visitRequest.visitorId,
				},
			]),
			this.campaignMonitorService.sendForVisit({
				to: [
					{
						id: visitRequest.visitorId,
						email: visitRequest.visitorMail,
						language: visitRequest.visitorLanguage,
					},
				],
				template: Template.VISIT_APPROVED,
				visitRequest: visitRequest,
			}),
		]);
		return notifications[0];
	}

	/**
	 * Send notifications and email on deny visit request
	 */
	public async onDenyVisitRequest(
		visitRequest: VisitRequest,
		space: VisitorSpace,
		reason?: string
	): Promise<Notification> {
		const reasonWithFallback =
			reason ||
			this.translationsService.tText(
				'modules/notifications/services/notifications___er-werd-geen-reden-opgegeven',
				null,
				visitRequest.visitorLanguage
			);
		const [notifications] = await Promise.all([
			this.create([
				{
					title: this.translationsService.tText(
						'modules/notifications/services/notifications___je-aanvraag-voor-bezoekersruimte-name-is-afgekeurd',
						{
							name: space.name,
						},
						visitRequest.visitorLanguage
					),
					description: this.translationsService.tText(
						'modules/notifications/services/notifications___reden-reason',
						{
							reason: reasonWithFallback,
						},
						visitRequest.visitorLanguage
					),
					visit_id: visitRequest.id,
					type: NotificationType.VISIT_REQUEST_DENIED,
					status: NotificationStatus.UNREAD,
					recipient: visitRequest.visitorId,
				},
			]),
			this.campaignMonitorService.sendForVisit({
				to: [
					{
						id: visitRequest.visitorId,
						email: visitRequest.visitorMail,
						language: visitRequest.visitorLanguage,
					},
				],
				template: Template.VISIT_DENIED,
				visitRequest: visitRequest,
			}),
		]);
		return notifications[0];
	}

	/**
	 * Send a notification to multiple recipients when a user cancels their own request
	 */
	public async onCancelVisitRequest(
		visitRequest: VisitRequest,
		recipients: Recipient[],
		user: SessionUserEntity
	): Promise<Notification[]> {
		const name = user.getFullName();
		return this.create(
			recipients.map((recipient) => {
				const title = this.translationsService.tText(
					'modules/notifications/services/notifications___een-aanvraag-om-je-bezoekersruimte-te-bezoeken-is-geannuleerd',
					null,
					recipient.language
				);
				const description = this.translationsService.tText(
					'modules/notifications/services/notifications___name-heeft-zelf-de-aanvraag-geannuleerd',
					{
						name,
					},
					recipient.language
				);

				return {
					title,
					description,
					visit_id: visitRequest.id,
					type: NotificationType.VISIT_REQUEST_CANCELLED,
					status: NotificationStatus.UNREAD,
					recipientId: recipient.id,
				};
			})
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
