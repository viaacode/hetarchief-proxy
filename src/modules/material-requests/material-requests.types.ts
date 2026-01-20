import {
	FindMaintainersWithMaterialRequestsQuery,
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsQuery,
	Lookup_App_Material_Request_Download_Status_Enum,
	Lookup_App_Material_Request_Requester_Capacity_Enum,
	Lookup_App_Material_Request_Status_Enum,
	Lookup_App_Material_Request_Type_Enum,
	type UpdateMaterialRequestMutation,
} from '~generated/graphql-db-types-hetarchief';
import {
	IeObjectAccessThrough,
	IeObjectLicense,
	IeObjectRepresentation,
	IeObjectType,
} from '~modules/ie-objects/ie-objects.types';
import type { Locale } from '~shared/types/types';

export interface MaterialRequest {
	id: string;
	objectId: string;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	objectMeemooLocalId?: string;
	objectDctermsFormat: IeObjectType;
	objectThumbnailUrl: string;
	objectPublishedOrCreatedDate?: string;
	objectAccessThrough: IeObjectAccessThrough[];
	objectLicences: IeObjectLicense[];
	objectRepresentationId?: string;
	objectRepresentation?: IeObjectRepresentation;
	reuseForm?: MaterialRequestReuseForm | null;
	requestGroupName: string; // The name of all the requests send at the same time
	requestGroupId?: string; // The uuid of all the requests send at the same time
	profileId: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	requestedAt?: string;
	approvedAt?: string;
	deniedAt?: string;
	cancelledAt?: string;
	downloadAvailableAt?: string;
	downloadExpiresAt?: string | null;
	type: Lookup_App_Material_Request_Type_Enum;
	isPending: boolean;
	status: Lookup_App_Material_Request_Status_Enum;
	statusMotivation?: string;
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

	downloadUrl?: string;
	downloadRetries?: number;
	downloadStatus?: Lookup_App_Material_Request_Download_Status_Enum;
	downloadJobId?: string;
}

export type MaterialRequestForDownload = Pick<
	MaterialRequest,
	| 'id'
	| 'type'
	| 'status'
	| 'approvedAt'
	| 'downloadJobId'
	| 'downloadRetries'
	| 'downloadStatus'
	| 'objectId'
	| 'objectRepresentationId'
	| 'updatedAt'
	| 'reuseForm'
>;

export enum MaterialRequestExportQuality {
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
}

export interface MaterialRequestReuseForm {
	thumbnailUrl?: string;
	startTime?: number;
	endTime?: number;
	downloadQuality?: MaterialRequestExportQuality;
	intendedUsageDescription?: string;
	intendedUsage?: string;
	distributionAccess?: string;
	distributionType?: string;
	distributionTypeDigitalOnline?: string;
	distributionTypeOtherExplanation?: string;
	materialEditing?: string;
	geographicalUsage?: string;
	geographicalUsageDescription?: string;
	timeUsageType?: string;
	timeUsageFrom?: string;
	timeUsageTo?: string;
	copyrightDisplay?: string;
}

export interface MaterialRequestMaintainer {
	id: string;
	name: string;
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

export enum MaterialRequestStatus {
	NEW = 'NEW',
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED = 'CANCELLED',
	NONE = 'NONE',
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
	STATUS = 'status',
	REQUEST_GROUP_NAME = 'requestGroupName',
	REQUESTER_FULL_NAME = 'requesterFullName',
	REQUESTER_MAIL = 'requesterMail',
	MAINTAINER_NAME = 'maintainerName',
	NAME = 'objectSchemaName',
}

export type GqlMaterialRequest =
	| FindMaterialRequestsQuery['app_material_requests'][0]
	| FindMaterialRequestsByIdQuery['app_material_requests'][0]
	| UpdateMaterialRequestMutation['update_app_material_requests']['returning'][0];

export type GqlMaterialRequestMaintainer =
	FindMaintainersWithMaterialRequestsQuery['graph_organisations_with_material_requests'][0];
