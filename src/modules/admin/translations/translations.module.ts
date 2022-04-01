import { Module } from '@nestjs/common';

import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';

import { SiteVariablesModule } from '~modules/admin/site-variables';

@Module({
	controllers: [TranslationsController],
	imports: [SiteVariablesModule],
	providers: [TranslationsService],
})
export class AdminTranslationsModule {}
