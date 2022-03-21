import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import { DataService } from '~modules/data/services/data.service';
import { Idp } from '~shared/auth/auth.types';

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
	group: {
		permissions: [
			{
				permission: {
					name: 'CREATE_COLLECTION',
				},
			},
		],
	},
};

const archiefUser = {
	id: '123',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohypderdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	permissions: ['CREATE_COLLECTION'],
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
		}).compile();

		usersService = module.get<UsersService>(UsersService);
	});

	it('services should be defined', () => {
		expect(usersService).toBeDefined();
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
				{ firstName: 'Tom', lastName: 'Testerom', email: 'test@studiohypderdrive.be' },
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
