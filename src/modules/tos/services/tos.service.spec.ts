import { Test, TestingModule } from '@nestjs/testing';

import { TosService } from './tos.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

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
		}).compile();

		tosService = module.get<TosService>(TosService);
	});

	it('services should be defined', () => {
		expect(tosService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our tos interface', () => {
			const adapted = tosService.adapt('1997-01-01T00:00:00.000Z');
			// test some sample keys
			expect(adapted).toEqual({
				updatedAt: '1997-01-01T00:00:00.000Z',
			});
		});
	});

	describe('Find last updated date for TOS', () => {
		it('returns a single tos', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_site_variables_by_pk: {
						value: '1997-01-01T00:00:00.000Z',
					},
				},
			});

			const response = await tosService.getTosLastUpdatedAt();
			expect(response.updatedAt).toEqual('1997-01-01T00:00:00.000Z');
		});

		it('throws a notfoundexception if no data was found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_site_variables_by_pk: null,
				},
			});
			let error;
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
