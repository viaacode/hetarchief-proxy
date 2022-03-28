import { Test, TestingModule } from '@nestjs/testing';

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

	describe('getSiteVariable', () => {
		it('returns translations', async () => {
			mockSiteVariablesService.getSiteVariable.mockResolvedValueOnce({
				name: 'translations-frontend',
				value: {
					key: 'translation',
				},
			});
			const response = await translationsService.getTranslations();
			expect(response.name).toEqual('translations-frontend');
			expect(response.value.key).toEqual('translation');
		});
	});

	describe('updateSiteVariable', () => {
		it('can update the translations', async () => {
			mockSiteVariablesService.updateSiteVariable.mockResolvedValueOnce({
				affected_rows: 1,
			});
			const response = await translationsService.updateTranslations({
				key: 'new-translation',
			});
			expect(response).toEqual({ affected_rows: 1 });
		});
	});
});
