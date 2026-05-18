import { AssetsModule, DataModule, VideoStillsModule } from '@meemoo/admin-core-api';
import { Module, forwardRef } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { MaterialRequestMessagesModule } from '~modules/material-request-messages';
import { MaterialRequestsSchedulingController } from '~modules/material-requests/controllers/material-requests-scheduling.controller';
import { MediahavenJobsWatcherModule } from '~modules/mediahaven-jobs-watcher/mediahaven-jobs-watcher.module';
import { NotificationsModule } from '~modules/notifications';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { UsersModule } from '~modules/users';

@Module({
	controllers: [MaterialRequestsController, MaterialRequestsSchedulingController],
	providers: [MaterialRequestsService],
	imports: [
		ConfigModule,
		DataModule,
		NotificationsModule,
		OrganisationsModule,
		EventsModule,
		SpacesModule,
		IeObjectsModule,
		VideoStillsModule,
		MediahavenJobsWatcherModule,
		UsersModule,
		AssetsModule,
		forwardRef(() => MaterialRequestMessagesModule),
	],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
