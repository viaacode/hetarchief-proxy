import {
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsQuery,
} from './../../generated/graphql-db-types-hetarchief';

export interface MaterialRequest {
	id: string;
	objectSchemaIdentifier: string;
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	type: MaterialRequestType;
	requestedBy: MaterialRequestRequester;
	maintainer: MaterialRequestMaintainer;
	object: MaterialRequestObject;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export interface MaterialRequestRequester {
	requesterId: string;
	requesterFullName: string;
	requesterMail: string;
	requesterGroup: MaterialRequestRequesterUserGroup;
}

export interface MaterialRequestRequesterUserGroup {
	id: string;
	name: string;
	label: string;
	description: string;
}

export interface MaterialRequestMaintainer {
	name: string;
	id: string;
	slug: string;
	logo: string;
}

export interface MaterialRequestObject {
	name: string;
	pid: string;
}

export type GqlMaterialRequest =
	| FindMaterialRequestsQuery['app_material_requests'][0]
	| FindMaterialRequestsByIdQuery['app_material_requests'][0];
