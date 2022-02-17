import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';

import { CreateNavigationDto, NavigationsQueryDto } from '../dto/navigations.dto';
import { NavigationsService } from '../services/navigations.service';
import { Navigation } from '../types';

import { DeleteResponse } from '~shared/types/types';

@ApiTags('Navigations')
@Controller('admin/navigations')
export class NavigationsController {
	private logger: Logger = new Logger(NavigationsController.name, { timestamp: true });

	constructor(private navigationsService: NavigationsService) {}

	@Get()
	public async getNavigations(
		@Query() navigationsQueryDto: NavigationsQueryDto
	): Promise<IPagination<Navigation>> {
		const navigations = await this.navigationsService.findAll(navigationsQueryDto);
		return navigations;
	}

	@Get(':id')
	public async getNavigation(@Param('id') id: string): Promise<Navigation> {
		const navigations = await this.navigationsService.findById(id);
		return navigations;
	}

	@Post()
	public async createNavigation(
		@Body() createNavigationDto: CreateNavigationDto
	): Promise<Navigation> {
		const navigation = await this.navigationsService.create(createNavigationDto);
		return navigation;
	}

	@Put(':id')
	public async updateNavigation(
		@Param('id') id: string,
		@Body() updateNavigationDto: CreateNavigationDto
	): Promise<Navigation> {
		const navigation = await this.navigationsService.update(id, updateNavigationDto);
		return navigation;
	}

	@Delete(':id')
	public async deleteNavigation(@Param('id') id: string): Promise<DeleteResponse> {
		const deleted = await this.navigationsService.delete(id);
		return deleted;
	}
}
