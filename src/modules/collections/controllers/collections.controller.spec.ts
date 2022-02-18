import { Test, TestingModule } from '@nestjs/testing';

import { CollectionsService } from '../services/collections.service';

import { CollectionsController } from './collections.controller';

const mockCollectionsResponse = {
	items: [
		{
			id: '1',
			name: 'Collection Mountain',
		},
		{
			id: '2',
			name: 'Collection X',
		},
	],
};

const mockCollectionsService = {
	findAll: jest.fn(),
	findById: jest.fn(),
};

describe('CollectionsController', () => {
	let collectionsController: CollectionsController;

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
	});

	it('should be defined', () => {
		expect(collectionsController).toBeDefined();
	});

	describe('getCollections', () => {
		it('should return all collections of a specific user', async () => {
			mockCollectionsService.findAll.mockResolvedValueOnce(mockCollectionsResponse);
			const collections = await collectionsController.getCollections(null);
			expect(collections.items.length).toEqual(2);
		});
	});

	describe('getCollectionById', () => {
		it('should return a collection by id', async () => {
			mockCollectionsService.findById.mockResolvedValueOnce(mockCollectionsResponse.items[0]);
			const collection = await collectionsController.getCollectionById('1');
			expect(collection.id).toEqual('1');
		});
	});
});
