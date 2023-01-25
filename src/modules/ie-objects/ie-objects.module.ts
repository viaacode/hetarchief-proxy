import { DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IeObjectsController } from './controllers/ie-objects.controller';
import { IeObjectsService } from './services/ie-objects.service';

import { TranslationsModule } from '~modules/translations';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [IeObjectsController],
	imports: [ConfigModule, DataModule, PlayerTicketModule, VisitsModule, TranslationsModule],
	providers: [IeObjectsService],
	exports: [IeObjectsService],
})
export class IeObjectsModule {}
