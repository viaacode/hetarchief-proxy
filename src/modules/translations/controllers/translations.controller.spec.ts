import { Test, TestingModule } from '@nestjs/testing';

import { TranslationsService } from '../services/translations.service';

import { TranslationsController } from './translations.controller';

import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';

const mockTranslationsResponse = {
	name: 'TRANSLATIONS_FRONTEND',
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
		})
			.setLogger(new TestingLogger())
			.compile();

		translationsController = module.get<TranslationsController>(TranslationsController);
	});

	it('should be defined', () => {
		expect(translationsController).toBeDefined();
	});

	describe('getTranslations', () => {
		it('should return the translations', async () => {
			mockTranslationsService.getTranslations.mockResolvedValueOnce(mockTranslationsResponse);

			const translations = await translationsController.getTranslationsJson();

			expect(translations).toEqual(mockTranslationsResponse);
		});
	});
});
