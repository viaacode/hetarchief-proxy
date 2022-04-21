import { Test, TestingModule } from '@nestjs/testing';

import { AdminNavigationsService } from '../services/admin-navigations.service';

import { AdminNavigationsController } from './admin-navigations.controller';

import { DeleteResponse } from '~shared/types/types';

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

const mockNavigationsService: Partial<Record<keyof AdminNavigationsService, jest.SpyInstance>> = {
	findAllNavigationBars: jest.fn(),
	findElementById: jest.fn(),
	createElement: jest.fn(),
	updateElement: jest.fn(),
	deleteElement: jest.fn(),
};

describe('NavigationsController', () => {
	let navigationsController: AdminNavigationsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminNavigationsController],
			imports: [],
			providers: [
				{
					provide: AdminNavigationsService,
					useValue: mockNavigationsService,
				},
			],
		}).compile();

		navigationsController = module.get<AdminNavigationsController>(AdminNavigationsController);
	});

	it('should be defined', () => {
		expect(navigationsController).toBeDefined();
	});

	describe('getNavigationBars', () => {
		it('should return all navigations', async () => {
			mockNavigationsService.findAllNavigationBars.mockResolvedValueOnce(
				mockNavigationsResponse
			);
			const navigations = await navigationsController.getNavigationBars({});
			expect(navigations).toEqual(mockNavigationsResponse);
		});
	});

	describe('getNavigationElement', () => {
		it('should return a navigation by id', async () => {
			mockNavigationsService.findElementById.mockResolvedValueOnce(
				mockNavigationsResponse.items[0]
			);
			const navigations = await navigationsController.getNavigationElement('navigation-1');
			expect(navigations).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('createNavigationElement', () => {
		it('should create a new navigation', async () => {
			mockNavigationsService.createElement.mockResolvedValueOnce(
				mockNavigationsResponse.items[0]
			);
			const navigation = await navigationsController.createNavigationElement({
				label: 'test-create-nav',
				icon_name: '',
				placement: 'footer-links',
				position: 1,
			});
			expect(navigation).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('updateNavigationElement', () => {
		it('should update a navigation', async () => {
			mockNavigationsService.updateElement.mockResolvedValueOnce(
				mockNavigationsResponse.items[0]
			);
			const navigation = await navigationsController.updateNavigationElement('navigation-1', {
				label: 'test-create-nav',
				icon_name: '',
				placement: 'footer-links',
				position: 1,
			});
			expect(navigation).toEqual(mockNavigationsResponse.items[0]);
		});
	});

	describe('deleteNavigationElement', () => {
		it('should delete a navigation', async () => {
			const mockData: DeleteResponse = { affectedRows: 1 };
			mockNavigationsService.deleteElement.mockResolvedValueOnce(mockData);
			const navigation = await navigationsController.deleteNavigationElement('navigation-1');
			expect(navigation).toEqual({ affectedRows: 1 });
		});
	});
});
