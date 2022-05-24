import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AssetsService } from './services/assets.service';

import { AssetsController } from '~modules/assets/controllers/assets.controller';

@Module({
	imports: [ConfigModule],
	controllers: [AssetsController],
	providers: [AssetsService],
	exports: [AssetsService],
})
export class AssetsModule {}
