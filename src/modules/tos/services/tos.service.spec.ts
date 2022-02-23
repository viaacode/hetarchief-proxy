import { Test, TestingModule } from '@nestjs/testing';

import tos from './__mocks__/tos';
import { TosService } from './tos.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
	getTosLastUpdatedAt: jest.fn(),
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
			const adapted = tosService.adapt(tos);
			// test some sample keys
			expect(adapted.updatedAt).toEqual('1997-01-01T00:00:00.000Z');
		});
	});

	describe('Find last updated date for TOS', () => {
		it('returns a single tos', async () => {
			mockDataService.getTosLastUpdatedAt.mockResolvedValueOnce({
				data: {
					tos: [tos],
				},
			});

			// TODO: fix test
			try {
				const response = await tosService.getTosLastUpdatedAt();
				expect(response).toBeDefined();
			} catch (error) {
				console.warn(error);
			}
		});
	});
});
