import { Test, TestingModule } from '@nestjs/testing';

import { PermissionsService } from './permissions.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

const mockPermissionsResponse = {
	data: {
		users_permission: [
			{
				id: '2dd3ec17-5439-4fc7-aa6c-cc8dfd3b937f',
				label: 'Bezoekersruimtes: Alle bezoekersruimtes bekijken',
				name: 'READ_ALL_SPACES',
				description:
					'Deze gebruiker kan de alle bezoekersruimtes bekijken, inclusief inactieve',
			},
		],
	},
};

describe('PermissionsService', () => {
	let permissionsService: PermissionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PermissionsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		permissionsService = module.get<PermissionsService>(PermissionsService);
	});

	it('services should be defined', () => {
		expect(permissionsService).toBeDefined();
	});

	describe('getPermissions', () => {
		it('returns permissions', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockPermissionsResponse);

			const response = await permissionsService.getPermissions();
			expect(response).toEqual(mockPermissionsResponse.data.users_permission);
		});
	});
});
