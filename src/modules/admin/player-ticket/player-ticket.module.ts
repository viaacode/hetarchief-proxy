import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlayerTicketService } from './services/player-ticket.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [],
	imports: [DataModule, ConfigModule],
	providers: [PlayerTicketService],
	exports: [PlayerTicketService],
})
export class PlayerTicketModule {}
