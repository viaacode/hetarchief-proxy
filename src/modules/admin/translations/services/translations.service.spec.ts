import { Test, TestingModule } from '@nestjs/testing';

import { TranslationKey } from '../types';

import { TranslationsService } from './translations.service';

import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';

const mockSiteVariablesService = {
	getSiteVariable: jest.fn(),
	updateSiteVariable: jest.fn(),
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
			],
		}).compile();

		translationsService = module.get<TranslationsService>(TranslationsService);
	});

	it('services should be defined', () => {
		expect(translationsService).toBeDefined();
	});

	describe('getTranslations', () => {
		it('returns translations', async () => {
			mockSiteVariablesService.getSiteVariable
				.mockResolvedValueOnce({
					key: 'translation',
				})
				.mockResolvedValueOnce({
					key: 'BE-translation',
				});
			const response = await translationsService.getTranslations();
			expect(response['frontend-translations']).toEqual({ key: 'translation' });
			expect(response['backend-translations']).toEqual({ key: 'BE-translation' });
		});

		it('returns nothing on empty translations', async () => {
			mockSiteVariablesService.getSiteVariable.mockResolvedValue(undefined);
			const response = await translationsService.getTranslations();
			expect(response).toEqual({});
		});
	});

	describe('updateSiteVariable', () => {
		it('can update the translations', async () => {
			mockSiteVariablesService.updateSiteVariable.mockResolvedValueOnce({
				affected_rows: 1,
			});
			const response = await translationsService.updateTranslations(
				TranslationKey.FRONTEND_TRANSLATIONS,
				{
					key: 'new-translation',
				}
			);
			expect(response).toEqual({ affected_rows: 1 });
		});
	});
});
