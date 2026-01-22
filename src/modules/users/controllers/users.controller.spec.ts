import { DataService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersService } from '../services/users.service';

import { UsersController } from './users.controller';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
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
	updateAcceptedTos: vi.fn(),
};

const mockDataService = {
	execute: vi.fn(),
};

const mockCampaignMonitorService = {
	updateNewsletterPreferences: vi.fn(),
};

describe('UsersController', () => {
	let usersController: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: CampaignMonitorService,
					useValue: mockCampaignMonitorService,
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
			mockDataService.execute.mockResolvedValueOnce({
				update_users_profile: {
					returning: [mockUserResponse],
				},
			});

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
