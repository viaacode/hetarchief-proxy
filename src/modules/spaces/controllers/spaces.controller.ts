import { Controller, Get, Logger, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { IPagination } from '@studiohyperdrive/pagination';

import { SpacesService } from '../services/spaces.service';
import { Space } from '../types';

@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(private spacesService: SpacesService) {}

	@Get()
	public async getSpaces(
		@Query('query') query: string,
		@Query('size') size: string,
		@Query('page') page: string
	): Promise<IPagination<Space>> {
		const spaces = await this.spacesService.findAll({
			query: query,
			size: size ? parseInt(size) : undefined,
			page: page ? parseInt(page) : undefined,
		});
		return spaces;
	}

	@Get(':id')
	public async getSpaceById(@Param('id', ParseUUIDPipe) id: string): Promise<Space> {
		return this.spacesService.findById(id);
	}
}
