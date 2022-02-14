import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
	controllers: [MediaController],
	imports: [ConfigModule],
	providers: [MediaService],
})
export class MediaModule {}
