import { TranslationsService } from '@meemoo/admin-core-api';

import { getTranslationFallback } from '~shared/helpers/translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> =
	{
		onApplicationBootstrap: jest.fn(),
		refreshBackendTranslations: jest.fn(),
		t: jest.fn().mockImplementation(getTranslationFallback),
	};
