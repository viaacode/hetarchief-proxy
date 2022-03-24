import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AssetsService } from './services/assets.service';

@Module({
	imports: [ConfigModule],
	providers: [AssetsService],
	exports: [AssetsService],
})
export class AssetsModule {}
