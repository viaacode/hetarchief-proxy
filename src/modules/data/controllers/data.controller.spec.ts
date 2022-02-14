import { Test, TestingModule } from '@nestjs/testing';

import { DataService } from '../services/data.service';

import { DataController } from './data.controller';

const mockDataService = {
	executeClientQuery: () => ({
		data: {
			username: 'archief2.0',
		},
	}),
};

describe('DataController', () => {
	let dataController: DataController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DataController],
			providers: [
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		dataController = module.get<DataController>(DataController);
	});

	it('should be defined', () => {
		expect(dataController).toBeDefined();
	});

	describe('data', () => {
		it('should get a result for a graphQl query', async () => {
			const result = await dataController.post({ query: 'query testQuery { username }' });
			expect(result).toEqual({
				data: {
					username: 'archief2.0',
				},
			});
		});
	});
});
