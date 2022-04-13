import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';

@Module({
	imports: [ConfigModule],
	controllers: [EventsController],
	providers: [EventsService],
	exports: [EventsService],
})
export class EventsModule {}
