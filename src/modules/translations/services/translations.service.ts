import { CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { Translations } from '../types';

import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';
import { TranslationKey } from '~modules/admin/translations/types';

@Injectable()
export class TranslationsService {
	private logger: Logger = new Logger(TranslationsService.name, { timestamp: true });

	constructor(
		private siteVariablesService: SiteVariablesService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	public async getTranslations(): Promise<Translations> {
		const translations = await this.cacheManager.wrap(
			TranslationKey.FRONTEND_TRANSLATIONS,
			() =>
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.FRONTEND_TRANSLATIONS
				),
			// cache for 1h
			{ ttl: 3600 }
		);
		if (!translations) {
			throw new NotFoundException('No translations have been set in the database');
		}

		return translations;
	}
}
