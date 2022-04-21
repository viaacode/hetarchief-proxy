import { Test, TestingModule } from '@nestjs/testing';
import { cloneDeep } from 'lodash';

import { mockGqlSpace } from './__mocks__/cp_space';
import { SpacesService } from './spaces.service';

import {
	FindSpaceByIdQuery,
	FindSpaceByMaintainerIdentifierQuery,
	FindSpacesQuery,
	GetSpaceMaintainerProfilesQuery,
	UpdateSpaceMutation,
	Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { AccessType } from '~modules/spaces/types';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockUser: User = {
	id: '0f5e3c9d-cf2a-4213-b888-dbf69b773c8e',
	firstName: 'Tom',
	lastName: 'Testerom',
	fullName: 'Test Testers',
	email: 'test@studiohyperdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockFindSpacesResponse: FindSpacesQuery = {
	maintainer_visitor_space: [
		{
			id: '1',
		},
	] as FindSpacesQuery['maintainer_visitor_space'],
	maintainer_visitor_space_aggregate: {
		aggregate: {
			count: 100,
		},
	},
};

describe('SpacesService', () => {
	let spacesService: SpacesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpacesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		spacesService = module.get<SpacesService>(SpacesService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(spacesService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our space interface', () => {
			const adapted = spacesService.adapt(mockGqlSpace);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlSpace.id);
			expect(adapted.name).toEqual(mockGqlSpace.content_partner.schema_name);
			expect(adapted.logo).toEqual(mockGqlSpace.content_partner.information[0].logo.iri);
			expect(adapted.contactInfo.address.postalCode).toEqual(
				mockGqlSpace.content_partner.information[0].primary_site.address.postal_code
			);
		});

		it('if the space description is empty it falls back to the maintainer description', () => {
			const mockCpSpace = cloneDeep(mockGqlSpace);
			mockCpSpace.schema_description = 'Space specific description';

			const adapted = spacesService.adapt(mockCpSpace);

			// test some sample keys
			expect(adapted.description).toEqual('Space specific description');
		});
	});

	describe('update', () => {
		it('can update a space', async () => {
			const mockData: UpdateSpaceMutation = {
				update_maintainer_visitor_space_by_pk: {
					id: '1',
				} as UpdateSpaceMutation['update_maintainer_visitor_space_by_pk'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await spacesService.update('1', {
				color: 'red',
				description: 'my-space',
				serviceDescription: 'service description',
				image: '',
				status: VisitorSpaceStatus.Active,
			});
			expect(response.id).toEqual('1');
		});

		it('does not crash when updating not a single value', async () => {
			const mockData: UpdateSpaceMutation = {
				update_maintainer_visitor_space_by_pk: {
					id: '1',
				} as UpdateSpaceMutation['update_maintainer_visitor_space_by_pk'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await spacesService.update('1', {});
			expect(response.id).toEqual('1');
		});

		it('throws a notfoundexception if the space was not found', async () => {
			const mockData: UpdateSpaceMutation = {
				update_maintainer_visitor_space_by_pk: null,
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			let error;
			try {
				await spacesService.update('0', {});
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual("Space with id '0' not found");
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all spaces (query undefined)', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll({ page: 1, size: 10 }, mockUser.id);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %)', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll(
				{ query: '%', page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %%)', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll(
				{ query: '%%', page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %Marie%)', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll(
				{ query: '%Marie%', page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces that are accessible', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll(
				{ accessType: AccessType.ACTIVE, page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces that are not accessible', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll(
				{ accessType: AccessType.NO_ACCESS, page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns an empty array response if no user is defined and the accessType is set', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: mockFindSpacesResponse });
			const response = await spacesService.findAll(
				{ accessType: AccessType.NO_ACCESS, page: 1, size: 20 },
				undefined
			);
			expect(response.items.length).toBe(0);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(0);
		});

		it('can filter spaces by their status', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					maintainer_visitor_space: [
						{
							id: '1',
						},
					],
					maintainer_visitor_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await spacesService.findAll(
				{ status: [VisitorSpaceStatus.Active], page: 1, size: 20 },
				undefined
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single space', async () => {
			const mockData: FindSpaceByIdQuery = {
				maintainer_visitor_space: [
					{
						id: '1',
					},
				] as FindSpaceByIdQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await spacesService.findById('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceByIdQuery = {
				maintainer_visitor_space: [] as FindSpaceByIdQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const space = await spacesService.findById('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('findBySlug', () => {
		const slug = 'slug';

		it('returns a single space by slug', async () => {
			const mockData: FindSpaceByMaintainerIdentifierQuery = {
				maintainer_visitor_space: [
					{
						content_partner: {
							schema_identifier: slug,
						},
					},
				] as FindSpaceByMaintainerIdentifierQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await spacesService.findBySlug(slug);
			expect(response.maintainerId).toBe(slug);
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceByMaintainerIdentifierQuery = {
				maintainer_visitor_space: [],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const space = await spacesService.findBySlug('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('findSpaceByCpUserId', () => {
		it('returns a single space', async () => {
			const mockData: FindSpaceByMaintainerIdentifierQuery = {
				maintainer_visitor_space: [
					{
						id: '1',
					},
				] as FindSpaceByMaintainerIdentifierQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await spacesService.findSpaceByCpUserId('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceByMaintainerIdentifierQuery = {
				maintainer_visitor_space: [],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const space = await spacesService.findSpaceByCpUserId('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('getMaintainerProfiles', () => {
		it('returns all profile ids for all maintainers of a ReadingRoom', async () => {
			const mockMaintainerIds: GetSpaceMaintainerProfilesQuery = {
				maintainer_users_profile: [
					{
						users_profile_id: '181c014f-365a-40ab-8694-1792768e57ee',
						profile: {
							mail: 'test.testers@meemoo.be',
						},
					},
					{
						users_profile_id: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
						profile: {
							mail: 'test.testers2@meemoo.be',
						},
					},
					{
						users_profile_id: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
						profile: {
							mail: 'test.testers3@meemoo.be',
						},
					},
				],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockMaintainerIds });
			const response = await spacesService.getMaintainerProfiles('1');
			expect(response).toHaveLength(3);
			expect(response[0]).toEqual({
				id: mockMaintainerIds.maintainer_users_profile[0].users_profile_id,
				email: mockMaintainerIds.maintainer_users_profile[0].profile.mail,
			});
		});
	});
});
