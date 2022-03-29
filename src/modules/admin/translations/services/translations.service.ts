import { Injectable, Logger } from '@nestjs/common';

import { TranslationKey } from '../types';

import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class TranslationsService {
	private logger: Logger = new Logger(TranslationsService.name, { timestamp: true });

	constructor(private siteVariablesService: SiteVariablesService) {}

	public async getTranslations(): Promise<Record<string, Record<string, string>>> {
		const [frontendTranslations, backendTranslations] = await Promise.all([
			this.siteVariablesService.getSiteVariable(TranslationKey['frontend-translations']),
			this.siteVariablesService.getSiteVariable(TranslationKey['backend-translations']),
		]);
		return {
			'frontend-translations': frontendTranslations?.value,
			'backend-translations': backendTranslations?.value,
		};
	}

	public async updateTranslations(
		key: TranslationKey,
		value: Record<string, string>
	): Promise<UpdateResponse> {
		return this.siteVariablesService.updateSiteVariable(key, value);
	}
}
