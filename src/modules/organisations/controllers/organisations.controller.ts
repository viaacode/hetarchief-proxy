import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Organisation } from '~modules/organisations/organisations.types';
// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { OrganisationsService } from '~modules/organisations/services/organisations.service';

@ApiTags('Organisations')
@Controller('organisations')
export class OrganisationsController {
	constructor(private organisationsService: OrganisationsService) {}

	@Get('maintainer-grid')
	public async fetchOrganisationsForMaintainerGrid(@Query('limit') limit: number): Promise<any> {
		return this.organisationsService.fetchRandomContentPartnersForMaintainerGrid(limit);
	}

	@Get(':slug')
	async getOrganisationBySlug(@Param('slug') slug: string): Promise<Organisation | null> {
		return this.organisationsService.findOrganisationBySlug(slug);
	}
}
