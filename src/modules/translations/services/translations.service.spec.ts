import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { TranslationsService } from './translations.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockCacheManager: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	get: jest.fn(),
	set: jest.fn(),
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
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
				},
			],
		}).compile();

		translationsService = module.get<TranslationsService>(TranslationsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(translationsService).toBeDefined();
	});

	describe('getTranslations', () => {
		it('can get translations', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { cms_site_variables: [mockTranslationsResponse] },
			});
			const translations = await translationsService.getTranslations();

			expect(translations).toEqual(mockTranslationsResponse.value);
		});

		it('throws an exception if no translations were set', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { cms_site_variables: undefined },
			});
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
