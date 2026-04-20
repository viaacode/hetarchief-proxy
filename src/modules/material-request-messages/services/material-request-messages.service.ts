import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { set } from 'lodash';
import {
	MaterialRequestAttachment,
	MaterialRequestAttachmentOrderProp,
	MaterialRequestEvent,
	MaterialRequestMessage,
	MaterialRequestMessageBody,
} from '../material-request-messages.types';

import {
	CountUnreadMaterialRequestMessagesDocument,
	CountUnreadMaterialRequestMessagesQuery,
	CountUnreadMaterialRequestMessagesQueryVariables,
	DeleteMessageUnreadEntriesDocument,
	DeleteMessageUnreadEntriesMutation,
	DeleteMessageUnreadEntriesMutationVariables,
	GetEvaluatorsForOrganisationDocument,
	GetEvaluatorsForOrganisationQuery,
	GetEvaluatorsForOrganisationQueryVariables,
	GetMaterialRequestAttachmentByIdDocument,
	GetMaterialRequestAttachmentByIdQuery,
	GetMaterialRequestAttachmentByIdQueryVariables,
	GetMaterialRequestAttachmentsDocument,
	GetMaterialRequestAttachmentsQuery,
	GetMaterialRequestAttachmentsQueryVariables,
	GetMaterialRequestMessagesDocument,
	GetMaterialRequestMessagesQuery,
	GetMaterialRequestMessagesQueryVariables,
	InsertMaterialRequestMessageDocument,
	InsertMaterialRequestMessageMutation,
	InsertMaterialRequestMessageMutationVariables,
	InsertMaterialRequestMessageUnreadStatusDocument,
	InsertMaterialRequestMessageUnreadStatusMutation,
	InsertMaterialRequestMessageUnreadStatusMutationVariables,
	Lookup_App_Material_Request_Message_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';

import { mapLimit } from 'blend-promise-utils';
import { addMilliseconds, format } from 'date-fns';
import { MaterialRequestMessageBodyAdditionalConditionsDto } from '~modules/material-request-messages/dto/material-request-message-body-additional-conditions.dto';
import { MaterialRequestPdfGeneratorService } from '~modules/material-request-messages/services/material-request-pdf-generator';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

const ATTACHMENT_ORDER_PROP_TO_DB_PROP: Record<MaterialRequestAttachmentOrderProp, string> = {
	[MaterialRequestAttachmentOrderProp.CREATED_AT]: 'created_at',
	[MaterialRequestAttachmentOrderProp.ATTACHMENT_FILENAME]: 'attachment_filename',
};

@Injectable()
export class MaterialRequestMessagesService {
	constructor(
		private dataService: DataService,
		private materialRequestPdfGeneratorService: MaterialRequestPdfGeneratorService
	) {}

	/**
	 * Get's messages from the database from most recent to oldest
	 * @param materialRequestId
	 * @param page
	 * @param size
	 */
	public async findAll(
		materialRequestId: string,
		page: number,
		size: number
	): Promise<IPagination<MaterialRequestMessage>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		const materialRequestMessagesResponse = await this.dataService.execute<
			GetMaterialRequestMessagesQuery,
			GetMaterialRequestMessagesQueryVariables
		>(GetMaterialRequestMessagesDocument, {
			materialRequestId,
			offset,
			limit,
		});

		return Pagination<MaterialRequestMessage>({
			items: materialRequestMessagesResponse?.app_material_request_messages_and_events?.map(
				(event) => this.adapt(event)
			),
			page,
			size,
			total:
				materialRequestMessagesResponse?.app_material_request_messages_and_events_aggregate
					?.aggregate?.count,
		});
	}

	public async countUnreadMessages(materialRequestId: string, profileId: string): Promise<number> {
		const response = await this.dataService.execute<
			CountUnreadMaterialRequestMessagesQuery,
			CountUnreadMaterialRequestMessagesQueryVariables
		>(CountUnreadMaterialRequestMessagesDocument, {
			materialRequestId,
			profileId,
		});
		return response.app_material_request_message_unread_status_aggregate?.aggregate?.count || 0;
	}

	public adaptEvent(
		message: GetMaterialRequestMessagesQuery['app_material_request_messages_and_events'][0]
	): MaterialRequestEvent {
		return {
			id: message.id,
			materialRequestId: message.material_request_id,
			messageType: message.message_type,
			body: message.body || null,
			createdAt: message.created_at,
			senderProfile: {
				id: message.sender_profile_id,
				firstName: message.sender?.first_name,
				lastName: message.sender?.last_name,
				organisation: {
					id: message.sender?.organisation?.org_identifier,
					name: message.sender?.organisation.skos_pref_label,
				},
				mail: message.sender?.mail,
			},
		};
	}

	private adapt(
		message: GetMaterialRequestMessagesQuery['app_material_request_messages_and_events'][0]
	): MaterialRequestMessage {
		return {
			...this.adaptEvent(message),
			attachments: (message.attachments || [])
				.map((attachment) => this.adaptAttachment(attachment))
				.sort(
					(first, second) =>
						new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
				),
		};
	}

	public async deleteMessageUnreadEntries(
		materialRequestId: string,
		profileId: string
	): Promise<void> {
		await this.dataService.execute<
			DeleteMessageUnreadEntriesMutation,
			DeleteMessageUnreadEntriesMutationVariables
		>(DeleteMessageUnreadEntriesDocument, { materialRequestId, profileId });
	}

	async createMessage(
		materialRequest: MaterialRequest,
		profileId: string | null, // if the event was created by the proxy itself. eg: when the download becomes available
		messageType: Lookup_App_Material_Request_Message_Type_Enum,
		message?: MaterialRequestMessageBody | null,
		createdAt: string = new Date().toISOString(),
		attachments: Pick<MaterialRequestAttachment, 'attachmentUrl' | 'attachmentFilename'>[] = []
	): Promise<MaterialRequestMessage> {
		const response = await this.dataService.execute<
			InsertMaterialRequestMessageMutation,
			InsertMaterialRequestMessageMutationVariables
		>(InsertMaterialRequestMessageDocument, {
			materialRequestId: materialRequest.id,
			senderProfileId: profileId,
			messageType,
			body: message || null,
			attachments: (attachments || []).map((attachment, i) => ({
				attachment_filename: attachment.attachmentFilename,
				attachment_url: attachment.attachmentUrl,
				// To ensure the files appear in-order, we tweak the created at date to ensure they are sequential
				created_at: addMilliseconds(new Date(createdAt), i).toISOString(),
			})),
			createdAt,
		});

		const insertedMessage = this.adapt(
			response.insert_app_material_request_messages_and_events_one
		);

		const receiverIds: string[] = [];

		// sender is the system => send to the requester and all evaluators of this organisation
		// sender is the requester => send to all evaluators of this organisation
		if (profileId === materialRequest.requesterId || !profileId) {
			const evaluatorResponse = await this.dataService.execute<
				GetEvaluatorsForOrganisationQuery,
				GetEvaluatorsForOrganisationQueryVariables
			>(GetEvaluatorsForOrganisationDocument, {
				organisationId: materialRequest.maintainerId,
			});

			receiverIds.push(...evaluatorResponse.users_profile.map((item) => item.id as string));
		}

		if (profileId !== materialRequest.requesterId) {
			// An evaluator answered the requester or the system
			receiverIds.push(materialRequest.requesterId);
		}

		await mapLimit(receiverIds, 5, async (receiverId) => {
			await this.dataService.execute<
				InsertMaterialRequestMessageUnreadStatusMutation,
				InsertMaterialRequestMessageUnreadStatusMutationVariables
			>(InsertMaterialRequestMessageUnreadStatusDocument, {
				material_request_id: materialRequest.id,
				material_request_message_id: insertedMessage.id,
				receiver_profile_id: receiverId,
			});
		});

		return insertedMessage;
	}

	public async createReuseSummaryMessage(
		materialRequest: MaterialRequest
	): Promise<MaterialRequestMessage> {
		return this.createMessage(
			materialRequest,
			materialRequest.requesterId,
			Lookup_App_Material_Request_Message_Type_Enum.ReuseSummary,
			null,
			new Date().toISOString(),
			[
				{
					attachmentUrl:
						await this.materialRequestPdfGeneratorService.generateReuseFormPdfAndUpload(
							materialRequest
						),
					attachmentFilename: `Hergebruik-formulier-${format(new Date(), 'ddMMyyyyHHmm')}.pdf`,
				},
			]
		);
	}

	public async createFinalSummaryMessage(
		materialRequest: MaterialRequest,
		profileId: string
	): Promise<MaterialRequestMessage> {
		return this.createMessage(
			materialRequest,
			profileId,
			Lookup_App_Material_Request_Message_Type_Enum.FinalSummary,
			null,
			new Date().toISOString(),
			[
				{
					attachmentUrl:
						await this.materialRequestPdfGeneratorService.generateFinalSummaryPdfAndUpload(
							materialRequest
						),
					attachmentFilename: `Synthesedocument-${format(new Date(), 'ddMMyyyyHHmm')}.pdf`,
				},
			]
		);
	}

	public async findAttachments(
		materialRequestId: string,
		page: number,
		size: number,
		orderProp: MaterialRequestAttachmentOrderProp = MaterialRequestAttachmentOrderProp.CREATED_AT,
		orderDirection: SortDirection = SortDirection.asc
	): Promise<IPagination<MaterialRequestAttachment>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		const orderBy = [
			set(
				{},
				ATTACHMENT_ORDER_PROP_TO_DB_PROP[orderProp] ||
					ATTACHMENT_ORDER_PROP_TO_DB_PROP[MaterialRequestAttachmentOrderProp.CREATED_AT],
				orderDirection
			),
		];

		const response = await this.dataService.execute<
			GetMaterialRequestAttachmentsQuery,
			GetMaterialRequestAttachmentsQueryVariables
		>(GetMaterialRequestAttachmentsDocument, {
			materialRequestId,
			offset,
			limit,
			orderBy,
		});

		return Pagination<MaterialRequestAttachment>({
			items: response?.app_material_request_messages_attachments?.map(this.adaptAttachment),
			page,
			size,
			total: response?.app_material_request_messages_attachments_aggregate?.aggregate?.count,
		});
	}

	public async getAllAttachments(materialRequestId: string): Promise<MaterialRequestAttachment[]> {
		const response = await this.dataService.execute<
			GetMaterialRequestAttachmentsQuery,
			GetMaterialRequestAttachmentsQueryVariables
		>(GetMaterialRequestAttachmentsDocument, {
			materialRequestId,
			offset: 0,
			limit: 1000,
		});

		return response?.app_material_request_messages_attachments?.map(this.adaptAttachment) || [];
	}

	private adaptAttachment(
		attachment: GetMaterialRequestAttachmentsQuery['app_material_request_messages_attachments'][0]
	): MaterialRequestAttachment {
		return {
			id: attachment.id,
			attachmentUrl: attachment.attachment_url,
			attachmentFilename: attachment.attachment_filename,
			createdAt: attachment.created_at,
		};
	}

	public async findAttachmentById(
		materialRequestId: string,
		attachmentId: string
	): Promise<MaterialRequestAttachment | null> {
		const response = await this.dataService.execute<
			GetMaterialRequestAttachmentByIdQuery,
			GetMaterialRequestAttachmentByIdQueryVariables
		>(GetMaterialRequestAttachmentByIdDocument, {
			materialRequestId,
			attachmentId,
		});

		const attachment = response?.app_material_request_messages_attachments?.[0];
		if (!attachment) {
			return null;
		}

		return this.adaptAttachment(attachment);
	}

	/**
	 * Add additional conditions to the material request that the requester has to accept before the material download can be made available.
	 * @param materialRequest
	 * @param profileId Evaluator profile id that is added the additional conditions
	 * @param extraConditions
	 */
	public async addExtraConditions(
		materialRequest: MaterialRequest,
		profileId: string,
		extraConditions: MaterialRequestMessageBodyAdditionalConditionsDto
	) {
		await this.createMessage(
			materialRequest,
			profileId,
			Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditions,
			extraConditions,
			new Date().toString(),
			null
		);
	}

	/**
	 * Requester of material accepts the additional conditions imposed by the evaluator of the material request
	 * @param materialRequest
	 * @param profileId requester profile id
	 */
	public async acceptExtraConditions(materialRequest: MaterialRequest, profileId: string) {
		await this.createMessage(
			materialRequest,
			profileId,
			Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsAccepted,
			null,
			new Date().toString(),
			null
		);
	}

	/**
	 * Requester of material declines the additional conditions imposed by the evaluator of the material request
	 * @param materialRequest
	 * @param profileId requester profile id
	 */
	public async declineExtraConditions(materialRequest: MaterialRequest, profileId: string) {
		await this.createMessage(
			materialRequest,
			profileId,
			Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsDenied,
			null,
			new Date().toString(),
			null
		);
	}
}
