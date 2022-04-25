import { Test, TestingModule } from '@nestjs/testing';

import { NavigationsController } from './navigations.controller';

import { NavigationsService } from '~modules/navigations/services/navigations.service';

const mockNavigationsResponse = {
	items: [
		{
			id: 'navigation-1',
		},
		{
			id: 'navigation-2',
		},
	],
};

const mockNavigationsService: Partial<Record<keyof NavigationsService, jest.SpyInstance>> = {
	getNavigationElementsForUser: jest.fn(),
};

describe('NavigationsController', () => {
	let navigationsController: NavigationsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NavigationsController],
			imports: [],
			providers: [
				{
					provide: NavigationsService,
					useValue: mockNavigationsService,
				},
			],
		}).compile();

		navigationsController = module.get<NavigationsController>(NavigationsController);
	});

	it('should be defined', () => {
		expect(navigationsController).toBeDefined();
	});

	describe('getNavigationElementsForUser', () => {
		it('should return all navigation items for the user (session)', async () => {
			mockNavigationsService.getNavigationElementsForUser.mockResolvedValueOnce(
				mockNavigationsResponse
			);
			const navigations = await navigationsController.getNavigationElementsForUser({});
			expect(navigations).toEqual(mockNavigationsResponse);
		});
	});
});
