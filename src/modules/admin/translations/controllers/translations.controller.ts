import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdateTranslationsDto } from '../dto/translations.dto';
import { TranslationsService } from '../services/translations.service';

import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { UpdateResponse } from '~shared/types/types';

@UseGuards(LoggedInGuard)
@ApiTags('Translations')
@Controller('admin/translations')
@RequireAllPermissions(Permission.EDIT_TRANSLATIONS)
export class TranslationsController {
	private logger: Logger = new Logger(TranslationsController.name, { timestamp: true });

	constructor(private translationsService: TranslationsService) {}

	@Get()
	public async getTranslations(): Promise<Record<string, Record<string, string>>> {
		return this.translationsService.getTranslations();
	}

	@Post()
	@ApiOperation({
		description:
			'Set translations for the specified key. Careful: this overwrites all existing values.',
	})
	public async updateTranslations(
		@Body() newTranslations: UpdateTranslationsDto
	): Promise<UpdateResponse> {
		return this.translationsService.updateTranslations(
			newTranslations.key,
			newTranslations.data
		);
	}
}
