import { TranslationKey } from '@meemoo/admin-core-api';

import { TranslationsService } from '~modules/translations/services/translations.service';
import { getTranslationFallback } from '~shared/helpers/translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> =
	{
		getTranslations: jest.fn().mockResolvedValue({
			[TranslationKey.TRANSLATIONS_FRONTEND]: {},
			[TranslationKey.TRANSLATIONS_ADMIN_CORE]: {},
		}),
		onApplicationBootstrap: jest.fn(),
		refreshBackendTranslations: jest.fn(),
		t: jest.fn().mockImplementation(getTranslationFallback),
	};
