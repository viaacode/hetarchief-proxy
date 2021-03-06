import { forwardRef, Module } from '@nestjs/common';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { PlayerTicketModule } from '~modules/admin/player-ticket/player-ticket.module';
import { DataModule } from '~modules/data';
import { EventsModule } from '~modules/events';
import { MediaModule } from '~modules/media';

@Module({
	controllers: [CollectionsController],
	imports: [forwardRef(() => DataModule), PlayerTicketModule, MediaModule, EventsModule],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
