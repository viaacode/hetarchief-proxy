import { Test, TestingModule } from '@nestjs/testing';

import { NavigationsService } from './navigations.service';

import { FindAllNavigationItemsQuery } from '~generated/graphql-db-types-hetarchief';
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

	describe('getNavigationItems', () => {
		it('returns navigation items for a not-logged in user', async () => {
			const mockData: FindAllNavigationItemsQuery = {
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
				] as FindAllNavigationItemsQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.getNavigationElementsForUser(null);
			// response is grouped by placement
			expect(response['footer-links'].length).toEqual(1);
			expect(response['footer-links'][0].id).toEqual('1');
		});

		it('returns other navigation items for a logged in user', async () => {
			const mockData: FindAllNavigationItemsQuery = {
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
				] as FindAllNavigationItemsQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.getNavigationElementsForUser(mockUser);
			// response is grouped by placement
			expect(response['footer-links'].length).toEqual(2);
			expect(response['footer-links'][1].id).toEqual('2');
		});
	});
});
