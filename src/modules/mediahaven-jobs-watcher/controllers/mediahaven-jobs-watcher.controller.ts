import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { noop } from 'lodash';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';

@ApiTags('MediahavenJobsWatcher')
@Controller('mediahaven-jobs-watcher')
export class MediahavenJobsWatcherController {
	constructor(private mediahavenJobsWatcherService: MediahavenJobsWatcherService) {}

	@Post()
	@ApiOperation({
		description: 'trigger the poller to check for Mediahaven jobs that have changed state',
	})
	@UseGuards(ApiKeyGuard)
	public async checkMediahavenJobsStatuses(): Promise<{ message: 'checking' }> {
		try {
			this.mediahavenJobsWatcherService
				.checkJobs()
				.then(noop)
				.catch((err) => {
					console.log(new CustomError('Error during checkMediahavenJobsStatuses cron', err));
				});
			return { message: 'checking' };
		} catch (err) {
			throw new CustomError('Error checking Mediahaven jobs statuses', err);
		}
	}
}
