import { Test, type TestingModule } from '@nestjs/testing';

import { UsersService } from '../services/users.service';

import { UsersController } from './users.controller';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { TestingLogger } from '~shared/logging/test-logger';

const mockUserResponse = {
	id: '123',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohypderdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
};

const getNewMockSession = () => ({
	archiefUserInfo: {},
});

const mockUsersService = {
	updateAcceptedTos: jest.fn(),
};

describe('UsersController', () => {
	let usersController: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			imports: [CampaignMonitorModule],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		usersController = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(usersController).toBeDefined();
	});

	describe('updateTos', () => {
		it('should update if the user accepted the terms of service', async () => {
			mockUsersService.updateAcceptedTos.mockResolvedValueOnce(mockUserResponse);
			const user = await usersController.updateTos(
				{
					acceptedTosAt: '2022-02-21T14:00:00',
				},
				'1',
				getNewMockSession()
			);
			expect(user).toEqual(mockUserResponse);
		});
	});
});
