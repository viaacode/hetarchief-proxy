import { Test, TestingModule } from '@nestjs/testing';

import { NavigationsService } from './navigations.service';

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
import { SpecialPermissionGroups } from '~shared/types/types';

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
			const mockData: FindAllNavigationItemsQuery = {
				app_navigation: [
					{
						id: '1',
					},
				] as FindAllNavigationItemsQuery['app_navigation'],
				app_navigation_aggregate: {
					aggregate: {
						count: 100,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.findAllNavigationBars({});
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(100);
			expect(response.total).toBe(100);
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

	describe('getNavigationItems', () => {
		it('returns navigation items for a not-logged in user', async () => {
			const mockData: FindNavigationQuery = {
				app_navigation: [
					{
						id: '1',
						placement: 'footer-links',
						user_group_ids: [
							SpecialPermissionGroups.loggedOutUsers,
							SpecialPermissionGroups.loggedInUsers,
						],
					},
					{
						id: '2',
						placement: 'footer-links',
						user_group_ids: [SpecialPermissionGroups.loggedInUsers],
					},
				],
				app_navigation_aggregate: {
					aggregate: {
						count: 2,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.getNavigationElementsForUser(null);
			// response is grouped by placement
			expect(response['footer-links'].length).toEqual(1);
			expect(response['footer-links'][0].id).toEqual('1');
		});

		it('returns other navigation items for a logged in user', async () => {
			const mockData: FindNavigationQuery = {
				app_navigation: [
					{
						id: '1',
						placement: 'footer-links',
						user_group_ids: [
							SpecialPermissionGroups.loggedOutUsers,
							SpecialPermissionGroups.loggedInUsers,
						],
					},
					{
						id: '2',
						placement: 'footer-links',
						user_group_ids: [SpecialPermissionGroups.loggedInUsers],
					},
				],
				app_navigation_aggregate: {
					aggregate: {
						count: 2,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.getNavigationElementsForUser(mockUser);
			// response is grouped by placement
			expect(response['footer-links'].length).toEqual(2);
			expect(response['footer-links'][1].id).toEqual('2');
		});
	});
});
