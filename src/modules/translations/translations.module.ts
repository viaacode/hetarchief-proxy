import { CacheModule, Module } from '@nestjs/common';

import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [TranslationsController],
	imports: [DataModule, CacheModule.register()],
	providers: [TranslationsService],
})
export class TranslationsModule {}
