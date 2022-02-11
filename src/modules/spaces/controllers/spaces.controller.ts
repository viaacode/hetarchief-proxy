import { Controller, Get, Logger, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { SpacesQueryDto } from '../dto/spaces.dto';
import { SpacesService } from '../services/spaces.service';
import { Space } from '../types';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(private spacesService: SpacesService) {}

	@Get()
	public async getSpaces(@Query() queryDto: SpacesQueryDto): Promise<IPagination<Space>> {
		const spaces = await this.spacesService.findAll(queryDto);
		return spaces;
	}

	@Get(':id')
	public async getSpaceById(@Param('id', ParseUUIDPipe) id: string): Promise<Space> {
		const space = await this.spacesService.findById(id);
		return space;
	}
}
