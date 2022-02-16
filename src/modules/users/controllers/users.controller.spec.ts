import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../services/users.service';

import { UsersController } from './users.controller';

const mockUserResponse = {
	id: '123',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohypderdrive.be',
	acceptedTos: true,
};

const mockUsersService = {
	updateAcceptedTos: jest.fn(),
};

describe('UsersController', () => {
	let usersController: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			imports: [],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		}).compile();

		usersController = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(usersController).toBeDefined();
	});

	describe('updateTos', () => {
		it('should update if the user accepted the terms of service', async () => {
			mockUsersService.updateAcceptedTos.mockResolvedValueOnce(mockUserResponse);
			const user = await usersController.updateTos('1', { acceptedTos: true });
			expect(user).toEqual(mockUserResponse);
		});
	});
});
