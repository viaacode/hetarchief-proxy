import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Post,
	Put,
	Query,
	Session,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';

import { CreateNavigationDto, NavigationsQueryDto } from '../dto/navigations.dto';
import { NavigationsService } from '../services/navigations.service';
import { Navigation } from '../types';

import { SessionHelper } from '~shared/auth/session-helper';
import { DeleteResponse } from '~shared/types/types';

@ApiTags('Navigations')
@Controller('navigations')
export class NavigationsController {
	private logger: Logger = new Logger(NavigationsController.name, { timestamp: true });

	constructor(private navigationsService: NavigationsService) {}

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
		description:
			'Get navigation items for the current user (logged in or not logged in). Currently there are not yet special permission groups',
	})
	@Get('elements')
	async getNavigationElementsForUser(
		@Session() session: Record<string, any>
	): Promise<Record<string, Navigation[]>> {
		const user = SessionHelper.getArchiefUserInfo(session);
		const navigations = await this.navigationsService.getNavigationElementsForUser(user);
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
	@Put(':id')
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
