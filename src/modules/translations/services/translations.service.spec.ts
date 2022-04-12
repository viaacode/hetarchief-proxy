import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { TranslationsService } from './translations.service';

import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockSiteVariablesService: Partial<Record<keyof SiteVariablesService, jest.SpyInstance>> = {
	getSiteVariable: jest.fn(),
};

const mockCacheManager: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	wrap: ((key: string, func: () => any): any => {
		return func();
	}) as any,
};

const mockTranslationsResponse = {
	name: 'TRANSLATIONS_FRONTEND',
	value: { key1: 'translation 1' },
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

	describe('getTranslations', () => {
		it('can get translations', async () => {
			mockSiteVariablesService.getSiteVariable.mockResolvedValueOnce(
				mockTranslationsResponse.value
			);
			// mockCacheManager.wrap.mockResolvedValueOnce(mockTranslationsResponse.value);
			const translations = await translationsService.getTranslations();

			expect(translations).toEqual(mockTranslationsResponse.value);
		});

		it('throws an exception if no translations were set', async () => {
			mockSiteVariablesService.getSiteVariable.mockResolvedValueOnce(undefined);
			// mockCacheManager.wrap.mockResolvedValueOnce(undefined);
			let error;
			try {
				await translationsService.getTranslations();
			} catch (e) {
				error = e;
			}

			expect(error.message).toEqual('No translations have been set in the database');
		});
	});
});
