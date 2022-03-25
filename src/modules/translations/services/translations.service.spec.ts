import { Test, TestingModule } from '@nestjs/testing';

import { TranslationsService } from './translations.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockTranslationsResponse = {
	name: 'translations-frontend',
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

			expect(translations).toEqual(mockTranslationsResponse);
		});
	});
});
