import { type MaterialRequest, MaterialRequestType } from '../material-requests.types';

import {
	type FindMaintainersWithMaterialRequestsQuery,
	type FindMaterialRequestsByIdQuery,
	type FindMaterialRequestsQuery,
	Lookup_App_Material_Request_Requester_Capacity_Enum,
	Lookup_App_Material_Request_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { MediaFormat } from '~modules/ie-objects/ie-objects.types';
import { GroupId, GroupName, Permission, type User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { Locale } from '~shared/types/types';

export const mockUserProfileId = 'eccf3357-bc87-42e4-a91c-5a0ba8cb550a';

export const mockGqlMaterialRequest1: FindMaterialRequestsQuery['app_material_requests'][0] = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	object_schema_identifier:
		'8d4850ac51b74516aa50dc2cbed0bd20fc05e3b9ac9b471494cc93e0308156cf09ec8a302aed4adba7373d04be42d285',
	profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	type: MaterialRequestType.REUSE as any,
	is_pending: true,
	organisation: null,
	requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education as any,
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
		schema_name: '',
		dcterms_format: '',
		schema_thumbnail_url: [
			'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
		],
	},
};

export const mockGqlMaterialRequest2: FindMaterialRequestsByIdQuery['app_material_requests'][0] = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	object_schema_identifier:
		'8d4850ac51b74516aa50dc2cbed0bd20fc05e3b9ac9b471494cc93e0308156cf09ec8a302aed4adba7373d04be42d285',
	profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	type: MaterialRequestType.REUSE as any,
	is_pending: true,
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
		},
		schema_identifier: '0000003g0k',
		schema_name: 'STIHL: SV DUBLIN ZOO/STIHL zoo na',
		dcterms_format: 'audio',
		schema_thumbnail_url: [
			'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
		],
	},
};

export const mockMaterialRequest1: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-03-18T08:32:57.256264',
	updatedAt: '2022-03-18T08:32:57.256264',
	type: Lookup_App_Material_Request_Type_Enum.Reuse,
	isPending: true,
	organisation: null,
	requesterCapacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education,
	requesterId: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
	requesterFullName: 'Ilya Korsakov',
	requesterMail: 'ilya.korsakov@example.com',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'VRT',
	maintainerSlug: 'vrt',
	objectSchemaName: 'Onderzoekscommissie PFAS-PFOS 03-12-2021, 08u5§',
	objectDctermsFormat: MediaFormat.AUDIO,
	objectThumbnailUrl:
		'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
};

const mockMaterialRequest2: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-02-18T08:32:57.256264',
	updatedAt: '2022-02-18T08:32:57.256264',
	type: Lookup_App_Material_Request_Type_Enum.MoreInfo,
	isPending: true,
	organisation: null,
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
	objectDctermsFormat: MediaFormat.AUDIO,
	objectThumbnailUrl:
		'VRT/b1f60efadf5243d78c7c91512adaa6cefe52723ff35848268894c7861d852b79/keyframes/keyframes_1_1/keyframe1.jpg',
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
	permissions: [Permission.MANAGE_ALL_VISIT_REQUESTS, Permission.CREATE_VISIT_REQUEST],
	idp: Idp.HETARCHIEF,
	isKeyUser: false,
};

export const mockGqlMaintainers: FindMaintainersWithMaterialRequestsQuery['maintainer_organisations_with_material_requests'][0] =
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
