import { Test, TestingModule } from '@nestjs/testing';

import { UserGroupsService } from './user-groups.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

const mockUserGroupsResponse = {
	data: {
		users_group: [
			{
				name: 'CP_ADMIN',
				permissions: [
					{
						permission: {
							id: '2dd3ec17-5439-4fc7-aa6c-cc8dfd3b937f',
							label: 'Bezoekersruimtes: Alle bezoekersruimtes bekijken',
							name: 'READ_ALL_SPACES',
							description:
								'Deze gebruiker kan de alle bezoekersruimtes bekijken, inclusief inactieve',
						},
					},
				],
			},
		],
	},
};

describe('UserGroupsService', () => {
	let userGroupsService: UserGroupsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserGroupsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		userGroupsService = module.get<UserGroupsService>(UserGroupsService);
	});

	it('services should be defined', () => {
		expect(userGroupsService).toBeDefined();
	});

	describe('getUserGroups', () => {
		it('returns user groups', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockUserGroupsResponse);

			const response = await userGroupsService.getUserGroups();
			expect(response.length).toBe(1);
			expect(response[0].name).toEqual('CP_ADMIN');
			expect(response[0].permissions.length).toBe(1);
			expect(response[0].permissions[0].name).toBe('READ_ALL_SPACES');
		});
	});
});
