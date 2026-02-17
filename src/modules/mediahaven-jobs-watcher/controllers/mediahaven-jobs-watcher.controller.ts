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

	/**
	 * Will check mediahaven for jobs matching material requests and update the download statuses / restart jobs if needed
	 * Should be triggered every 5 minutes
	 */
	@Post('download-statuses')
	@ApiOperation({
		description: 'trigger the poller to check for Mediahaven jobs that have changed state',
	})
	@UseGuards(ApiKeyGuard)
	public async checkMediahavenJobsStatuses(): Promise<{ message: 'checking' }> {
		try {
			this.mediahavenJobsWatcherService
				.checkUnresolvedJobs()
				.then(noop)
				.catch((err) => {
					console.log(
						new CustomError(
							'Error during checkMediahavenJobsStatuses => checkUnresolvedJobs cron',
							err
						)
					);
				});
			return { message: 'checking' };
		} catch (err) {
			throw new CustomError('Error checking Mediahaven jobs statuses', err);
		}
	}

	/**
	 * Will check mediahaven for downloads that are about to expire and send a warning email to the user
	 * Should be triggered once every day
	 */
	@Post('download-expiry')
	@ApiOperation({
		description: 'trigger the poller to check for Mediahaven jobs that have changed state',
	})
	@UseGuards(ApiKeyGuard)
	public async checkDownloadExpiry(): Promise<{ message: 'checking' }> {
		try {
			this.mediahavenJobsWatcherService
				.checkAlmostExpiredDownloads()
				.then(noop)
				.catch((err) => {
					console.log(
						new CustomError(
							'Error during checkMediahavenJobsStatuses => checkAlmostExpiredDownloads cron',
							err
						)
					);
				});
			return { message: 'checking' };
		} catch (err) {
			throw new CustomError('Error checking Mediahaven download expiry', err);
		}
	}
}
