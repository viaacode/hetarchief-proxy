import {
	MaterialRequest,
	MaterialRequestRequesterCapacity,
	MaterialRequestType,
} from '../material-requests.types';

import {
	FindMaintainersWithMaterialRequestsQuery,
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { MediaFormat } from '~modules/ie-objects/ie-objects.types';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

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
	requester_capacity: MaterialRequestRequesterCapacity.EDUCATION as any,
	requested_by: {
		id: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
		full_name: 'Ilya Korsakov',
		mail: 'ilya.korsakov@example.com',
	},
	object: {
		maintainer: {
			schema_identifier: 'OR-rf5kf25',
			schema_name: 'VRT',
			visitor_space: {
				slug: 'vrt',
			},
		},
		meemoo_identifier: '',
		schema_name: '',
		dcterms_format: '',
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
	requester_capacity: MaterialRequestRequesterCapacity.EDUCATION as any,
	requested_by: {
		id: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
		full_name: 'Ilya Korsakov',
		mail: 'ilya.korsakov@example.com',
		group: {
			name: 'VISITOR',
			label: 'Gebruiker',
			description: 'Een geregistreerde gebruiker.',
			id: '0213c8d4-f459-45ef-8bbc-96268ab56d01',
		},
	},
	object: {
		maintainer: {
			schema_identifier: 'OR-rf5kf25',
			schema_name: 'VRT',
			information: {
				logo: {
					iri: 'https://assets.viaa.be/images/OR-rf5kf25',
				},
			},
			visitor_space: {
				slug: 'vrt',
			},
		},
		meemoo_identifier: 'q23qv3wp5b',
		schema_name: 'STIHL: SV DUBLIN ZOO/STIHL zoo na',
		dcterms_format: 'audio',
	},
};

export const mockMaterialRequest1: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-03-18T08:32:57.256264',
	updatedAt: '2022-03-18T08:32:57.256264',
	type: MaterialRequestType.REUSE,
	isPending: true,
	organisation: null,
	requesterCapacity: MaterialRequestRequesterCapacity.EDUCATION,
	requesterId: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
	requesterFullName: 'Ilya Korsakov',
	requesterMail: 'ilya.korsakov@example.com',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'VRT',
	maintainerSlug: 'vrt',
	objectSchemaName: 'Onderzoekscommissie PFAS-PFOS 03-12-2021, 08u5§',
	objectMeemooIdentifier: 'q23qv3wp5b',
	objectType: MediaFormat.AUDIO,
	objectDctermsFormat: 'video',
};

const mockMaterialRequest2: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-02-18T08:32:57.256264',
	updatedAt: '2022-02-18T08:32:57.256264',
	type: MaterialRequestType.MORE_INFO,
	isPending: true,
	organisation: null,
	requesterCapacity: MaterialRequestRequesterCapacity.EDUCATION,
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
	objectMeemooIdentifier: 'q23qv3wp5b',
	objectType: MediaFormat.AUDIO,
	objectDctermsFormat: 'video',
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
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_ALL_VISIT_REQUESTS, Permission.CREATE_VISIT_REQUEST],
	idp: Idp.HETARCHIEF,
	isKeyUser: false,
};

export const mockGqlMaintainers: FindMaintainersWithMaterialRequestsQuery['maintainer_content_partners_with_material_requests'][0] =
	{
		schema_identifier: 'OR-rf5kf25',
		schema_name: 'VRT',
	};

export const mockMaintainerWithMaterialRequest = [
	{
		id: 'OR-rf5kf25',
		name: 'VRT',
	},
];
