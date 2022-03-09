import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [MediaController],
	imports: [ConfigModule, DataModule],
	providers: [MediaService],
})
export class MediaModule {}
