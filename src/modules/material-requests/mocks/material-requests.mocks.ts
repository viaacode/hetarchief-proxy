import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';

import { type MaterialRequest, MaterialRequestType } from '../material-requests.types';

import {
	type FindMaintainersWithMaterialRequestsQuery,
	type FindMaterialRequestsByIdQuery,
	type FindMaterialRequestsQuery,
	Lookup_App_Material_Request_Requester_Capacity_Enum,
	Lookup_App_Material_Request_Status_Enum,
	Lookup_App_Material_Request_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { IeObjectType } from '~modules/ie-objects/ie-objects.types';
import { representationMp3 } from '~modules/ie-objects/services/ie-objects.service.mocks';
import { GroupId, GroupName, type User } from '~modules/users/types';
import { Locale } from '~shared/types/types';

export const mockUserProfileId = 'eccf3357-bc87-42e4-a91c-5a0ba8cb550a';

export const mockGqlMaterialRequest1: FindMaterialRequestsQuery['app_material_requests'][0] = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	ie_object_id: 'https://data-int.hetarchief.be/id/entity/0000003g0k',
	profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	type: MaterialRequestType.REUSE as any,
	is_pending: true,
	status: Lookup_App_Material_Request_Status_Enum.None as any,
	organisation: null,
	requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education as any,
	download_status: null,
	requested_by: {
		id: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
		full_name: 'Ilya Korsakov',
		mail: 'ilya.korsakov@example.com',
		language: Locale.Nl,
	},
	intellectualEntity: {
		schemaMaintainer: {
			org_identifier: 'OR-rf5kf25',
			skos_pref_label: 'VRT',
			ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
			schemaContactPoint: [],
			skos_alt_label: 'vrt',
			visitorSpace: {
				slug: 'vrt',
			},
		},
		schema_identifier: '0000003g0k',
		id: 'https://data-int.hetarchief.be/id/entity/0000003g0k',
		schema_name: '',
		premisIdentifier: [],
		dctermsFormat: [
			{
				dcterms_format: 'video',
			},
		],
		schemaThumbnail: {
			schema_thumbnail_url:
				'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
		},
	},
	material_request_reuse_form_values: null,
};

export const mockGqlMaterialRequest2: FindMaterialRequestsByIdQuery['app_material_requests'][0] = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	ie_object_id: 'https://data-int.hetarchief.be/id/entity/0000003g0k',
	profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	type: MaterialRequestType.REUSE as any,
	is_pending: true,
	status: Lookup_App_Material_Request_Status_Enum.None as any,
	organisation: null,
	requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education as any,
	requested_by: {
		id: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
		full_name: 'Ilya Korsakov',
		mail: 'ilya.korsakov@example.com',
		language: Locale.Nl,
		group: {
			name: 'VISITOR',
			label: 'Gebruiker',
			description: 'Een geregistreerde gebruiker.',
			id: '0213c8d4-f459-45ef-8bbc-96268ab56d01',
		},
	},
	intellectualEntity: {
		schemaMaintainer: {
			org_identifier: 'OR-rf5kf25',
			skos_pref_label: 'VRT',
			ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
			visitorSpace: {
				slug: 'vrt',
			},
			schemaContactPoint: [],
		},
		schema_identifier: '0000003g0k',
		id: 'https://data-int.hetarchief.be/id/entity/0000003g0k',
		schema_name: 'STIHL: SV DUBLIN ZOO/STIHL zoo na',
		premisIdentifier: [],
		dctermsFormat: [
			{
				dcterms_format: 'audio',
			},
		],
		schemaThumbnail: {
			schema_thumbnail_url: [
				'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
			],
		},
	},
	material_request_reuse_form_values: [
		{
			key: 'representationId',
			value: 'https://data-int.hetarchief.be/id/entity/600ca4a485e3ddc2cb4aaa70f1b25036',
		},
		{ key: 'startTime', value: undefined },
		{ key: 'endTime', value: '2000' },
		{ key: 'downloadQuality', value: 'NORMAL' },
		{ key: 'intendedUsage', value: 'INTERN' },
		{ key: 'intendedUsageDescription', value: 'Some custom text' },
		{ key: 'distributionAccess', value: 'INTERN' },
		{ key: 'distributionType', value: 'DIGITAL_OFFLINE' },
		{ key: 'materialEditing', value: 'NONE' },
		{ key: 'geographicalUsage', value: 'COMPLETELY_LOCAL' },
		{ key: 'timeUsageType', value: 'UNLIMITED' },
		{ key: 'copyrightDisplay', value: 'SAME_TIME_WITH_OBJECT' },
	],
};

