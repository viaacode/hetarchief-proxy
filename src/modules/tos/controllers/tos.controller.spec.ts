import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TosService } from '../services/tos.service';
import type { Tos } from '../types';

import { TosController } from './tos.controller';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestingLogger } from '~shared/logging/test-logger';

const mockTosResponse: Tos = {
	updatedAt: '1997-01-01T00:00:00.000Z',
};

const mockTosService = {
	findFirst: vi.fn(),
	getTos: vi.fn(),
	getTosLastUpdatedAt: vi.fn(),
};

const mockCacheManager = {
	wrap: vi.fn((key, cb) => cb()),
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
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

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
