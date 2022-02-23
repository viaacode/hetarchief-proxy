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
			expect(adapted.updatedAt).toEqual(tos.updated_at);
		});
	});

	describe('Find last updated date for TOS', () => {
		it('returns a single tos', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_site_variables: [
						{
							value: {
								updated_at: tos.updated_at,
							},
						},
					],
				},
			});

			const response = await tosService.getTosLastUpdatedAt();
			expect(response?.updatedAt).toEqual(tos.updated_at);
		});
	});
});
