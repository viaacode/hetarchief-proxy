import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { SpacesController } from './controllers/spaces.controller';
import { SpacesService } from './services/spaces.service';

import { AssetsModule } from '~modules/assets';
import { DataModule } from '~modules/data';

@Module({
	controllers: [SpacesController],
	imports: [
		DataModule,
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				// TODO remove debug
				const config = configService.get('multerOptions');
				console.log('MULTER CONFIG: ', config);
				return configService.get('multerOptions');
			},
			inject: [ConfigService],
		}),
		AssetsModule,
	],
	providers: [SpacesService],
	exports: [SpacesService],
})
export class SpacesModule {}
