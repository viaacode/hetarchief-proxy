import { AdminTranslationsModule, DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FoldersController } from './controllers/folders.controller';
import { FoldersService } from './services/folders.service';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [FoldersController],
	imports: [
		forwardRef(() => DataModule),
		PlayerTicketModule,
		IeObjectsModule,
		EventsModule,
		VisitsModule,
		ConfigModule,
		AdminTranslationsModule,
	],
	providers: [FoldersService, CampaignMonitorService],
	exports: [FoldersService],
})
export class FoldersModule {}
