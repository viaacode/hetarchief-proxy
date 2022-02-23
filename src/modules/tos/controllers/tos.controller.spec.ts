import { Test, TestingModule } from '@nestjs/testing';

import { TosService } from '../services/tos.service';
import { Tos } from '../types';

import { TosController } from './tos.controller';

const mockTosResponse: Tos = {
	updatedAt: '1997-01-01T00:00:00.000Z',
};

const mockTosService = {
	findFirst: jest.fn(),
	getTos: jest.fn(),
	getTosLastUpdatedAt: jest.fn(),
};

describe('TosController', () => {
	let tosController: TosController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TosController],
			imports: [],
			providers: [
				{
					provide: TosService,
					useValue: mockTosService,
				},
			],
		}).compile();

		tosController = module.get<TosController>(TosController);
	});

	it('should be defined', () => {
		expect(tosController).toBeDefined();
	});

	describe('getTos', () => {
		it('should return the first tos', async () => {
			mockTosService.getTos.mockResolvedValueOnce(mockTosResponse);
			mockTosService.getTosLastUpdatedAt.mockResolvedValueOnce(mockTosResponse);

			const tos = await tosController.getTos();

			expect(tos.updatedAt).toBeDefined();
		});
	});
});
