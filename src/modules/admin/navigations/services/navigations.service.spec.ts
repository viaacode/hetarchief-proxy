import { Test, TestingModule } from '@nestjs/testing';

import { NavigationsService } from './navigations.service';

import { Idp } from '~modules/auth/types';
import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

const getNewMockSession = () => ({
	idp: Idp.HETARCHIEF,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {
		email: 'test@studiohypderdrive.be',
	},
});

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
			const response = await navigationsService.findAllNavigationBars({});
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
			const response = await navigationsService.findAllNavigationBars({
				placement: 'footer-links',
			});
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
			const response = await navigationsService.findElementById('1');
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
				await navigationsService.findElementById('unknown-id');
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
			const response = await navigationsService.createElement({
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
			const response = await navigationsService.updateElement('1', {
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
			const response = await navigationsService.deleteElement('1');
			expect(response.affectedRows).toBe('1');
		});
	});

	describe('getNavigationItems', () => {
		it('returns navigation items for a not-logged in user', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_navigation_element: [
						{
							id: '1',
							placement: 'footer-links',
							user_group_ids: [-1, -2],
						},
						{
							id: '2',
							placement: 'footer-links',
							user_group_ids: [-2],
						},
					],
					cms_navigation_element_aggregate: {
						aggregate: {
							count: 2,
						},
					},
				},
			});
			const response = await navigationsService.getNavigationElementsForUser({});
			// response is grouped by placement
			expect(response['footer-links'].length).toEqual(1);
			expect(response['footer-links'][0].id).toEqual('1');
		});

		it('returns other navigation items for a logged in user', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_navigation_element: [
						{
							id: '1',
							placement: 'footer-links',
							user_group_ids: [-1, -2],
						},
						{
							id: '2',
							placement: 'footer-links',
							user_group_ids: [-2],
						},
					],
					cms_navigation_element_aggregate: {
						aggregate: {
							count: 2,
						},
					},
				},
			});
			const response = await navigationsService.getNavigationElementsForUser(
				getNewMockSession()
			);
			// response is grouped by placement
			expect(response['footer-links'].length).toEqual(2);
			expect(response['footer-links'][1].id).toEqual('2');
		});
	});
});
