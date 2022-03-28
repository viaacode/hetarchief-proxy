import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TranslationsService } from '../services/translations.service';
import { Translations } from '../types';

@ApiTags('Translations')
@Controller('translations')
export class TranslationsController {
	private logger: Logger = new Logger(TranslationsController.name, { timestamp: true });

	constructor(private translationsService: TranslationsService) {}

	@Get('nl.json')
	public async getTranslationsJson(): Promise<Translations> {
		return this.translationsService.getTranslations();
	}
}
