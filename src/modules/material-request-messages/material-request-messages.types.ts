import { Lookup_App_Material_Request_Message_Type_Enum } from '~generated/graphql-db-types-hetarchief';

export enum MaterialRequestAdditionalConditionsType {
	PERMISSION_LICENSE_OWNER = 'PERMISSION_LICENSE_OWNER',
	ATTRIBUTION = 'ATTRIBUTION',
	PAYMENT = 'PAYMENT',
	EXTRA_USE_LIMITATION = 'EXTRA_USE_LIMITATION',
}

export interface MaterialRequestMessageBodyAdditionalCondition {
	type: MaterialRequestAdditionalConditionsType;
	text: string;
}

export interface MaterialRequestMessageBodyMessage {
	message: string;
}

export interface MaterialRequestMessageBodyAdditionalConditions {
	conditions: MaterialRequestMessageBodyAdditionalCondition[];
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
	senderProfile: {
		id: string;
		mail: string;
		firstName: string;
		lastName: string;
		organisation: {
			id: string;
			name: string;
		};
	};
}

export interface MaterialRequestMessage extends MaterialRequestEvent {
	attachments: MaterialRequestAttachment[];
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

export enum MaterialRequestDownloadQuality {
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
}

export enum MaterialRequestIntendedUsage {
	INTERN = 'INTERN',
	NON_COMMERCIAL = 'NON_COMMERCIAL',
	COMMERCIAL = 'COMMERCIAL',
}

export enum MaterialRequestDistributionAccess {
	INTERN = 'INTERN',
	INTERN_EXTERN = 'INTERN_EXTERN',
}

export enum MaterialRequestDistributionType {
	DIGITAL_OFFLINE = 'DIGITAL_OFFLINE',
	DIGITAL_ONLINE = 'DIGITAL_ONLINE',
	OTHER = 'OTHER',
}

export enum MaterialRequestDistributionDigitalOnline {
	INTERNAL = 'INTERNAL',
	NO_AUTH = 'NO_AUTH',
	WITH_AUTH = 'WITH_AUTH',
}

export enum MaterialRequestEditing {
	NONE = 'NONE',
	WITH_CHANGES = 'WITH_CHANGES',
}

export enum MaterialRequestGeographicalUsage {
	COMPLETELY_LOCAL = 'COMPLETELY_LOCAL',
	NOT_COMPLETELY_LOCAL = 'NOT_COMPLETELY_LOCAL',
}

export enum MaterialRequestTimeUsage {
	UNLIMITED = 'UNLIMITED',
	IN_TIME = 'IN_TIME',
}

export enum MaterialRequestCopyrightDisplay {
	SAME_TIME_WITH_OBJECT = 'SAME_TIME_WITH_OBJECT',
	AROUND_OBJECT = 'AROUND_OBJECT',
	NONE = 'NONE',
}
