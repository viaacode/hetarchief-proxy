import { AdminTranslationsModule, AssetsModule, DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { type Configuration } from '~config';

import { SpacesController } from './controllers/spaces.controller';
import { SpacesService } from './services/spaces.service';

@Module({
	controllers: [SpacesController],
	imports: [
		forwardRef(() => DataModule),
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService<Configuration>) =>
				configService.get('MULTER_OPTIONS'),
			inject: [ConfigService],
		}),
		AssetsModule,
		AdminTranslationsModule,
	],
	providers: [SpacesService],
	exports: [SpacesService],
})
export class SpacesModule {}
