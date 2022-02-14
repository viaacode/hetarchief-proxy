import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import { Idp } from '~modules/auth/types';
import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
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
				data: { users_profile: [{ id: '123' }] },
			});

			const result = await usersService.getUserByIdentityId('123');
			expect(result).toEqual({ id: '123' });
		});
	});

	describe('createUserWithIdp', () => {
		it('should create a user and link an IDP', async () => {
			// Mock insert user
			mockDataService.execute
				.mockReturnValueOnce({
					data: { insert_users_profile_one: { id: '123' } },
				})
				.mockReturnValueOnce({}); // insert idp

			const result = await usersService.createUserWithIdp(
				{ firstName: 'Tom', lastName: 'Testerom', email: 'test@studiohypderdrive.be' },
				Idp.HETARCHIEF,
				'idp-1'
			);
			expect(result).toEqual({ id: '123' });
		});
	});

	describe('udpateUser', () => {
		it('should update a user', async () => {
			// Mock insert user
			mockDataService.execute.mockReturnValueOnce({
				data: { update_users_profile_by_pk: { id: '123' } },
			});

			const result = await usersService.updateUser('123', {
				firstName: 'Tom',
				lastName: 'Testerom',
				email: 'test@studiohypderdrive.be',
			});
			expect(result).toEqual({ id: '123' });
		});
	});
});
