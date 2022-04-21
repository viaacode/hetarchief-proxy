import { Test, TestingModule } from '@nestjs/testing';

import { TranslationsService } from '../services/translations.service';
import { TranslationKey } from '../types';

import { TranslationsController } from './translations.controller';

import { UpdateResponse } from '~shared/types/types';

const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> = {
	getTranslations: jest.fn(),
	updateTranslations: jest.fn(),
};

const mockTranslationsResponse = {
	name: TranslationKey.TRANSLATIONS_FRONTEND,
	value: { key1: 'translation 1' },
};

describe('TranslationsController', () => {
	let translationsController: TranslationsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TranslationsController],
			imports: [],
			providers: [
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		translationsController = module.get<TranslationsController>(TranslationsController);
	});

	it('should be defined', () => {
		expect(translationsController).toBeDefined();
	});

	describe('getTranslations', () => {
		it('should return the translations', async () => {
			mockTranslationsService.getTranslations.mockResolvedValueOnce(mockTranslationsResponse);

			const translations = await translationsController.getTranslations();

			expect(translations).toEqual(mockTranslationsResponse);
		});
	});

	describe('updateTranslations', () => {
		it('should update the translations', async () => {
			const mockData: UpdateResponse = { affectedRows: 1 };
			mockTranslationsService.updateTranslations.mockResolvedValueOnce(mockData);

			const response = await translationsController.updateTranslations({
				key: TranslationKey.TRANSLATIONS_FRONTEND,
				data: { key1: 'newTranslation' },
			});

			expect(response.affectedRows).toBe(1);
		});
	});
});
