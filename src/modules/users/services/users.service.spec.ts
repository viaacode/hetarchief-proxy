import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import { GetUserByIdentityIdQuery } from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { mockUserResponse } from '~modules/users/services/__mock__/user.mock';
import { Group, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockUser = mockUserResponse.data.users_profile[0];

const archiefUser: User = {
	id: mockUser.id,
	acceptedTosAt: null,
	email: mockUser.mail,
	firstName: mockUser.first_name,
	lastName: mockUser.last_name,
	fullName: mockUser.full_name,
	groupId: mockUser.group_id,
	groupName: 'VISITOR',
	idp: Idp.HETARCHIEF,
	permissions: [Permission.READ_ALL_VISIT_REQUESTS],
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
			const result = usersService.adapt(mockUserResponse.data.users_profile[0]);
			expect(result).toBeDefined();
			expect(result.email).toBeDefined();
		});
	});

	describe('groupIdToName', () => {
		it('should return group id', () => {
			expect(usersService.groupIdToName(Group.MEEMOO_ADMIN)).toEqual('MEEMOO_ADMIN');
		});

		it('should return null if invalid group id', () => {
			expect(usersService.groupIdToName('invalid' as unknown as Group)).toBeNull();
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
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const user = await usersService.getUserByIdentityId('unknown-id');

			expect(user).toBeNull();
		});
	});

	describe('createUserWithIdp', () => {
		it('should create a user and link an IDP', async () => {
			// Mock insert user
			mockDataService.execute
				.mockReturnValueOnce({
					data: {
						insert_users_profile_one: mockUser,
					},
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
				data: { update_users_profile_by_pk: mockUser },
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
				data: { update_users_profile_by_pk: mockUser },
			});

			const result = await usersService.updateAcceptedTos('123', {
				acceptedTosAt: '2022-02-21T18:00:00',
			});
			expect(result).toEqual(archiefUser);
		});
	});

	describe('linkCpAdminToMaintainer', () => {
		const mockUserProfileId = '30ea39e6-6365-4d7a-a5cc-9055d2a7aa17';
		const mockMaintainerId = 'OR-rf5kf25';

		it('should link a new user (cp admin) to a maintainer', async () => {
			mockDataService.execute
				.mockReturnValueOnce({
					data: {
						maintainer_users_profile: [],
					},
				})
				.mockReturnValueOnce({
					data: {
						insert_maintainer_users_profile_one: {
							id: '87bd1763-3ff0-427e-aabe-0460a6785c34',
						},
					},
				});

			const linked = await usersService.linkUserToMaintainer(
				mockUserProfileId,
				mockMaintainerId
			);

			expect(mockDataService.execute).toBeCalledTimes(2);
			expect(linked).toBeTruthy();
		});

		it('should return false if the user was already linked to the maintainer', async () => {
			mockDataService.execute.mockReturnValueOnce({
				data: {
					maintainer_users_profile: [
						{
							id: '74e56950-0ee9-47ff-b0d6-a525295eeea3',
							maintainer_identifier: mockMaintainerId,
							users_profile_id: mockUserProfileId,
						},
					],
				},
			});

			const linked = await usersService.linkUserToMaintainer(
				mockUserProfileId,
				mockMaintainerId
			);

			expect(mockDataService.execute).toBeCalledTimes(1);
			expect(linked).toBeFalsy();
		});

		it('should delete existing links if a different link already exists, and insert the new link', async () => {
			mockDataService.execute
				.mockReturnValueOnce({
					data: {
						maintainer_users_profile: [
							{
								id: '74e56950-0ee9-47ff-b0d6-a525295eeea3',
								maintainer_identifier: 'OR-different',
								users_profile_id: mockUserProfileId,
							},
						],
					},
				})
				.mockReturnValueOnce({
					data: {
						delete_maintainer_users_profile: {
							affected_rows: 1,
						},
					},
				})
				.mockReturnValueOnce({
					data: {
						insert_maintainer_users_profile_one: {
							id: '87bd1763-3ff0-427e-aabe-0460a6785c34',
						},
					},
				});

			const linked = await usersService.linkUserToMaintainer(
				mockUserProfileId,
				mockMaintainerId
			);

			expect(mockDataService.execute).toBeCalledTimes(3);
			expect(linked).toBeTruthy();
		});

		it('should delete existing links if multiple links already exist, and insert the new link', async () => {
			mockDataService.execute
				.mockReturnValueOnce({
					data: {
						maintainer_users_profile: [
							{
								id: '74e56950-0ee9-47ff-b0d6-a525295eeea3',
								maintainer_identifier: mockMaintainerId,
								users_profile_id: mockUserProfileId,
							},
							{
								id: '74e56950-0ee9-47ff-b0d6-a525295eeea3',
								maintainer_identifier: 'OR-different',
								users_profile_id: mockUserProfileId,
							},
						],
					},
				})
				.mockReturnValueOnce({
					data: {
						delete_maintainer_users_profile: {
							affected_rows: 2,
						},
					},
				})
				.mockReturnValueOnce({
					data: {
						insert_maintainer_users_profile_one: {
							id: '87bd1763-3ff0-427e-aabe-0460a6785c34',
						},
					},
				});

			const linked = await usersService.linkUserToMaintainer(
				mockUserProfileId,
				mockMaintainerId
			);

			expect(mockDataService.execute).toBeCalledTimes(3);
			expect(linked).toBeTruthy();
		});

		it('should log an error if errors occur during deletion of links', async () => {
			mockDataService.execute
				.mockReturnValueOnce({
					data: {
						maintainer_users_profile: [
							{
								id: '74e56950-0ee9-47ff-b0d6-a525295eeea3',
								maintainer_identifier: mockMaintainerId,
								users_profile_id: mockUserProfileId,
							},
							{
								id: '74e56950-0ee9-47ff-b0d6-a525295eeea3',
								maintainer_identifier: 'OR-different',
								users_profile_id: mockUserProfileId,
							},
						],
					},
				})
				.mockReturnValueOnce({
					error: ['some serious error'],
				})
				.mockReturnValueOnce({
					data: {
						insert_maintainer_users_profile_one: {
							id: '87bd1763-3ff0-427e-aabe-0460a6785c34',
						},
					},
				});

			const linked = await usersService.linkUserToMaintainer(
				mockUserProfileId,
				mockMaintainerId
			);

			expect(mockDataService.execute).toBeCalledTimes(3);
			expect(linked).toBeTruthy();
		});
	});

	describe('updateLastAccessDate', () => {
		it('should update a users last access date', async () => {
			mockDataService.execute.mockReturnValueOnce({
				data: {
					update_users_profile: {
						affected_rows: 1,
					},
				},
			});

			const response = await usersService.updateLastAccessDate('user-123');
			expect(response).toEqual({ affectedRows: 1 });
		});

		it('should catch and not throw an error', async () => {
			mockDataService.execute.mockReturnValueOnce({
				data: {
					errors: 'Something went wrong',
				},
			});

			const response = await usersService.updateLastAccessDate('user-123');
			expect(response).toBeUndefined();
		});
	});
});
