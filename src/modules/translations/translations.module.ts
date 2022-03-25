import { Module } from '@nestjs/common';

import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [TranslationsController],
	imports: [DataModule],
	providers: [TranslationsService],
})
export class TranslationsModule {}
