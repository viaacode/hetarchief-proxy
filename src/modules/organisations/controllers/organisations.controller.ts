import { Controller, Get, Headers, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Organisation } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { APIKEY, ApiKeyGuard } from '~shared/guards/api-key.guard';

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
		@Headers(APIKEY) apikey: string
	): Promise<{ message: string }> {
		await this.organisationsService.updateOrganisationsCache();

		return { message: 'cache has been updated successfully' };
	}

	@Get('maintainer-grid')
	public async fetchOrganisationsForMaintainerGrid(@Query('limit') limit: number): Promise<any> {
		return this.organisationsService.fetchRandomContentPartnersForMaintainerGrid(limit);
	}

	@Get(':slug')
	async getOrganisationBySlug(@Param('slug') slug: string): Promise<Organisation | null> {
		return this.organisationsService.findOrganisationBySlug(slug);
	}
}
