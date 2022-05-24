import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';

import { CreateNavigationDto, NavigationsQueryDto } from '../dto/navigations.dto';
import { AdminNavigationsService } from '../services/admin-navigations.service';
import { Navigation } from '../types';

import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { DeleteResponse } from '~shared/types/types';

// TODO these routes are currently not used by the admin-core
// Currently the admin core does all navigation manipulations through the data route
// In the long term we would like to switch this to use these routes
@ApiTags('Admin Navigations')
@Controller('admin/navigations')
@RequireAnyPermissions(Permission.EDIT_NAVIGATION_BARS)
export class AdminNavigationsController {
	private logger: Logger = new Logger(AdminNavigationsController.name, { timestamp: true });

	constructor(private navigationsService: AdminNavigationsService) {}

	@ApiOperation({
		description: 'Get an overview of all the navigation bars that exist',
	})
	@Get()
	public async getNavigationBars(
		@Query() navigationsQueryDto: NavigationsQueryDto
	): Promise<IPagination<Navigation>> {
		const navigations = await this.navigationsService.findAllNavigationBars(
			navigationsQueryDto
		);
		return navigations;
	}

	@ApiOperation({
		description: 'Get one navigation element by id',
	})
	@Get(':id')
	public async getNavigationElement(@Param('id') id: string): Promise<Navigation> {
		const navigations = await this.navigationsService.findElementById(id);
		return navigations;
	}

	@ApiOperation({
		description: 'Add one navigation element to a specific navigation bar',
	})
	@Post()
	public async createNavigationElement(
		@Body() createNavigationDto: CreateNavigationDto
	): Promise<Navigation> {
		const navigation = await this.navigationsService.createElement(createNavigationDto);
		return navigation;
	}

	@ApiOperation({
		description: 'Update an existing navigation element',
	})
	@Patch(':id')
	public async updateNavigationElement(
		@Param('id') id: string,
		@Body() updateNavigationDto: CreateNavigationDto
	): Promise<Navigation> {
		const navigation = await this.navigationsService.updateElement(id, updateNavigationDto);
		return navigation;
	}

	@ApiOperation({
		description: 'Remove a navigation element. Also deleting it from its navigation bar',
	})
	@Delete(':id')
	public async deleteNavigationElement(@Param('id') id: string): Promise<DeleteResponse> {
		const deleted = await this.navigationsService.deleteElement(id);
		return deleted;
	}
}
