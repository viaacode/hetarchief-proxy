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
					mockNavigationElement1,
					mockNavigationElement2,
				] as FindAllNavigationItemsQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.getNavigationElementsForUser(null);
			// response is grouped by placement
			expect(response[mockNavigationElement1.placement].length).toEqual(1);
			expect(response[mockNavigationElement2.placement]).toBeUndefined();
			expect(response[mockNavigationElement1.placement][0].id).toEqual(
				mockNavigationElement1.id
			);
		});

		it('returns other navigation items for a logged in user', async () => {
			const mockData: FindAllNavigationItemsQuery = {
				app_navigation: [
					mockNavigationElement1,
					mockNavigationElement2,
				] as FindAllNavigationItemsQuery['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.getNavigationElementsForUser(mockUser);
			// response is grouped by placement
			expect(response[mockNavigationElement1.placement].length).toEqual(1);
			expect(response[mockNavigationElement2.placement].length).toEqual(1);
			expect(response[mockNavigationElement1.placement][0].id).toEqual(
				mockNavigationElement1.id
			);
		});
	});
});
