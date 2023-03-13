import { TranslationsService } from '@meemoo/admin-core-api';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Translations } from '../types';

@ApiTags('Translations')
@Controller('translations')
export class TranslationsController {
	constructor(private translationsService: TranslationsService) {}

	@Get('nl.json')
	public async getTranslationsJson(): Promise<Translations> {
		return this.translationsService.getFrontendTranslations(); // TODO remove this once the admin-core route admin/translations is available on QAS
	}
}
