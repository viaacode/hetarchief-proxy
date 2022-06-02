import { Controller, Headers, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import OrganisationsService from '~modules/organisations/services/organisations.service';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';

@ApiTags('Organisations')
@Controller('organisations')
export class OrganisationsController {
	private logger: Logger = new Logger(OrganisationsController.name, { timestamp: true });

	constructor(private organisationsService: OrganisationsService) {}

	@ApiOperation({
		description:
			'Fetch the latest organisation info from the organisation api and refresh the cache in the maintainer.organisation database table',
	})
	@Post('update-cache')
	@UseGuards(ApiKeyGuard)
	async getOrganisationElementsForUser(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers('apiKey') apiKey: string
	): Promise<{ message: string }> {
		await this.organisationsService.updateOrganisationsCache();

		return { message: 'cache has been updated successfully' };
	}
}
