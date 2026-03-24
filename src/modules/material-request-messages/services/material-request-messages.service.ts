import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import {
	MaterialRequestAttachment,
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
	Lookup_App_Material_Request_Message_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';

import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class MaterialRequestMessagesService {
	constructor(private dataService: DataService) {}

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
				this.adapt
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

	public adapt(
		message: GetMaterialRequestMessagesQuery['app_material_request_messages_and_events'][0]
	): MaterialRequestMessage {
		return {
			id: message.id,
			materialRequestId: message.material_request_id,
			senderProfile: {
				id: message.sender_profile_id,
				fullName: message.sender.full_name,
			},
			messageType: message.message_type,
			body: message.body,
			attachmentUrl: message.attachment_url,
			attachmentFilename: message.attachment_filename,
			createdAt: message.created_at,
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
		materialRequestId: string,
		profileId: string,
		messageType: Lookup_App_Material_Request_Message_Type_Enum,
		message?: MaterialRequestMessageBody,
		attachmentUrl?: string,
		attachmentFilename?: string
	): Promise<MaterialRequestMessage> {
		const response = await this.dataService.execute<
			InsertMaterialRequestMessageMutation,
			InsertMaterialRequestMessageMutationVariables
		>(InsertMaterialRequestMessageDocument, {
			materialRequestId,
			senderProfileId: profileId,
			messageType,
			body: JSON.stringify(message || {}),
			attachmentUrl: attachmentUrl || null,
			attachmentFilename: attachmentFilename || null,
			createdAt: new Date().toISOString(),
		});

		return this.adapt(response.insert_app_material_request_messages_and_events_one);
	}

	public async findAttachments(
		materialRequestId: string,
		page: number,
		size: number
	): Promise<IPagination<MaterialRequestAttachment>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		const response = await this.dataService.execute<
			GetMaterialRequestAttachmentsQuery,
			GetMaterialRequestAttachmentsQueryVariables
		>(GetMaterialRequestAttachmentsDocument, {
			materialRequestId,
			offset,
			limit,
		});

		return Pagination<MaterialRequestAttachment>({
			items: response?.app_material_request_messages_and_events?.map(this.adaptAttachment),
			page,
			size,
			total: response?.app_material_request_messages_and_events_aggregate?.aggregate?.count,
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

		return response?.app_material_request_messages_and_events?.map(this.adaptAttachment) || [];
	}

	private adaptAttachment(
		attachment: GetMaterialRequestAttachmentsQuery['app_material_request_messages_and_events'][0]
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

		const attachment = response?.app_material_request_messages_and_events?.[0];
		if (!attachment) {
			return null;
		}

		return this.adaptAttachment(attachment);
	}
}
