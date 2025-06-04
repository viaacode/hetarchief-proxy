// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { TranslationsService } from '@meemoo/admin-core-api';

import { getTranslationFallback } from '~shared/helpers/translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> =
	{
		onApplicationBootstrap: jest.fn(),
		refreshBackendTranslations: jest.fn(),
		tText: jest.fn().mockImplementation(getTranslationFallback),
	};
