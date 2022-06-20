import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { SpacesController } from './controllers/spaces.controller';
import { SpacesService } from './services/spaces.service';

import { AssetsModule } from '~modules/assets';
import { DataModule } from '~modules/data';
import { TranslationsModule } from '~modules/translations';

@Module({
	controllers: [SpacesController],
	imports: [
		forwardRef(() => DataModule),
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => configService.get('multerOptions'),
			inject: [ConfigService],
		}),
		AssetsModule,
		TranslationsModule,
	],
	providers: [SpacesService],
	exports: [SpacesService],
})
export class SpacesModule {}
