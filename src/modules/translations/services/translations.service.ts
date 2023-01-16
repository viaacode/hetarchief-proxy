import { SiteVariablesService, TranslationKey } from '@meemoo/admin-core-api';
import {
	CACHE_MANAGER,
	Inject,
	Injectable,
	NotFoundException,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

import { Translations } from '../types';

import {
	getTranslationFallback,
	resolveTranslationVariables,
} from '~shared/helpers/translation-fallback';

@Injectable()
export class TranslationsService implements OnApplicationBootstrap {
	private backendTranslations: Translations;

	constructor(
		private siteVariablesService: SiteVariablesService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	public async onApplicationBootstrap() {
		await this.refreshBackendTranslations();
	}

	/**
	 * Refresh the local cache of backend translations
	 */
	@Cron('0 * * * *')
	public async refreshBackendTranslations(): Promise<void> {
		const translations = await this.siteVariablesService.getSiteVariable<Translations>(
			TranslationKey.TRANSLATIONS_BACKEND
		);

		if (!translations) {
			throw new NotFoundException('No backend translations have been set in the database');
		}

		this.backendTranslations = translations;
	}

	public t(key: string, variables: Record<string, string | number> = {}): string {
		const translation = this.backendTranslations[key];
		if (translation) {
			return resolveTranslationVariables(translation, variables);
		}
		return getTranslationFallback(key, variables);
	}
}
