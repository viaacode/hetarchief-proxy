import { DataModule, VideoStillsModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

import { ConfigModule } from '@nestjs/config';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { MaterialRequestMessagesModule } from '~modules/material-request-messages';
import { MediahavenJobsWatcherModule } from '~modules/mediahaven-jobs-watcher/mediahaven-jobs-watcher.module';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { UsersModule } from '~modules/users';

@Module({
	controllers: [MaterialRequestsController],
	providers: [MaterialRequestsService],
	imports: [
		ConfigModule,
		DataModule,
		CampaignMonitorModule,
		OrganisationsModule,
		EventsModule,
		SpacesModule,
		IeObjectsModule,
		VideoStillsModule,
		MediahavenJobsWatcherModule,
		UsersModule,
		forwardRef(() => MaterialRequestMessagesModule),
	],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
