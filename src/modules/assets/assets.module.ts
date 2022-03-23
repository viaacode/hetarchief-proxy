import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AssetsService } from './services/assets.service';

import { DataModule } from '~modules/data';

@Module({
	imports: [DataModule, ConfigModule],
	providers: [AssetsService],
	exports: [AssetsService],
})
export class AssetsModule {}
