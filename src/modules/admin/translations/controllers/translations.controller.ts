import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateTranslationsDto } from '../dto/translations.dto';
import { TranslationsService } from '../services/translations.service';

import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { UpdateResponse } from '~shared/types/types';

@UseGuards(LoggedInGuard)
@ApiTags('Translations')
@Controller('admin/translations')
export class TranslationsController {
	private logger: Logger = new Logger(TranslationsController.name, { timestamp: true });

	constructor(private translationsService: TranslationsService) {}

	@Get()
	public async getTranslations(): Promise<Record<string, Record<string, string>>> {
		return this.translationsService.getTranslations();
	}

	@Post()
	public async updateTranslations(
		@Body() newTranslations: UpdateTranslationsDto
	): Promise<UpdateResponse> {
		return this.translationsService.updateTranslations(
			newTranslations.key,
			newTranslations.data
		);
	}
}
