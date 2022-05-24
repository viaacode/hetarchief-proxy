import { Injectable, Logger } from '@nestjs/common';

import { TranslationKey } from '../types';

import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';
import { Translations } from '~modules/translations/types';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class TranslationsService {
	private logger: Logger = new Logger(TranslationsService.name, { timestamp: true });

	constructor(private siteVariablesService: SiteVariablesService) {}

	public async getTranslations(): Promise<Record<string, Record<string, string>>> {
		const [translationsFrontend, translationsAdminCore, translationsBackend] =
			await Promise.all([
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.TRANSLATIONS_FRONTEND
				),
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.TRANSLATIONS_ADMIN_CORE
				),
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.TRANSLATIONS_BACKEND
				),
			]);
		return {
			TRANSLATIONS_FRONTEND: translationsFrontend,
			TRANSLATIONS_ADMIN_CORE: translationsAdminCore,
			TRANSLATIONS_BACKEND: translationsBackend,
		};
	}

	public async updateTranslations(
		key: TranslationKey,
		value: Record<string, string>
	): Promise<UpdateResponse> {
		return this.siteVariablesService.updateSiteVariable(key, value);
	}
}
