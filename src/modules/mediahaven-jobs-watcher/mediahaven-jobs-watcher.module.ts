import { DataModule, MediahavenModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaterialRequestsModule } from '~modules/material-requests';
import { MediahavenJobsWatcherController } from '~modules/mediahaven-jobs-watcher/controllers/mediahaven-jobs-watcher.controller';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';

@Module({
	controllers: [MediahavenJobsWatcherController],
	providers: [MediahavenJobsWatcherService],
	imports: [MaterialRequestsModule, ConfigModule, DataModule, MediahavenModule],
	exports: [MediahavenJobsWatcherService],
})
export class MediahavenJobsWatcherModule {}
