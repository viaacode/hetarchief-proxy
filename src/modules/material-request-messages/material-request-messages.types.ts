import { Lookup_App_Material_Request_Message_Type_Enum } from '~generated/graphql-db-types-hetarchief';

export enum MaterialRequestAdditionalConditionsType {
	PERMISSION_LICENSE_OWNER = 'PERMISSION_LICENSE_OWNER',
	ATTRIBUTION = 'ATTRIBUTION',
	PAYMENT = 'PAYMENT',
	EXTRA_USE_LIMITATION = 'EXTRA_USE_LIMITATION',
}

interface Condition {
	type: MaterialRequestAdditionalConditionsType;
	text: string;
}

export interface MaterialRequestMessageBodyMessage {
	message: string;
}

export interface MaterialRequestMessageBodyAdditionalConditions {
	conditions: Condition[];
	autoApproveAfterAcceptAdditionalConditions: boolean;
}

export interface MaterialRequestMessageBodyStatusUpdateWithMotivation {
	motivation: string;
}

export type MaterialRequestMessageBody =
	| MaterialRequestMessageBodyMessage
	| MaterialRequestMessageBodyAdditionalConditions
	| MaterialRequestMessageBodyStatusUpdateWithMotivation;

export interface MaterialRequestEvent {
	id: string;
	materialRequestId: string;
	messageType: Lookup_App_Material_Request_Message_Type_Enum;
	body: MaterialRequestMessageBody;
	createdAt: string;
}

export interface MaterialRequestMessage extends MaterialRequestEvent {
	senderProfile: {
		id: string;
		fullName: string;
	};
	attachmentUrl: string | null;
	attachmentFilename: string | null;
}

export interface MaterialRequestAttachment {
	id: string;
	attachmentUrl: string;
	attachmentFilename: string;
	createdAt: string;
}

export enum MaterialRequestAttachmentOrderProp {
	CREATED_AT = 'createdAt',
	ATTACHMENT_FILENAME = 'attachmentFilename',
}
