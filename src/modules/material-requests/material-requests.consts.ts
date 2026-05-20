import {
	Lookup_App_Material_Request_Message_Type_Enum,
	Lookup_App_Material_Request_Status_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { EmailTemplate } from '~modules/campaign-monitor/campaign-monitor.types';
import { LogEventType } from '~modules/events/types';
import {
	MaterialRequestEvent,
	MaterialRequestMessageBodyStatusUpdateWithMotivation,
} from '~modules/material-request-messages/material-request-messages.types';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
import { NotificationType } from '~modules/notifications/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof MaterialRequest, string>> = {
	id: 'id',
	createdAt: 'created_at',
	requestedAt: 'requested_at',
	type: 'type',
	status: 'status_info.sort_order',
	requestGroupName: 'name',
	requesterFullName: 'requested_by.full_name',
	requesterMail: 'requested_by.mail',
	maintainerName: 'intellectualEntity.schemaMaintainer.skos_pref_label',
	objectSchemaName: 'intellectualEntity.schema_name',
};

export const MAP_MATERIAL_REQUEST_STATUS_TO_NOTIFICATION_TYPE = {
	[Lookup_App_Material_Request_Status_Enum.Cancelled]: NotificationType.MATERIAL_REQUEST_CANCELLED,
	[Lookup_App_Material_Request_Status_Enum.Approved]: NotificationType.MATERIAL_REQUEST_APPROVED,
	[Lookup_App_Material_Request_Status_Enum.Denied]: NotificationType.MATERIAL_REQUEST_DENIED,
};

export const MAP_MATERIAL_REQUEST_STATUS_TO_EVENT_TYPE = {
	[Lookup_App_Material_Request_Status_Enum.Cancelled]: LogEventType.ITEM_REQUEST_CANCEL,
	[Lookup_App_Material_Request_Status_Enum.Approved]: LogEventType.ITEM_REQUEST_APPROVE,
	[Lookup_App_Material_Request_Status_Enum.Denied]: LogEventType.ITEM_REQUEST_DENY,
};

export const MAP_NOTIFICATION_TYPE_TO_EMAIL_TEMPLATE = {
	[NotificationType.MATERIAL_REQUEST_CANCELLED]:
		EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER_CANCELLED,
	[NotificationType.MATERIAL_REQUEST_APPROVED]:
		EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER_APPROVED,
	[NotificationType.MATERIAL_REQUEST_DENIED]:
		EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER_DENIED,
	[NotificationType.MATERIAL_REQUEST_DOWNLOAD_AVAILABLE]:
		EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_READY_REQUESTER,
	[NotificationType.MATERIAL_REQUEST_DOWNLOAD_EXECUTED]:
		EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_DOWNLOADED,
	[NotificationType.MATERIAL_REQUEST_DOWNLOAD_ALMOST_EXPIRED]:
		EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_EXPIRE_SOON,
};

export const mapUserToGroupNameAndKeyUser = (user: SessionUserEntity): string => {
	if (!user.getIsKeyUser()) {
		return user.getGroupName();
	}

	switch (user.getGroupName()) {
		case GroupName.MEEMOO_ADMIN:
			return 'MEEMOO_ADMIN_INTRA_CP';
		case GroupName.CP_ADMIN:
			return 'CP_ADMIN_INTRA_CP';
		default:
			return 'VISITOR_INTRA_CP';
	}
};

export const getAdditionEventDate = (
	type: LogEventType,
	request: MaterialRequest
): {
	motivation?: string;
	time?: string;
} => {
	if (type === LogEventType.ITEM_REQUEST_APPROVE) {
		const event = getStatusEvent(
			request.history,
			Lookup_App_Material_Request_Message_Type_Enum.Approved
		);
		return {
			motivation: (event.body as MaterialRequestMessageBodyStatusUpdateWithMotivation).motivation,
			time: event.createdAt,
		};
	}

	if (type === LogEventType.ITEM_REQUEST_DENY) {
		const event = getStatusEvent(
			request.history,
			Lookup_App_Material_Request_Message_Type_Enum.Denied
		);
		return {
			motivation: (event.body as MaterialRequestMessageBodyStatusUpdateWithMotivation).motivation,
			time: request.createdAt,
		};
	}

	if (type === LogEventType.ITEM_REQUEST_CANCEL) {
		const event = getStatusEvent(
			request.history,
			Lookup_App_Material_Request_Message_Type_Enum.Cancelled
		);
		return {
			time: event.createdAt,
		};
	}

	if (type === LogEventType.ITEM_REQUEST_DOWNLOAD_AVAILABLE) {
		// TODO: get this from the history
		return {
			time: request.downloadAvailableAt,
		};
	}

	return {};
};

export function getStatusEvent(
	statusEvents: MaterialRequestEvent[],
	messageType: Lookup_App_Material_Request_Message_Type_Enum
): MaterialRequestEvent | undefined {
	return statusEvents?.find((e) => e.messageType === messageType);
}

export function getLastStatusEventOfType(
	statusEvents: MaterialRequestEvent[],
	messageTypes: Lookup_App_Material_Request_Message_Type_Enum[]
): MaterialRequestEvent | null {
	return (
		statusEvents.findLast((event): boolean => {
			return messageTypes.includes(event.messageType);
		}) || null
	);
}
