import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { noop } from 'lodash';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';
import { MaterialRequestsService } from '../services/material-requests.service';

@ApiTags('MaterialRequestsScheduling')
@Controller('material-requests')
export class MaterialRequestsSchedulingController {
	constructor(private materialRequestsService: MaterialRequestsService) {}

	/**
	 * Will check if there are any material requests ready for archivation
	 * Should be triggered once every day
	 */
	@Post('archivation')
	@ApiOperation({
		description: 'trigger the poller to check for material requests that can be archived',
	})
	@UseGuards(ApiKeyGuard)
	public async checkMaterialRequestsForArchivation(): Promise<{ message: 'checking' }> {
		try {
			this.materialRequestsService
				.checkAllReadyForArchivation()
				.then(noop)
				.catch((err) => {
					console.error(
						new CustomError(
							'Error during checkMaterialRequestsForArchivation => checkAllReadyForArchivation cron',
							err
						)
					);
				});
			return { message: 'checking' };
		} catch (err) {
			throw new CustomError('Error checking material requests Archivation', err);
		}
	}

	/**
	 * Will send a reminder email when additional conditions were added to a material request, but the requester has not yet accepted or declined them within 30 days.
	 * This endpoint will be triggered by a cron job trigger in the hasura database
	 */
	@UseGuards(ApiKeyGuard)
	@ApiOperation({
		description:
			'Will send a reminder email when additional conditions were added to a material request, but the requester has not yet accepted or declined them within 30 days.',
	})
	@Post('send-reminders-for-material-request-additional-conditions')
	public async sendRemindersForAdditionalConditions(): Promise<{ message: string }> {
		this.materialRequestsService
			.sendReminderForMaterialRequestsWithPendingAdditionalConditions()
			.then(noop)
			.catch((err) => {
				console.error(
					new CustomError('Failed to send additional conditions reminder emails', err, {})
				);
			});
		return {
			message: 'Checking reminders for pending additional conditions for material requests',
		};
	}
}
