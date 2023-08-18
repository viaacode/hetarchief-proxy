import { DataService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import {
	GetUserByIdentityIdQuery,
	InsertUserMutation,
	UpdateUserLastAccessDateMutation,
	UpdateUserProfileMutation,
} from '~generated/graphql-db-types-hetarchief';
import { mockUserResponse } from '~modules/users/services/__mock__/user.mock';
import { GroupId, GroupName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockUser = mockUserResponse.users_profile[0];

const archiefUser: User = {
	id: mockUser.id,
	acceptedTosAt: null,
	email: mockUser.mail,
	firstName: mockUser.first_name,
	lastName: mockUser.last_name,
	fullName: mockUser.full_name,
	groupId: mockUser.group_id,
	groupName: GroupName.VISITOR,
	idp: Idp.HETARCHIEF,
	permissions: [Permission.READ_ALL_VISIT_REQUESTS],
	isKeyUser: true,
	lastAccessAt: null,
	createdAt: null,
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

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt an empty user', () => {
			const result = usersService.adapt(null);
			expect(result).toBeNull();
		});

		it('can adapt a user object', () => {
			const result = usersService.adapt(mockUserResponse.users_profile[0]);
			expect(result).toBeDefined();
			expect(result.email).toBeDefined();
		});
	});

	describe('groupIdToName', () => {
		it('should return group id', () => {
			expect(usersService.groupIdToName(GroupId.MEEMOO_ADMIN)).toEqual('MEEMOO_ADMIN');
		});

		it('should return null if invalid group id', () => {
			expect(usersService.groupIdToName('invalid' as unknown as GroupId)).toBeNull();
		});
	});

	describe('getUserByIdentityId', () => {
		it('should get a user by identity id', async () => {
			//data.users_profile[0]
			mockDataService.execute.mockReturnValueOnce(mockUserResponse);

			const result = await usersService.getUserByIdentityId('123');
			expect(result).toEqual(archiefUser);
		});

		it('throws a notfoundexception if the user was not found', async () => {
			const mockData: GetUserByIdentityIdQuery = {
				users_profile: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const user = await usersService.getUserByIdentityId('unknown-id');

			expect(user).toBeNull();
		});
	});

	describe('createUserWithIdp', () => {
		it('should create a user and link an IDP', async () => {
			// Mock insert user
			mockDataService.execute
				.mockReturnValueOnce({
					insert_users_profile_one: mockUser,
				} as InsertUserMutation)
				.mockReturnValueOnce({}); // insert idp

			const result = await usersService.createUserWithIdp(
				{
					firstName: 'Tom',
					lastName: 'Testerom',
					email: 'test@studiohypderdrive.be',
					groupId: GroupId.CP_ADMIN,
					isKeyUser: false,
					organisationId: 'test',
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
				update_users_profile: { returning: [mockUser] },
			} as UpdateUserProfileMutation);

			const result = await usersService.updateUser('123', {
				firstName: 'Tom',
				lastName: 'Testerom',
				email: 'test@studiohypderdrive.be',
				groupId: GroupId.CP_ADMIN,
				isKeyUser: false,
				organisationId: 'test',
			});
			expect(result).toEqual(archiefUser);
		});
	});

	describe('updateAcceptedTos', () => {
		it('should update if a user accepted the terms of service', async () => {
			mockDataService.execute.mockReturnValueOnce({
				update_users_profile: { returning: [mockUser] },
			} as UpdateUserProfileMutation);

			const result = await usersService.updateAcceptedTos('123', {
				acceptedTosAt: '2022-02-21T18:00:00',
			});
			expect(result).toEqual(archiefUser);
		});

		it('should throw a not found exception when the id is not of a existing user', async () => {
			mockDataService.execute.mockReturnValueOnce({
				update_users_profile: { returning: [] },
			});

			try {
				await usersService.updateAcceptedTos('invalidId', {
					acceptedTosAt: '2022-02-21T18:00:00',
				});
			} catch (err) {
				expect(err.message).toEqual('User with id "invalidId" was not found');
				expect(err.name).toEqual('NotFoundException');
			}
		});
	});

	describe('updateLastAccessDate', () => {
		it('should update a users last access date', async () => {
			mockDataService.execute.mockReturnValueOnce({
				update_users_profile: {
					affected_rows: 1,
				},
			} as UpdateUserLastAccessDateMutation);

			const response = await usersService.updateLastAccessDate('user-123');
			expect(response).toEqual({ affectedRows: 1 });
		});

		it('should catch and not throw an error', async () => {
			mockDataService.execute.mockReturnValueOnce({
				errors: 'Something went wrong',
			} as UpdateUserLastAccessDateMutation);

			const response = await usersService.updateLastAccessDate('user-123');
			expect(response).toBeUndefined();
		});
	});
});
