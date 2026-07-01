import { AdminTranslationsModule, AssetsModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import type { Configuration } from '~config';

import { ThemesController } from './controllers/themes.controller';
import { ThemesService } from './services/themes.service';

@Module({
	imports: [
		DataModule,
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService<Configuration>) =>
				configService.get('MULTER_OPTIONS'),
			inject: [ConfigService],
		}),
		AssetsModule,
	],
	controllers: [ThemesController],
	providers: [ThemesService],
	exports: [ThemesService],
})
export class ThemesModule {}
