import {
	DataService,
	Locale,
	MaintenanceAlertsService,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { isPast } from 'date-fns';

import { DeleteNotificationDto } from '../dto/notifications.dto';
import {
	type GqlNotification,
	type Notification,
	NotificationStatus,
	NotificationType,
} from '../types';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { AvoUserCommonUser } from '@viaa/avo2-types';
import {
	type App_Notification_Bool_Exp,
	type App_Notification_Insert_Input,
	DeleteNotificationsDocument,
	type DeleteNotificationsMutation,
	type DeleteNotificationsMutationVariables,
	FindNotificationsByUserDocument,
	type FindNotificationsByUserQuery,
	type FindNotificationsByUserQueryVariables,
	InsertNotificationsDocument,
	type InsertNotificationsMutation,
	type InsertNotificationsMutationVariables,
	UpdateAllNotificationsForUserDocument,
	type UpdateAllNotificationsForUserMutation,
	type UpdateAllNotificationsForUserMutationVariables,
	UpdateNotificationDocument,
	type UpdateNotificationMutation,
	type UpdateNotificationMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import {
	ConsentToTrackOption,
	EmailTemplate,
	type MaterialRequestEmailInfo,
} from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import {
	MaterialRequest,
	MaterialRequestSendRequestListUserInfo,
} from '~modules/material-requests/material-requests.types';
import type { VisitorSpace } from '~modules/spaces/spaces.types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import type { VisitRequest } from '~modules/visits/types';
import { convertToDate, formatAsBelgianDate } from '~shared/helpers/format-belgian-date';
import { PaginationHelper } from '~shared/helpers/pagination';
import type { Recipient } from '~shared/types/types';

@Injectable()
export class NotificationsService {
	constructor(
		private dataService: DataService,
		protected campaignMonitorService: CampaignMonitorService,
		protected translationsService: TranslationsService,
		protected maintenanceAlertsService: MaintenanceAlertsService
	) {}

	/**
	 * Adapt a notification as returned by a typical graphQl response to our internal notification data model
	 */
	public adaptNotification(gqlNotification: GqlNotification | undefined): Notification | undefined {
		if (!gqlNotification) {
			return undefined;
		}

		const visitRequest = gqlNotification?.visitor_space_request;
		const materialRequest = gqlNotification?.material_request;

		return {
			id: gqlNotification?.id,
			description: gqlNotification?.description,
			title: gqlNotification?.title,
			status: gqlNotification?.status as NotificationStatus,
			createdAt: gqlNotification?.created_at,
			updatedAt: gqlNotification?.updated_at,
			type: gqlNotification?.type as NotificationType,

			visitId: visitRequest ? gqlNotification?.linked_entity_id : undefined,
			visitorSpaceSlug: visitRequest?.visitor_space?.organisation?.organizationSlug?.slug,

			materialRequestId: materialRequest ? gqlNotification?.linked_entity_id : undefined,
			materialRequestRequester: materialRequest?.requested_by
				? `${materialRequest.requested_by.first_name} ${materialRequest.requested_by.last_name}`
				: undefined,
			materialRequestMaintainer:
				materialRequest?.intellectualEntity?.schemaMaintainer?.skos_pref_label,
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
		notifications: Partial<App_Notification_Insert_Input>[]
	): Promise<Notification[]> {
		const response = await this.dataService.execute<
			InsertNotificationsMutation,
			InsertNotificationsMutationVariables
		>(InsertNotificationsDocument, {
			objects: notifications,
		});
		const createdNotifications = response.insert_app_notification.returning;

		return createdNotifications.map(this.adaptNotification);
	}

	public async update(
		notificationId: string,
		userProfileId: string,
		notification: Partial<App_Notification_Insert_Input>
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
		return this.adaptNotification(updatedNotification);
	}

	public async updateAll(
		userProfileId: string,
		notification: Partial<App_Notification_Insert_Input>
	): Promise<number> {
		const response = await this.dataService.execute<
			UpdateAllNotificationsForUserMutation,
			UpdateAllNotificationsForUserMutationVariables
		>(UpdateAllNotificationsForUserDocument, {
			userProfileId,
			notification,
		});

		return response.update_app_notification.affected_rows;
	}

	public async delete(visitId: string, deleteNotificationDto: DeleteNotificationDto) {
		const where: App_Notification_Bool_Exp = {
			linked_entity_id: { _eq: visitId },
			...(deleteNotificationDto.types ? { type: { _in: deleteNotificationDto.types } } : {}),
		};

		const response = await this.dataService.execute<
			DeleteNotificationsMutation,
			DeleteNotificationsMutationVariables
		>(DeleteNotificationsDocument, {
			where,
		});

		return response.delete_app_notification.affected_rows;
	}

	/**
	 * Send notifications and email on new visit request
	 */
	public async onCreateVisit(
		visitRequest: VisitRequest,
		recipients: Recipient[],
		user: SessionUserEntity
	): Promise<Notification[]> {
		try {
			const newVisitRequestEmail = visitRequest.spaceMail || recipients[0]?.email;

			const name = user.getFullName();
			const userEmail = user.getMail();
			const userLanguage = user.getLanguage();
			const [notifications] = await Promise.all([
				this.create(
					recipients.map((recipient) => ({
						title: this.translationsService.tText(
							'modules/notifications/services/notifications___er-is-aan-aanvraag-om-je-bezoekersruimte-te-bezoeken',
							null,
							userLanguage
						),
						description: this.translationsService.tText(
							'modules/notifications/services/notifications___name-wil-je-bezoekersruimte-bezoeken',
							{
								name,
							},
							userLanguage
						),
						linked_entity_id: visitRequest.id,
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
					replyTo: userEmail,
					template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP,
					visitRequest: visitRequest,
				}),
			]);
			return notifications;
		} catch (err) {
			throw new HttpException('Failed to send notifications and email', 500, err);
		}
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
					linked_entity_id: visitRequest.id,
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
				replyTo: visitRequest.spaceMail,
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED,
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
					linked_entity_id: visitRequest.id,
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
				replyTo: visitRequest.spaceMail,
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED,
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
			recipients.map((recipient): App_Notification_Insert_Input => {
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
					linked_entity_id: visitRequest.id,
					type: NotificationType.VISIT_REQUEST_CANCELLED,
					status: NotificationStatus.UNREAD,
					recipient: recipient.id,
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
				linked_entity_id: null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		]);
	}

	/**
	 * Send notifications and email on new material request to the maintainer
	 */
	public async onCreateMaterialRequestMaintainer(
		materialRequests: MaterialRequest[],
		sendRequestListDto: SendRequestListDto,
		userInfo: MaterialRequestSendRequestListUserInfo,
		recipients: string[]
	): Promise<Notification[]> {
		try {
			const [notifications] = await Promise.all([
				this.create(
					materialRequests.flatMap((materialRequest) =>
						this.createForMaterialRequest(
							materialRequest,
							recipients,
							NotificationType.NEW_MATERIAL_REQUEST
						)
					)
				),
				this.campaignMonitorService.sendForMaterialRequest({
					// Each materialRequest in this group has the same maintainer, otherwise, the maintainer will receive multiple mails
					to: materialRequests[0].contactMail,
					replyTo: materialRequests[0]?.requesterMail,
					template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER,
					materialRequests: materialRequests,
					sendRequestListDto,
					requesterFirstName: userInfo.firstName,
					requesterLastName: userInfo.lastName,
					language: userInfo.language,
				}),
			]);
			return notifications || [];
		} catch (err) {
			throw new HttpException('Failed to send notifications and email', 500, err);
		}
	}

	/**
	 * Send email on new material request to the requester
	 */
	public async onCreateMaterialRequestRequester(
		materialRequests: MaterialRequest[],
		sendRequestListDto: SendRequestListDto,
		userInfo: MaterialRequestSendRequestListUserInfo
	): Promise<void> {
		try {
			await this.campaignMonitorService.sendForMaterialRequest({
				to: materialRequests[0]?.requesterMail,
				replyTo: null, // Reply to support@meemoo.be
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER,
				materialRequests: materialRequests,
				sendRequestListDto,
				requesterFirstName: userInfo.firstName,
				requesterLastName: userInfo.lastName,
				language: userInfo.language,
			});
		} catch (err) {
			throw new HttpException('Failed to send notifications and email', 500, err);
		}
	}

	/**
	 * Send notifications and email on status updates of material request
	 */
	public async onStatusUpdateMaterialRequest(
		emailInfo: MaterialRequestEmailInfo,
		type: NotificationType,
		recipients: string[]
	): Promise<Notification[]> {
		try {
			const [notifications] = await Promise.all([
				this.create(
					emailInfo.materialRequests.flatMap((materialRequest) =>
						this.createForMaterialRequest(materialRequest, recipients, type)
					)
				),
				this.campaignMonitorService.sendForMaterialRequest(emailInfo),
			]);
			return notifications;
		} catch (err) {
			throw new HttpException('Failed to send notifications and email', 500, err);
		}
	}

	/**
	 * Send email on download export failed of material request
	 */
	public async onDownloadFailedMaterialRequest(
		request: MaterialRequest,
		requesterUser: AvoUserCommonUser
	): Promise<void> {
		try {
			await this.campaignMonitorService.sendForMaterialRequest({
				to: null,
				replyTo: null,
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_FAILED,
				language: Locale.Nl,
				materialRequests: [request],
				sendRequestListDto: {
					type: request.requesterCapacity,
					organisationName: request.requesterOrganisationName,
					organisationId: request.requesterOrganisationId,
					requestGroupName: request.requestGroupName,
				},
				requesterFirstName: requesterUser.firstName,
				requesterLastName: requesterUser.lastName,
			});
		} catch (err) {
			throw new HttpException('Failed to send email', 500, err);
		}
	}

	/**
	 * Sends an e-mail and notification to the requester of a material request when the evaluator of the material request has added additional requirements
	 * @param materialRequest
	 */
	public async onSendAdditionalConditionsForMaterialRequest(
		materialRequest: MaterialRequest
	): Promise<Notification[]> {
		try {
			const [notifications] = await Promise.all([
				this.create(
					this.createForMaterialRequest(
						materialRequest,
						[materialRequest.requesterId],
						NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_SEND
					)
				),
				this.campaignMonitorService.sendTransactionalMail(
					{
						template:
							EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_ADDITIONAL_REQUIREMENTS_SENT,
						data: {
							to: materialRequest.requesterMail,
							replyTo: materialRequest.contactMail,
							data: this.campaignMonitorService.convertMaterialRequestToEmailTemplateFields(
								materialRequest
							),
							consentToTrack: ConsentToTrackOption.UNCHANGED,
						},
					},
					materialRequest.requesterLanguage
				),
			]);
			return notifications;
		} catch (err) {
			throw new HttpException('Failed to send notifications and email', 500, err);
		}
	}

	/**
	 * Sends a reminder e-mail to the requester of a material request when the evaluator of the material request has added additional requirements
	 * @param materialRequest
	 */
	public async onSendAdditionalConditionsReminderForMaterialRequest(
		materialRequest: MaterialRequest
	): Promise<void> {
		try {
			await this.campaignMonitorService.sendTransactionalMail(
				{
					template:
						EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_ADDITIONAL_REQUIREMENTS_REMINDER,
					data: {
						to: materialRequest.requesterMail,
						replyTo: materialRequest.contactMail,
						consentToTrack: ConsentToTrackOption.UNCHANGED,
						data: this.campaignMonitorService.convertMaterialRequestToEmailTemplateFields(
							materialRequest
						),
					},
				},
				materialRequest.requesterLanguage
			);
		} catch (err) {
			throw new HttpException('Failed to send notifications and email', 500, err);
		}
	}

	/**
	 * Sends an email and notification to the maintainer of the object that was requested with the message that the requester has accepted the additional requirements imposed by the evaluator of the material request
	 * @param materialRequest
	 * @param userId
	 * @param recipients
	 */
	public async sendEmailForAcceptanceOfAdditionalConditionsToEvaluators(
		materialRequest: MaterialRequest,
		userId: string,
		recipients: string[]
	) {
		try {
			const [notifications] = await Promise.all([
				this.create(
					this.createForMaterialRequest(
						materialRequest,
						recipients,
						NotificationType.MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_ACCEPTED
					)
				),
				this.campaignMonitorService.sendTransactionalMail(
					{
						template:
							EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_ADDITIONAL_REQUIREMENTS_ACCEPTED,
						data: {
							to: materialRequest.requesterMail,
							replyTo: materialRequest.contactMail,
							data: this.campaignMonitorService.convertMaterialRequestToEmailTemplateFields(
								materialRequest
							),
							consentToTrack: ConsentToTrackOption.UNCHANGED,
						},
					},
					// Same language as the requester even though we send it to the maintainer contact email
					// https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6088949761/Overzicht+transactionele+mails+-+Hermes+CL+4#3.-Bijkomende-gebruiksvoorwaarden-werden-geaccepteerd
					materialRequest.requesterLanguage
				),
			]);
			return notifications;
		} catch (err) {
			console.error(
				new CustomError(
					'Failed to send email for accepting additional conditions to maintainer of the object in the material request',
					err,
					{
						materialRequestId: materialRequest.id,
						userId,
						functionName: 'sendEmailForAcceptanceOfAdditionalConditionsToEvaluators',
					}
				)
			);
		}
	}

	private createForMaterialRequest(
		materialRequest: MaterialRequest,
		recipients: string[],
		type: NotificationType | undefined
	): Partial<App_Notification_Insert_Input>[] {
		if (!type) {
			return [];
		}

		return recipients.map((recipient) => ({
			// Using type for the title and description since this needs to be rendered on the client
			// depending on desktop and mobile
			linked_entity_id: materialRequest.id,
			type,
			status: NotificationStatus.UNREAD,
			recipient,
		}));
	}
}
