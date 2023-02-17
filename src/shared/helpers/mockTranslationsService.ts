import { TranslationsService } from '~modules/translations/services/translations.service';
import { getTranslationFallback } from '~shared/helpers/translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> =
	{
		onApplicationBootstrap: jest.fn(),
		refreshBackendTranslations: jest.fn(),
		t: jest.fn().mockImplementation(getTranslationFallback),
	};
