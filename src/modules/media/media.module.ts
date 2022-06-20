import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

import { PlayerTicketModule } from '~modules/admin/player-ticket/player-ticket.module';
import { DataModule } from '~modules/data';
import { EventsModule } from '~modules/events';
import { TranslationsModule } from '~modules/translations';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [MediaController],
	imports: [
		ConfigModule,
		DataModule,
		PlayerTicketModule,
		EventsModule,
		VisitsModule,
		TranslationsModule,
	],
	providers: [MediaService],
	exports: [MediaService],
})
export class MediaModule {}
