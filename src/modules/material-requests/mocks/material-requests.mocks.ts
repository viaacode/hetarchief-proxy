import {
	GqlMaterialRequest,
	MaterialRequest,
	MaterialRequestTypes,
} from '../material-requests.types';

import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

export const mockUserProfileId = 'eccf3357-bc87-42e4-a91c-5a0ba8cb550a';

export const mockMaterialRequest: GqlMaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	object_schema_identifier:
		'8d4850ac51b74516aa50dc2cbed0bd20fc05e3b9ac9b471494cc93e0308156cf09ec8a302aed4adba7373d04be42d285',
	profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	type: MaterialRequestTypes.REUSE as any,
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
	},
};

export const mockMaterialRequest1: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-03-18T08:32:57.256264',
	updatedAt: '2022-03-18T08:32:57.256264',
	type: MaterialRequestTypes.REUSE,
	requesterName: 'Ilya Korsakov',
	requesterMail: 'ilya.korsakov@example.com',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
};

const mockMaterialRequest2: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-02-18T08:32:57.256264',
	updatedAt: '2022-02-18T08:32:57.256264',
	type: MaterialRequestTypes.MORE_INFO,
	requesterName: 'Marie Odhiambo',
	requesterMail: 'marie.odhiambo@example.com',
	maintainerId: 'OR-154dn75',
	maintainerName: 'Amsab-ISG',
	maintainerSlug: 'amsab-isg',
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
};
