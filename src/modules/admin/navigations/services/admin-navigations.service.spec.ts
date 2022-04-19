import { Test, TestingModule } from '@nestjs/testing';

import { AdminNavigationsService } from './admin-navigations.service';

import {
	DeleteNavigationMutation,
	FindAllNavigationItemsQuery,
	FindNavigationByIdQuery,
	FindNavigationByPlacementQuery,
	FindNavigationQuery,
	InsertNavigationMutation,
	UpdateNavigationByIdMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockDataService = {
	execute: jest.fn(),
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
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

	describe('findAll', () => {
		it('returns a paginated response with all navigations', async () => {
			const mockData: FindAllNavigationItemsQuery = {
				app_navigation: [
					{
						id: '1',
					},
					{
						id: '2',
					},
					{
						id: '3',
					},
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
					{
						id: '1',
						placement: 'footer-links',
					},
				] as FindNavigationByPlacementQuery['app_navigation'],
				app_navigation_aggregate: {
					aggregate: {
						count: 1,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
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
			const mockData: FindNavigationByIdQuery = {
				app_navigation: [
					{
						id: '1',
					},
				] as FindNavigationByIdQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.findElementById('1');
			expect(response.id).toBe('1');
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
