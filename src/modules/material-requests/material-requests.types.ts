import {
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsQuery,
} from '~generated/graphql-db-types-hetarchief';

export interface MaterialRequest {
	id: string;
	objectSchemaIdentifier: string;
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	type: string;
	requesterId: string;
	requesterFullName: string;
	requesterMail: string;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	requesterUserGroupId?: string;
	requesterUserGroupName?: string;
	requesterUserGroupLabel?: string;
	requesterUserGroupDescription?: string;
	maintainerLogo?: string;
	objectName?: string;
	objectPid?: string;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export enum MaterialRequestOrderProp {
	ID = 'id',
	CREATED_AT = 'createdAt',
	TYPE = 'type',
	REQUESTER_FULL_NAME = 'requesterFullName',
	REQUESTER_MAIL = 'requesterMail',
	MAINTAINER_NAME = 'maintainerName',
}

export type GqlMaterialRequest =
	| FindMaterialRequestsQuery['app_material_requests'][0]
	| FindMaterialRequestsByIdQuery['app_material_requests'][0];
