import { DataModule, MediahavenModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaterialRequestsModule } from '~modules/material-requests';
import { UsersModule } from '~modules/users/users.module';
import { MediahavenJobsWatcherController } from '~modules/mediahaven-jobs-watcher/controllers/mediahaven-jobs-watcher.controller';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';

@Module({
	controllers: [MediahavenJobsWatcherController],
	providers: [MediahavenJobsWatcherService],
	imports: [
		forwardRef(() => MaterialRequestsModule),
		ConfigModule,
		DataModule,
		MediahavenModule,
		UsersModule,
	],
	exports: [MediahavenJobsWatcherService],
})
export class MediahavenJobsWatcherModule {}
