import { DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ObjectsController } from './controllers/objects.controller';
import { ObjectsService } from './services/objects.service';

import { TranslationsModule } from '~modules/translations';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [ObjectsController],
	imports: [ConfigModule, DataModule, PlayerTicketModule, VisitsModule, TranslationsModule],
	providers: [ObjectsService],
	exports: [ObjectsService],
})
export class ObjectsModule {}
