import { Test, TestingModule } from '@nestjs/testing';

import { CollectionsService } from './collections.service';

import { mockGqlCollection } from '~modules/collections/services/__mocks__/users_collection';
import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

const mockGqlCollection1 = {
	id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
	name: 'Favorieten',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: true,
	created_at: '2022-02-18T09:19:09.487977',
	updated_at: '2022-02-18T09:19:09.487977',
};

const mockGqlCollection2 = {
	id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
	name: 'my favorite movies',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: false,
	created_at: '2022-02-22T13:51:01.995293',
	updated_at: '2022-02-22T13:51:01.995293',
};

const mockGqlCollectionObject = {
	schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
	schema_creator: null,
	dcterms_available: '2015-09-19T12:08:24',
	schema_thumbnail_url:
		'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	dcterms_format: 'video',
	schema_number_of_pages: null,
};

const mockGqlCollectionsResult = {
	data: {
		users_collection: [mockGqlCollection1, mockGqlCollection2],
		users_collection_aggregate: {
			aggregate: {
				count: 2,
			},
		},
	},
};

const mockGqlCollectionResult = {
	data: {
		users_collection: [
			{
				...mockGqlCollection1,
				ies: [
					{
						created_at: '2022-02-02T10:55:16.542503',
						intellectual_entity: mockGqlCollectionObject,
					},
				],
			},
		],
	},
};

describe('CollectionsService', () => {
	let collectionsService: CollectionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CollectionsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		collectionsService = module.get<CollectionsService>(CollectionsService);
	});

	it('services should be defined', () => {
		expect(collectionsService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our collection interface', () => {
			const adapted = collectionsService.adapt(mockGqlCollection);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlCollection.id);
			expect(adapted.name).toEqual(mockGqlCollection.name);
			expect(adapted.userProfileId).toEqual(mockGqlCollection.user_profile_id);
			expect(adapted.objects[0].termsAvailable).toEqual(
				mockGqlCollection.ies[0].intellectual_entity.dcterms_available
			);
			expect(adapted.objects[0].collectionEntryCreatedAt).toEqual(
				mockGqlCollection.ies[0].created_at
			);
		});
	});

	describe('findByUser', () => {
		it('returns a paginated response with all collections for a user', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionsResult);
			const response = await collectionsService.findByUser(
				mockGqlCollectionsResult.data.users_collection[0].user_profile_id
			);
			expect(response.items.length).toBe(2);
			expect(response.page).toBe(1);
			expect(response.size).toBe(1000);
			expect(response.total).toBe(2);
		});
	});

	describe('findById', () => {
		it('returns a single collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionResult);
			const response = await collectionsService.findById(
				mockGqlCollectionResult.data.users_collection[0].id
			);
			expect(response.id).toBe(mockGqlCollectionResult.data.users_collection[0].id);
		});

		it('throws a NotFoundException if the collection was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					users_collection: [],
				},
			});
			let error;
			try {
				await collectionsService.findById('unknown-id');
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
		it('can create a new collection', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					insert_users_collection: mockGqlCollection1,
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockCollection } = mockGqlCollection1;
			const response = await collectionsService.create(mockCollection);
			expect(response.id).toBe(mockGqlCollection1.id);
		});
	});

	describe('update', () => {
		it('can update a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_users_collection: mockGqlCollection1,
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, user_profile_id, ...mockCollection } =
				mockGqlCollection1;
			const response = await collectionsService.update(id, user_profile_id, mockCollection);
			expect(response.id).toBe(mockGqlCollection1.id);
		});
	});

	describe('delete', () => {
		it('can delete a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					delete_users_collection: {
						affected_rows: 1,
					},
				},
			});
			const { id, user_profile_id } = mockGqlCollection1;
			const affectedRows = await collectionsService.delete(id, user_profile_id);
			expect(affectedRows).toBe(1);
		});

		it('can delete a non existing collection', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					delete_users_collection: {
						affected_rows: 0,
					},
				},
			});
			const { user_profile_id } = mockGqlCollection1;
			const affectedRows = await collectionsService.delete('unknown-id', user_profile_id);
			expect(affectedRows).toBe(0);
		});
	});
});