export const mockMaterialRequest1: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectId: 'https://data-int.hetarchief.be/id/entity/0000003g0k',
	objectSchemaIdentifier: '0000003g0k',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-03-18T08:32:57.256264',
	updatedAt: '2022-03-18T08:32:57.256264',
	requestedAt: undefined,
	approvedAt: undefined,
	deniedAt: undefined,
	cancelledAt: undefined,
	type: Lookup_App_Material_Request_Type_Enum.Reuse,
	isPending: true,
	status: Lookup_App_Material_Request_Status_Enum.None as any,
	requesterOrganisation: null,
	requesterOrganisationSector: null,
	requesterCapacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education,
	requesterId: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
	requesterFullName: 'Ilya Korsakov',
	requesterMail: 'ilya.korsakov@example.com',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'VRT',
	maintainerSlug: 'vrt',
	objectSchemaName: 'Onderzoekscommissie PFAS-PFOS 03-12-2021, 08u5§',
	objectDctermsFormat: IeObjectType.AUDIO,
	objectThumbnailUrl:
		'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
	objectAccessThrough: [],
	objectLicences: [],
	reuseForm: undefined,
	objectRepresentation: representationMp3,
	requestGroupName: null,
	downloadStatus: null,
	downloadAvailableAt: undefined,
	downloadExpiresAt: undefined,
};

const mockMaterialRequest2: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectId: 'https://data-int.hetarchief.be/id/entity/0000003g0k',
	objectSchemaIdentifier: '0000003g0k',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-02-18T08:32:57.256264',
	updatedAt: '2022-02-18T08:32:57.256264',
	requestedAt: undefined,
	approvedAt: undefined,
	deniedAt: undefined,
	cancelledAt: undefined,
	type: Lookup_App_Material_Request_Type_Enum.MoreInfo,
	isPending: true,
	status: Lookup_App_Material_Request_Status_Enum.None as any,
	requesterOrganisation: null,
	requesterOrganisationSector: null,
	requesterCapacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education,
	requesterId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	requesterFullName: 'Marie Odhiambo',
	requesterMail: 'marie.odhiambo@example.com',
	requesterUserGroupName: 'VISITOR',
	requesterUserGroupLabel: 'Gebruiker',
	requesterUserGroupDescription: 'Een geregistreerde gebruiker.',
	requesterUserGroupId: '0213c8d4-f459-45ef-8bbc-96268ab56d01',
	maintainerId: 'OR-7h1dk9t',
	maintainerName: 'Vlaams Parlement',
	maintainerLogo: 'https://assets.viaa.be/images/OR-7h1dk9t',
	maintainerSlug: 'vlaams-parlement',
	objectSchemaName: 'Onderzoekscommissie PFAS-PFOS 03-12-2021, 08u5§',
	objectDctermsFormat: IeObjectType.AUDIO,
	objectThumbnailUrl:
		'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
	objectAccessThrough: [],
	objectLicences: [],
	objectRepresentation: representationMp3,
	requestGroupName: null,
	downloadStatus: null,
	downloadAvailableAt: undefined,
	downloadExpiresAt: undefined,
};

export const mockMaterialRequestsResponse = {
	items: [mockMaterialRequest1, mockMaterialRequest2],
};

export const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [PermissionName.MANAGE_ALL_VISIT_REQUESTS, PermissionName.CREATE_VISIT_REQUEST],
	idp: AvoAuthIdpType.HETARCHIEF,
	isKeyUser: false,
	isEvaluator: false,
};

export const mockGqlMaintainers: FindMaintainersWithMaterialRequestsQuery['graph_organisations_with_material_requests'][0] =
	{
		org_identifier: 'OR-rf5kf25',
		skos_pref_label: 'VRT',
	};

export const mockMaintainerWithMaterialRequest = [
	{
		id: 'OR-rf5kf25',
		name: 'VRT',
	},
];
