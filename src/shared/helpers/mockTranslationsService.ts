import { TranslationsService } from '@meemoo/admin-core-api';
import { type MockInstance, vi } from 'vitest';

import { getTranslationFallback } from '~shared/helpers/translation-fallback';

export const mockTranslationsService: Partial<Record<keyof TranslationsService, MockInstance>> = {
	onApplicationBootstrap: vi.fn(),
	refreshBackendTranslations: vi.fn(),
	tText: vi.fn().mockImplementation(getTranslationFallback),
};
