import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { noop } from 'lodash';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';
import { MaterialRequestsService } from '../services/material-requests.service';

@ApiTags('MaterialRequestsArchivation')
@Controller('material-requests')
export class MaterialRequestsArchivationController {
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
					console.log(
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
}
