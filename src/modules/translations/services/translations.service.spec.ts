import { SiteVariablesService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { TranslationsService } from './translations.service';

import { TestingLogger } from '~shared/logging/test-logger';

const mockSiteVariablesService: Partial<Record<keyof SiteVariablesService, jest.SpyInstance>> = {
	getSiteVariable: jest.fn(),
};

const mockCacheManager: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	wrap: jest.fn().mockImplementation((key: string, func: () => any): any => {
		return func();
	}) as any,
};

describe('TranslationsService', () => {
	let translationsService: TranslationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TranslationsService,
				{
					provide: SiteVariablesService,
					useValue: mockSiteVariablesService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		translationsService = module.get<TranslationsService>(TranslationsService);
	});

	afterEach(() => {
		mockSiteVariablesService.getSiteVariable.mockRestore();
	});

	it('services should be defined', () => {
		expect(translationsService).toBeDefined();
	});
});
