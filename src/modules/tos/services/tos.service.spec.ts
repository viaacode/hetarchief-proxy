import { DataService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';

import { TosService } from './tos.service';

import type { GetTosLastUpdatedAtQuery } from '~generated/graphql-db-types-hetarchief';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const updatedAtIsoDate = '1997-01-01T00:00:00.000Z';

describe('TosService', () => {
	let tosService: TosService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TosService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		tosService = module.get<TosService>(TosService);
	});

	it('services should be defined', () => {
		expect(tosService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our tos interface', () => {
			const adapted = tosService.adapt(updatedAtIsoDate);
			// test some sample keys
			expect(adapted).toEqual({
				updatedAt: updatedAtIsoDate,
			});
		});
	});

	describe('Find last updated date for TOS', () => {
		it('returns a single tos', async () => {
			const mockData: GetTosLastUpdatedAtQuery = {
				app_config_by_pk: {
					value: updatedAtIsoDate,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await tosService.getTosLastUpdatedAt();
			expect(response.updatedAt).toEqual(updatedAtIsoDate);
		});

		it('throws a notfoundexception if no data was found', async () => {
			const mockData: GetTosLastUpdatedAtQuery = {
				app_config_by_pk: null,
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			let error: any;
			try {
				await tosService.getTosLastUpdatedAt();
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: 'No TOS date was found in the database',
				statusCode: 404,
			});
		});
	});
});
