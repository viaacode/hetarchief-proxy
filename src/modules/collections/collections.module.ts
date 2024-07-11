import { AdminTranslationsModule, DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [CollectionsController],
	imports: [
		forwardRef(() => DataModule),
		PlayerTicketModule,
		IeObjectsModule,
		EventsModule,
		VisitsModule,
		ConfigModule,
		AdminTranslationsModule,
	],
	providers: [CollectionsService, CampaignMonitorService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
