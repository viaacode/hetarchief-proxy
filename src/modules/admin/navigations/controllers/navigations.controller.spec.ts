import { Test, TestingModule } from '@nestjs/testing';

import { NavigationsService } from '../services/navigations.service';

import { NavigationsController } from './navigations.controller';

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

const mockNavigationsService = {
	findAll: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
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

	describe('getNavigations', () => {
		it('should return all navigations', async () => {
			mockNavigationsService.findAll.mockResolvedValueOnce(mockNavigationsResponse);
			const navigations = await navigationsController.getNavigations({});
			expect(navigations).toEqual(mockNavigationsResponse);
		});
	});

	describe('getNavigation', () => {
		it('should return a navigation by id', async () => {
			mockNavigationsService.findById.mockResolvedValueOnce(mockNavigationsResponse.items[0]);
			const navigations = await navigationsController.getNavigation('navigation-1');
			expect(navigations).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('createNavigation', () => {
		it('should create a new navigation', async () => {
			mockNavigationsService.create.mockResolvedValueOnce(mockNavigationsResponse.items[0]);
			const navigation = await navigationsController.createNavigation({
				label: 'test-create-nav',
				icon_name: '',
				placement: 'footer-links',
				position: 1,
			});
			expect(navigation).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('updateNavigation', () => {
		it('should update a navigation', async () => {
			mockNavigationsService.update.mockResolvedValueOnce(mockNavigationsResponse.items[0]);
			const navigation = await navigationsController.updateNavigation('navigation-1', {
				label: 'test-create-nav',
				icon_name: '',
				placement: 'footer-links',
				position: 1,
			});
			expect(navigation).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('deleteNavigation', () => {
		it('should delete a navigation', async () => {
			mockNavigationsService.delete.mockResolvedValueOnce({ affectedRows: 1 });
			const navigation = await navigationsController.deleteNavigation('navigation-1');
			expect(navigation).toEqual({ affectedRows: 1 });
		});
	});
});
