import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PlayerTicketService } from './services/player-ticket.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [],
	imports: [DataModule, ConfigService],
	providers: [PlayerTicketService, ConfigService],
	exports: [PlayerTicketService],
})
export class PlayerTicketModule {}
