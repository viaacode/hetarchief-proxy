import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { MaterialRequestMessage } from '../material-request-messages.types';

import {
	CountUnreadMaterialRequestMessagesDocument,
	CountUnreadMaterialRequestMessagesQuery,
	CountUnreadMaterialRequestMessagesQueryVariables,
	DeleteMessageUnreadEntriesDocument,
	DeleteMessageUnreadEntriesMutation,
	DeleteMessageUnreadEntriesMutationVariables,
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

	private adapt(
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
		message: string,
		attachmentUrl: string,
		attachmentFilename: string,
		timestamp: string
	): Promise<MaterialRequestMessage> {
		const response = await this.dataService.execute<
			InsertMaterialRequestMessageMutation,
			InsertMaterialRequestMessageMutationVariables
		>(InsertMaterialRequestMessageDocument, {
			materialRequestId,
			senderProfileId: profileId,
			messageType,
			body: message,
			attachmentUrl: attachmentUrl || null,
			attachmentFilename: attachmentFilename || null,
			createdAt: timestamp,
		});

		return this.adapt(response.insert_app_material_request_messages_and_events_one);
	}
}
