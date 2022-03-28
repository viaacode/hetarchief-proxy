import { CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { get } from 'lodash';

import { Translations } from '../types';

import { GET_SITE_VARIABLES_BY_NAME } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
@Injectable()
export class TranslationsService {
	private logger: Logger = new Logger(TranslationsService.name, { timestamp: true });

	constructor(
		private dataService: DataService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	public async getTranslations(): Promise<Translations> {
		let translations: Translations = await this.cacheManager.get('translations');
		if (!translations) {
			const response = await this.dataService.execute(GET_SITE_VARIABLES_BY_NAME, {
				name: 'TRANSLATIONS_FRONTEND',
			});
			translations = get(response, 'data.cms_site_variables[0].value');
			if (!translations) {
				throw new NotFoundException('No translations have been set in the database');
			}
			await this.cacheManager.set('translations', translations, { ttl: 3600 }); // cache for 1h
		}

		return translations;
	}
}
