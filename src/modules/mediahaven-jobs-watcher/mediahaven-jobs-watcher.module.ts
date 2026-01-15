import { Module } from '@nestjs/common';
import { MaterialRequestsModule } from '~modules/material-requests';
import { MediahavenJobsWatcherController } from '~modules/mediahaven-jobs-watcher/controllers/mediahaven-jobs-watcher.controller';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';

@Module({
	controllers: [MediahavenJobsWatcherController],
	providers: [MediahavenJobsWatcherService],
	imports: [MaterialRequestsModule],
	exports: [MediahavenJobsWatcherService],
})
export class MediahavenJobsWatcherModule {}
