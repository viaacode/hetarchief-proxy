import { Test, TestingModule } from '@nestjs/testing';

import { UserGroupsService } from '../services/user-groups.service';

import { UserGroupsController } from './user-groups.controller';

const mockUserGroupsService: Partial<Record<keyof UserGroupsService, jest.SpyInstance>> = {
	getUserGroups: jest.fn(),
};

const mockUserGroupsResponse = [
	{
		name: 'CP_ADMIN',
		permissions: [
			{
				id: '2dd3ec17-5439-4fc7-aa6c-cc8dfd3b937f',
				label: 'Bezoekersruimtes: Alle bezoekersruimtes bekijken',
				name: 'READ_ALL_SPACES',
				description:
					'Deze gebruiker kan de alle bezoekersruimtes bekijken, inclusief inactieve',
			},
		],
	},
];

describe('UserGroupsController', () => {
	let userGroupsController: UserGroupsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserGroupsController],
			imports: [],
			providers: [
				{
					provide: UserGroupsService,
					useValue: mockUserGroupsService,
				},
			],
		}).compile();

		userGroupsController = module.get<UserGroupsController>(UserGroupsController);
	});

	it('should be defined', () => {
		expect(userGroupsController).toBeDefined();
	});

	describe('getUserGroups', () => {
		it('should return the userGroups', async () => {
			mockUserGroupsService.getUserGroups.mockResolvedValueOnce(mockUserGroupsResponse);

			const permissions = await userGroupsController.getUserGroups();

			expect(permissions).toEqual(mockUserGroupsResponse);
		});
	});
});
