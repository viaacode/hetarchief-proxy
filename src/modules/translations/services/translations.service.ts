import { Injectable, Logger } from '@nestjs/common';
import { get } from 'lodash';

import { Translations } from '../types';

import { GET_SITE_VARIABLES_BY_NAME } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
@Injectable()
export class TranslationsService {
	private logger: Logger = new Logger(TranslationsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async getTranslations(): Promise<Translations> {
		const response = await this.dataService.execute(GET_SITE_VARIABLES_BY_NAME, {
			name: `translations-frontend`,
		});

		return get(response, 'data.cms_site_variables[0]');
	}
}
