import { Test, TestingModule } from '@nestjs/testing';

import { AdminNavigationsService } from './admin-navigations.service';

import {
	DeleteNavigationMutation,
	FindAllNavigationItemsQuery,
	FindNavigationByIdQuery,
	FindNavigationByPlacementQuery,
	InsertNavigationMutation,
	UpdateNavigationByIdMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { SpecialPermissionGroups } from '~shared/types/types';

const mockNavigationElement1 = {
	content_path: '/gebruiksvoorwaarden',
	content_type: 'INTERNAL_LINK',
	link_target: null,
	placement: 'footer_center',
	position: 1,
	id: '42555c7e-1cf7-4031-bb17-e6ca57eaab64',
	icon_name: '',
	user_group_ids: [SpecialPermissionGroups.loggedOutUsers, SpecialPermissionGroups.loggedInUsers],
	label: 'Gebruikersvoorwaarden',
	updated_at: '2022-02-21T16:36:06.045845+00:00',
	description: 'Navigatie balk in de footer gecentreerd',
	created_at: '2022-02-21T16:36:06.045845+00:00',
	content_id: null,
	tooltip: null,
};

const mockNavigationElement2 = {
	content_path: '/over-leeszalen',
	content_type: 'INTERNAL_LINK',
	link_target: null,
	placement: 'header_left',
	position: 1,
	id: '7f8c1140-d52e-4f12-8437-6176392f64db',
	icon_name: '',
	user_group_ids: [SpecialPermissionGroups.loggedInUsers],
	label: 'Over de leeszalen',
	updated_at: '2022-02-21T16:35:08.635696+00:00',
	description: 'Hoofd navigatie balk bovenaan de pagina linker zijde',
	created_at: '2022-02-21T16:35:08.635696+00:00',
	content_id: null,
	tooltip: null,
};

const mockNavigationElement3 = {
	content_path: '/faq',
	content_type: 'INTERNAL_LINK',
	link_target: null,
	placement: 'header_left',
	position: 2,
	id: 'f3b279b0-8c30-48cd-82ce-7b184180d890',
	icon_name: '',
	user_group_ids: null,
	label: 'Vaak gestelde vragen',
	updated_at: '2022-02-21T16:35:25.554254+00:00',
	description: 'Hoofd navigatie balk bovenaan de pagina linker zijde',
	created_at: '2022-02-21T16:35:25.554254+00:00',
	content_id: null,
	tooltip: null,
};

const mockDataService = {
	execute: jest.fn(),
};

describe('NavigationsService', () => {
	let navigationsService: AdminNavigationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminNavigationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		navigationsService = module.get<AdminNavigationsService>(AdminNavigationsService);
	});

	it('services should be defined', () => {
		expect(navigationsService).toBeDefined();
	});

	it('should adapt navigation to client side object', () => {
		const navigationInfo = navigationsService.adapt(mockNavigationElement1);
		expect(navigationInfo).toBeDefined();
		expect(navigationInfo.id).toEqual(mockNavigationElement1.id);
		expect(navigationInfo.contentPath).toEqual(mockNavigationElement1.content_path);
	});

	describe('findAll', () => {
		it('returns a paginated response with all navigations', async () => {
			const mockData: FindAllNavigationItemsQuery = {
				app_navigation: [
					mockNavigationElement1,
					mockNavigationElement2,
					mockNavigationElement3,
				] as FindAllNavigationItemsQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.findAllNavigationBars({});
			expect(response.items.length).toBe(3);
			expect(response.page).toBe(1);
			expect(response.size).toBe(3);
			expect(response.total).toBe(3);
		});

		it('returns a paginated response with all navigations by placement', async () => {
			const mockData: FindNavigationByPlacementQuery = {
				app_navigation: [
					mockNavigationElement1,
				] as FindNavigationByPlacementQuery['app_navigation'],
				app_navigation_aggregate: {
					aggregate: {
						count: 1,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.findAllNavigationBars({
				placement: mockNavigationElement1.placement,
			});
			expect(response.items.length).toBe(1);
			expect(response.items[0].placement).toEqual(mockNavigationElement1.placement);
			expect(response.page).toBe(1);
			expect(response.size).toBe(1);
			expect(response.total).toBe(1);
		});
	});

	describe('findById', () => {
		it('returns a single navigation', async () => {
			const mockData: FindNavigationByIdQuery = {
				app_navigation: [
					mockNavigationElement1,
				] as FindNavigationByIdQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.findElementById(mockNavigationElement1.id);
			expect(response.id).toBe(mockNavigationElement1.id);
		});

		it('throws a notfoundexception if the navigation was not found', async () => {
			const mockData: FindNavigationByIdQuery = {
				app_navigation: [] as FindNavigationByIdQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
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
			const mockData: InsertNavigationMutation = {
				insert_app_navigation_one: {
					id: '1',
				} as InsertNavigationMutation['insert_app_navigation_one'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
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
			const mockData: UpdateNavigationByIdMutation = {
				update_app_navigation_by_pk: {
					id: '1',
				} as UpdateNavigationByIdMutation['update_app_navigation_by_pk'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
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
			const mockData: DeleteNavigationMutation = {
				delete_app_navigation: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.deleteElement('1');
			expect(response.affectedRows).toBe(1);
		});
	});
});
