import { Test, TestingModule } from '@nestjs/testing';
import { IPagination } from '@studiohyperdrive/pagination';

import { CollectionsService } from '../services/collections.service';

import { CollectionsController } from './collections.controller';

import { Collection } from '~modules/collections/types';
import { SessionHelper } from '~shared/auth/session-helper';

const mockCollectionsResponse: IPagination<Collection> = {
	items: [
		{
			id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
			name: 'Favorieten',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			isDefault: true,
			createdAt: '2022-02-18T09:19:09.487977',
			updatedAt: '2022-02-18T09:19:09.487977',
		},
		{
			id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
			name: 'my favorite movies',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			isDefault: false,
			createdAt: '2022-02-22T13:51:01.995293',
			updatedAt: '2022-02-22T13:51:01.995293',
		},
	],
	total: 2,
	pages: 1,
	page: 0,
	size: 1000,
};

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
};

const mockCollectionsService = {
	findByUser: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

describe('CollectionsController', () => {
	let collectionsController: CollectionsController;
	let sessionHelperSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CollectionsController],
			imports: [],
			providers: [
				{
					provide: CollectionsService,
					useValue: mockCollectionsService,
				},
			],
		}).compile();

		collectionsController = module.get<CollectionsController>(CollectionsController);

		sessionHelperSpy = jest
			.spyOn(SessionHelper, 'getArchiefUserInfo')
			.mockReturnValue(mockUser);
	});

	afterEach(async () => {
		sessionHelperSpy.mockRestore();
	});

	it('should be defined', () => {
		expect(collectionsController).toBeDefined();
	});

	describe('getCollections', () => {
		it('should return all collections of a specific user', async () => {
			mockCollectionsService.findByUser.mockResolvedValueOnce(mockCollectionsResponse);
			const collections = await collectionsController.getCollections({});
			expect(collections.items.length).toEqual(2);
		});
	});

	describe('getCollectionById', () => {
		it('should return a collection by id', async () => {
			mockCollectionsService.findById.mockResolvedValueOnce(mockCollectionsResponse.items[0]);
			const collection = await collectionsController.getCollectionById(
				mockCollectionsResponse.items[0].id,
				{}
			);
			expect(collection.id).toEqual(mockCollectionsResponse.items[0].id);
		});
	});

	describe('createCollection', () => {
		it('should create a collection by id', async () => {
			mockCollectionsService.create.mockResolvedValueOnce(mockCollectionsResponse.items[0]);
			const collection = await collectionsController.createCollection(
				{
					name: 'test collection',
				},
				{}
			);
			expect(collection).toEqual(mockCollectionsResponse.items[0]);
		});
	});

	describe('updateCollection', () => {
		it('should update a collection by id', async () => {
			mockCollectionsService.update.mockResolvedValueOnce(mockCollectionsResponse.items[0]);
			const collection = await collectionsController.updateCollection(
				mockCollectionsResponse.items[0].id,
				{
					name: 'test collection',
				},
				{}
			);
			expect(collection).toEqual(mockCollectionsResponse.items[0]);
		});
	});

	describe('deleteCollection', () => {
		it('should delete a collection by id', async () => {
			mockCollectionsService.delete.mockResolvedValueOnce(1);

			const response = await collectionsController.deleteCollection(
				mockCollectionsResponse.items[0].id,
				{}
			);
			expect(response).toEqual({ status: 'collection has been deleted' });
		});

		it('should delete a collection by id', async () => {
			mockCollectionsService.delete.mockResolvedValueOnce(0);

			const response = await collectionsController.deleteCollection(
				mockCollectionsResponse.items[0].id,
				{}
			);
			expect(response).toEqual({ status: 'no collections found with that id' });
		});
	});
});
