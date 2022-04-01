import { UpdateTranslationsDto } from './translations.dto';

describe('TranslationsDto', () => {
	describe('UpdateTranslationsDto', () => {
		it('should be able to construct a CreateVUpdateTranslationsDtoisitDto object', async () => {
			const updateTranslationsDto = new UpdateTranslationsDto();
			expect(updateTranslationsDto).toEqual({});
		});
	});
});
