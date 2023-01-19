import { FindMaterialRequestsQuery } from './../../generated/graphql-db-types-hetarchief';

export interface MaterialRequest {
	id: string;
	objectSchemaIdentifier: string;
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	type: MaterialRequestType;
	requesterName?: string;
	requesterMail?: string;
	maintainerId?: string;
	maintainerName?: string;
	maintainerSlug?: string;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export type GqlMaterialRequest = FindMaterialRequestsQuery['app_material_requests'][0];
