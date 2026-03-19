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

export interface MaterialRequestMessageBodyApproved {
	message: string;
}

export interface MaterialRequestMessageBodyDenied {
	message: string;
}

export type MaterialRequestMessageBody =
	| MaterialRequestMessageBodyMessage
	| MaterialRequestMessageBodyAdditionalConditions
	| MaterialRequestMessageBodyApproved
	| MaterialRequestMessageBodyDenied;

export interface MaterialRequestMessage {
	id: string;
	materialRequestId: string;
	senderProfile: {
		id: string;
		fullName: string;
	};
	messageType: Lookup_App_Material_Request_Message_Type_Enum;
	body: MaterialRequestMessageBody;
	attachmentUrl: string | null;
	attachmentFilename: string | null;
	createdAt: string;
}
