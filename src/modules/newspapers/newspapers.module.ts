import { DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { NewspapersController } from './controllers/newspapers.controller';
import { NewspapersService } from './services/newspapers.service';

@Module({
	controllers: [NewspapersController],
	imports: [ConfigModule, DataModule, EventsModule, IeObjectsModule, PlayerTicketModule],
	providers: [NewspapersService],
	exports: [NewspapersService],
})
export class NewspapersModule {}
