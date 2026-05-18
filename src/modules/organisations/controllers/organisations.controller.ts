import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Organisation, OrganisationSlug } from '~modules/organisations/organisations.types';

import { IPagination } from '@studiohyperdrive/pagination';
import {
	OrganisationSlugQueryDto,
	UpdateOrganisationSlugDto,
} from '~modules/organisations/dto/organisations.dto';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { IsMeemooAdminGuard } from '~shared/guards/is-meemoo-admin.guard';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@ApiTags('Organisations')
@Controller('organisations')
export class OrganisationsController {
	constructor(private organisationsService: OrganisationsService) {}

	@Get('maintainer-grid')
	public async fetchOrganisationsForMaintainerGrid(@Query('limit') limit: number): Promise<any> {
		return this.organisationsService.fetchRandomContentPartnersForMaintainerGrid(limit);
	}

	@Get('slugs')
	@UseGuards(LoggedInGuard, IsMeemooAdminGuard)
	public async getOrganisationSlugs(
		@Query() queryDto: OrganisationSlugQueryDto
	): Promise<IPagination<OrganisationSlug>> {
		return this.organisationsService.findAll(queryDto);
	}

	@Patch(':orgIdentifier')
	async updateOrganisationSlug(
		@Param('orgIdentifier') orgIdentifier: string,
		@Body() updateOrganisationSlugDto: UpdateOrganisationSlugDto
	): Promise<OrganisationSlug | undefined> {
		if (!orgIdentifier || !updateOrganisationSlugDto.slug) {
			throw new BadRequestException(`Organisation slug (${orgIdentifier}) could not be updated.`);
		}

		return this.organisationsService.updateOrganisationSlug(
			orgIdentifier,
			updateOrganisationSlugDto.slug
		);
	}

	@Get(':slug')
	async getOrganisationBySlug(@Param('slug') slug: string): Promise<Organisation | null> {
		return this.organisationsService.findOrganisationBySlug(slug);
	}
}
