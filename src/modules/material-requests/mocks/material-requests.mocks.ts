import { GqlMaterialRequest, MaterialRequest } from '../material-requests.types';

import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

export const mockUserProfileId = 'eccf3357-bc87-42e4-a91c-5a0ba8cb550a';

export const mockMaterialRequest: GqlMaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	object_schema_identifier: 'identifier',
	profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
};

const mockMaterialRequest1: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-03-18T08:32:57.256264',
	updatedAt: '2022-03-18T08:32:57.256264',
};

const mockMaterialRequest2: MaterialRequest = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	objectSchemaIdentifier: 'identifier',
	profileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	reason: 'voor mijn onderzoek en studie',
	createdAt: '2022-02-18T08:32:57.256264',
	updatedAt: '2022-02-18T08:32:57.256264',
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
