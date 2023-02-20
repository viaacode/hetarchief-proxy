import {
	AdminTranslationsModule,
	SiteVariablesModule,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { CacheModule, Module } from '@nestjs/common';

import { TranslationsController } from './controllers/translations.controller';

@Module({
	controllers: [TranslationsController],
	imports: [SiteVariablesModule, CacheModule.register(), AdminTranslationsModule],
	providers: [TranslationsService],
	exports: [TranslationsService],
})
export class TranslationsModule {}
