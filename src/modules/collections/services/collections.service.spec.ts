import { Test, TestingModule } from '@nestjs/testing';

import { CollectionsService } from './collections.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
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
			// const adapted = collectionsService.adapt(cpCollection);
			// test some sample keys
			// expect(adapted.id).toEqual('65790f8f-6365-4891-8ce2-4563f360db89');
			// expect(adapted.name).toEqual('VRT');
			// expect(adapted.logo).toEqual('https://assets.viaa.be/images/OR-rf5kf25');
			// expect(adapted.contactInfo.address.postalCode).toEqual('1043');
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all collections', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_collection: [
						{
							id: '1',
						},
					],
					cp_collection_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await collectionsService.findByUser(
				'b6c5419f-6a19-4a41-a400-e0bbc0429c4f'
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single collection', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_collection: [
						{
							id: '1',
						},
					],
				},
			});
			const response = await collectionsService.findById('1');
			expect(response.id).toBe('1');
		});

		it('throws a notfoundexception if the collection was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_collection: [],
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
});
