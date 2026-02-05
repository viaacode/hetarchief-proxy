import { DataModule, VideoStillsModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { MediahavenJobsWatcherModule } from '~modules/mediahaven-jobs-watcher/mediahaven-jobs-watcher.module';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';

@Module({
	controllers: [MaterialRequestsController],
	providers: [MaterialRequestsService],
	imports: [
		DataModule,
		CampaignMonitorModule,
		OrganisationsModule,
		EventsModule,
		SpacesModule,
		IeObjectsModule,
		VideoStillsModule,
		MediahavenJobsWatcherModule,
	],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
