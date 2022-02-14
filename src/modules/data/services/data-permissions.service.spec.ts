import { Test, TestingModule } from '@nestjs/testing';

import { QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

const mockQuery = { query: 'query testQuery { username }' };

describe('DataPermissionsService', () => {
	let dataPermissionsService: DataPermissionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DataPermissionsService],
		}).compile();

		dataPermissionsService = module.get<DataPermissionsService>(DataPermissionsService);
	});

	it('services should be defined', () => {
		expect(dataPermissionsService).toBeDefined();
	});

	// Test need to be updated as current permissions implementation is a dummy
	describe('isAllowedToExecuteQuery', () => {
		it('should verify a query', async () => {
			const verified = await dataPermissionsService.verify(
				'TEST_QUERY',
				QueryOrigin.CLIENT,
				mockQuery
			);
			expect(verified).toEqual(true);
		});

		it('should allow a query without specific permissions configured', async () => {
			const verified = await dataPermissionsService.verify(
				'UNKNOWN_QUERY',
				QueryOrigin.CLIENT,
				{
					query: 'mutation testUpdate',
				}
			);
			expect(verified).toEqual(true);
		});
	});
});
