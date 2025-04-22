import {
	type FindMaintainersWithMaterialRequestsQuery,
	type FindMaterialRequestsByIdQuery,
	type FindMaterialRequestsQuery,
	type Lookup_App_Material_Request_Requester_Capacity_Enum,
	type Lookup_App_Material_Request_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { type IeObjectType } from '~modules/ie-objects/ie-objects.types';
import { type Locale } from '~shared/types/types';

export interface MaterialRequest {
	id: string;
	objectId: string;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	objectMeemooLocalId?: string;
	objectDctermsFormat: IeObjectType;
	objectThumbnailUrl: string;
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	type: Lookup_App_Material_Request_Type_Enum;
	isPending: boolean;
	requesterId: string;
	requesterFullName: string;
	requesterMail: string;
	requesterCapacity: Lookup_App_Material_Request_Requester_Capacity_Enum;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	requesterUserGroupId?: string;
	requesterUserGroupName?: string;
	requesterUserGroupLabel?: string;
	requesterUserGroupDescription?: string;
	maintainerLogo?: string;
	contactMail?: string;
	organisation?: string | null;
}

export interface MaterialRequestMaintainer {
	id: string;
	name: string;
}

export interface MaterialRequestFindAllExtraParameters {
	userProfileId?: string;
	userGroup?: string;
	isPersonal?: boolean;
}

export interface MaterialRequestSendRequestListUserInfo {
	firstName: string;
	lastName: string;
	language: Locale;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export enum MaterialRequestRequesterCapacity {
	OTHER = 'OTHER',
	WORK = 'WORK',
	PRIVATE_RESEARCH = 'PRIVATE_RESEARCH',
	EDUCATION = 'EDUCATION',
}

export enum MaterialRequestOrderProp {
	ID = 'id',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	TYPE = 'type',
	REQUESTER_FULL_NAME = 'requesterFullName',
	REQUESTER_MAIL = 'requesterMail',
	MAINTAINER_NAME = 'maintainerName',
	NAME = 'objectSchemaName',
}

export type GqlMaterialRequest =
	| FindMaterialRequestsQuery['app_material_requests'][0]
	| FindMaterialRequestsByIdQuery['app_material_requests'][0];

export type GqlMaterialRequestMaintainer =
	FindMaintainersWithMaterialRequestsQuery['graph_organisations_with_material_requests'][0];
