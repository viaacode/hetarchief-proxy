import { Test, TestingModule } from '@nestjs/testing';
import { cloneDeep } from 'lodash';

import cpSpace from './__mocks__/cp_space';
import { SpacesService } from './spaces.service';

import { DataService } from '~modules/data/services/data.service';
import { AccessType } from '~modules/spaces/types';
import { Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockUser: User = {
	id: '0f5e3c9d-cf2a-4213-b888-dbf69b773c8e',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohyperdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	permissions: [Permission.CAN_READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
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
		}).compile();

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
			const adapted = spacesService.adapt(cpSpace);
			// test some sample keys
			expect(adapted.id).toEqual('65790f8f-6365-4891-8ce2-4563f360db89');
			expect(adapted.name).toEqual('VRT');
			expect(adapted.logo).toEqual('https://assets.viaa.be/images/OR-rf5kf25');
			expect(adapted.contactInfo.address.postalCode).toEqual('1043');
		});

		it('if the space description is empty it falls back to the maintainer description', () => {
			const mockCpSpace = cloneDeep(cpSpace);
			mockCpSpace.schema_description = 'Space specific description';

			const adapted = spacesService.adapt(mockCpSpace);

			// test some sample keys
			expect(adapted.description).toEqual('Space specific description');
		});
	});

	describe('update', () => {
		it('can update a space', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_cp_space_by_pk: {
						id: '1',
					},
				},
			});
			const response = await spacesService.update('1', {
				color: 'red',
				description: 'my-space',
				serviceDescription: 'service description',
			});
			expect(response.id).toEqual('1');
		});

		it('does not crash when updating not a single value', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_cp_space_by_pk: {
						id: '1',
					},
				},
			});
			const response = await spacesService.update('1', {});
			expect(response.id).toEqual('1');
		});

		it('throws a notfoundexception if the space was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_cp_space_by_pk: null,
				},
			});
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
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await spacesService.findAll({ page: 1, size: 10 }, mockUser.id);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %)', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
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
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
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
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
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
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
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
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
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
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await spacesService.findAll(
				{ accessType: AccessType.NO_ACCESS, page: 1, size: 20 },
				undefined
			);
			expect(response.items.length).toBe(0);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(0);
		});
	});

	describe('findById', () => {
		it('returns a single space', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
				},
			});
			const response = await spacesService.findById('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [],
				},
			});

			const space = await spacesService.findById('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('findSpaceByCpUserId', () => {
		it('returns a single space', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
				},
			});
			const response = await spacesService.findSpaceByCpUserId('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [],
				},
			});

			const space = await spacesService.findSpaceByCpUserId('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('getMaintainerProfiles', () => {
		it('returns all profile ids for all maintainers of a ReadingRoom', async () => {
			const mockMaintainerIds = {
				data: {
					cp_maintainer_users_profile: [
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
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockMaintainerIds);
			const response = await spacesService.getMaintainerProfiles('1');
			expect(response).toHaveLength(3);
			expect(response[0]).toEqual({
				id: mockMaintainerIds.data.cp_maintainer_users_profile[0].users_profile_id,
				email: mockMaintainerIds.data.cp_maintainer_users_profile[0].profile.mail,
			});
		});
	});
});
