import { Test, TestingModule } from '@nestjs/testing';

import { NavigationsService } from './navigations.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

describe('NavigationsService', () => {
	let navigationsService: NavigationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NavigationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		navigationsService = module.get<NavigationsService>(NavigationsService);
	});

	it('services should be defined', () => {
		expect(navigationsService).toBeDefined();
	});

	describe('findAll', () => {
		it('returns a paginated response with all navigations', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_navigation_element: [
						{
							id: '1',
						},
					],
					cms_navigation_element_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await navigationsService.findAll({});
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(100);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all navigations by placement', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_navigation_element: [
						{
							id: '1',
							placement: 'footer-links',
						},
					],
					cms_navigation_element_aggregate: {
						aggregate: {
							count: 1,
						},
					},
				},
			});
			const response = await navigationsService.findAll({ placement: 'footer-links' });
			expect(response.items.length).toBe(1);
			expect(response.items[0].placement).toEqual('footer-links');
			expect(response.page).toBe(1);
			expect(response.size).toBe(1);
			expect(response.total).toBe(1);
		});
	});

	describe('findById', () => {
		it('returns a single navigation', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_navigation_element: [
						{
							id: '1',
						},
					],
				},
			});
			const response = await navigationsService.findById('1');
			expect(response.id).toBe('1');
		});

		it('throws a notfoundexception if the navigation was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_navigation_element: [],
				},
			});
			let error;
			try {
				await navigationsService.findById('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				message: 'Not Found',
				statusCode: 404,
			});
		});
	});

	describe('create', () => {
		it('can create a new navigation', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					insert_cms_navigation_element_one: {
						id: '1',
					},
				},
			});
			const response = await navigationsService.create({
				label: 'test-create-nav',
				icon_name: '',
				placement: 'footer-links',
				position: 1,
			});
			expect(response.id).toBe('1');
		});
	});

	describe('update', () => {
		it('can update an existing navigation', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_cms_navigation_element_by_pk: {
						id: '1',
					},
				},
			});
			const response = await navigationsService.update('1', {
				label: 'test-create-nav',
				icon_name: '',
				placement: 'footer-links',
				position: 1,
			});
			expect(response.id).toBe('1');
		});
	});

	describe('delete', () => {
		it('can delete a navigation', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					delete_cms_navigation_element: {
						affected_rows: '1',
					},
				},
			});
			const response = await navigationsService.delete('1');
			expect(response.affectedRows).toBe('1');
		});
	});
});
