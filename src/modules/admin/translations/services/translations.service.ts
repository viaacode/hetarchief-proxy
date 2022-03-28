import { Injectable, Logger } from '@nestjs/common';

import { SiteVariable } from '../../site-variables/types';

import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class TranslationsService {
	private logger: Logger = new Logger(TranslationsService.name, { timestamp: true });

	constructor(private siteVariablesService: SiteVariablesService) {}

	public async getTranslations(): Promise<SiteVariable> {
		return this.siteVariablesService.getSiteVariable('translations-frontend');
	}

	public async updateTranslations(value: Record<string, string>): Promise<UpdateResponse> {
		return this.siteVariablesService.updateSiteVariable('translations-frontend', value);
	}
}
