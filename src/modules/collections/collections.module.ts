import { Module } from '@nestjs/common';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { PlayerTicketModule } from '~modules/admin/player-ticket/player-ticket.module';
import { DataModule } from '~modules/data';
import { MediaModule } from '~modules/media';

@Module({
	controllers: [CollectionsController],
	imports: [DataModule, PlayerTicketModule, MediaModule],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
