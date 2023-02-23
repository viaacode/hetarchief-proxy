import {
	FindMaintainersWithMaterialRequestsQuery,
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { MediaFormat } from '~modules/ie-objects/ie-objects.types';

export interface MaterialRequest {
	id: string;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	objectMeemooIdentifier: string;
	objectType: MediaFormat;
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	type: string;
	isPending: boolean;
	requesterId: string;
	requesterFullName: string;
	requesterMail: string;
	requesterCapacity: string;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	requesterUserGroupId?: string;
	requesterUserGroupName?: string;
	requesterUserGroupLabel?: string;
	requesterUserGroupDescription?: string;
	maintainerLogo?: string;
	organisation?: string | null;
}

export interface MaterialRequestMaintainer {
	id: string;
	name: string;
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

export enum MaterialRequestRequesterCapacity {
	OTHER = 'OTHER',
	WORK = 'WORK',
	PRIVATE_RESEARCH = 'PRIVATE_RESEARCH',
	EDUCATION = 'EDUCATION',
}

export type GqlMaterialRequest =
	| FindMaterialRequestsQuery['app_material_requests'][0]
	| FindMaterialRequestsByIdQuery['app_material_requests'][0];

export type GqlMaterialRequestMaintainer =
	FindMaintainersWithMaterialRequestsQuery['maintainer_content_partners_with_material_requests'][0];
