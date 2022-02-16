import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import { Idp } from '~modules/auth/types';
import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

const graphQlUserResponse = {
	id: '123',
	first_name: 'Tom',
	last_name: 'Testerom',
	mail: 'test@studiohypderdrive.be',
	accepted_tos: true,
};

const archiefUser = {
	id: '123',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohypderdrive.be',
	acceptedTos: true,
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
			let error;
			try {
				await usersService.getUserByIdentityId('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				message: 'Not Found',
				statusCode: 404,
			});
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
				acceptedTos: true,
			});
			expect(result).toEqual(archiefUser);
		});
	});
});
