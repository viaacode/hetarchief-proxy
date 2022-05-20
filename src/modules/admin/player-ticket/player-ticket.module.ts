import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlayerTicketService } from './services/player-ticket.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [],
	imports: [forwardRef(() => DataModule), ConfigModule, CacheModule.register()],
	providers: [PlayerTicketService],
	exports: [PlayerTicketService],
})
export class PlayerTicketModule {}
