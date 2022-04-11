import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import { DataService } from '~modules/data/services/data.service';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const graphQlUserResponse = {
	id: '123',
	full_name: 'Tom Testerom',
	first_name: 'Tom',
	last_name: 'Testerom',
	mail: 'test@studiohypderdrive.be',
	accepted_tos_at: '2022-02-21T14:00:00',
	group_id: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
	group: {
		permissions: [
			{
				permission: {
					name: Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
				},
			},
		],
	},
	identities: [
		{
			identity_provider_name: Idp.HETARCHIEF,
		},
	],
};

const archiefUser: User = {
	id: '123',
	firstName: 'Tom',
	lastName: 'Testerom',
	fullName: 'Tom Testerom',
	idp: Idp.HETARCHIEF,
	email: 'test@studiohypderdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS],
};

describe('UsersService', () => {
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		usersService = module.get<UsersService>(UsersService);
	});

	it('services should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt an empty user', () => {
			const result = usersService.adapt(null);
			expect(result).toBeNull();
		});
	});

	describe('getUserByIdentityId', () => {
		it('should get a user by identity id', async () => {
			//data.users_profile[0]
			mockDataService.execute.mockReturnValueOnce({
				data: { users_profile: [graphQlUserResponse] },
			});

			const result = await usersService.getUserByIdentityId('123');
			expect(result).toEqual(archiefUser);
		});

		it('throws a notfoundexception if the user was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					users_profile: [],
				},
			});

			const user = await usersService.getUserByIdentityId('unknown-id');

			expect(user).toBeNull();
		});
	});

	describe('createUserWithIdp', () => {
		it('should create a user and link an IDP', async () => {
			// Mock insert user
			mockDataService.execute
				.mockReturnValueOnce({
					data: { insert_users_profile_one: graphQlUserResponse },
				})
				.mockReturnValueOnce({}); // insert idp

			const result = await usersService.createUserWithIdp(
				{
					firstName: 'Tom',
					lastName: 'Testerom',
					email: 'test@studiohypderdrive.be',
					groupId: Group.CP_ADMIN,
				},
				Idp.HETARCHIEF,
				'idp-1'
			);
			expect(result).toEqual(archiefUser);
		});
	});

	describe('updateUser', () => {
		it('should update a user', async () => {
			// Mock insert user
			mockDataService.execute.mockReturnValueOnce({
				data: { update_users_profile_by_pk: graphQlUserResponse },
			});

			const result = await usersService.updateUser('123', {
				firstName: 'Tom',
				lastName: 'Testerom',
				email: 'test@studiohypderdrive.be',
				groupId: Group.CP_ADMIN,
			});
			expect(result).toEqual(archiefUser);
		});
	});

	describe('updateAcceptedTos', () => {
		it('should update if a user accepted the terms of service', async () => {
			mockDataService.execute.mockReturnValueOnce({
				data: { update_users_profile_by_pk: graphQlUserResponse },
			});

			const result = await usersService.updateAcceptedTos('123', {
				acceptedTosAt: '2022-02-21T18:00:00',
			});
			expect(result).toEqual(archiefUser);
		});
	});
});
