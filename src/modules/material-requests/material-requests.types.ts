import { FindMaterialRequestsQuery } from './../../generated/graphql-db-types-hetarchief';

export interface MaterialRequest {
	id: string;
	objectSchemaIdentifier: string;
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
}

export type GqlMaterialRequest = FindMaterialRequestsQuery['app_material_requests'][0];
