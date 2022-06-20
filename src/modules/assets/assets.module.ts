import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AssetsService } from './services/assets.service';

import { AssetsController } from '~modules/assets/controllers/assets.controller';
import { TranslationsModule } from '~modules/translations';

@Module({
	imports: [ConfigModule, TranslationsModule],
	controllers: [AssetsController],
	providers: [AssetsService],
	exports: [AssetsService],
})
export class AssetsModule {}
