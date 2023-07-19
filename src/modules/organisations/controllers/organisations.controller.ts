import { Controller, Get, Headers, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Organisation } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
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
		@Headers('apikey') apikey: string
	): Promise<{ message: string }> {
		await this.organisationsService.updateOrganisationsCache();

		return { message: 'cache has been updated successfully' };
	}

	@Get(':slug')
	async getOrganisationBySchemaIdentifiers(
		@Param('slug') slug: string
	): Promise<Organisation | null> {
		return this.organisationsService.findOrganisationBySlug(slug);
	}
}
