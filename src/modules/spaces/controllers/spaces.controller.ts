import {
	Controller,
	Get,
	Logger,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { SpacesQueryDto } from '../dto/spaces.dto';
import { SpacesService } from '../services/spaces.service';
import { Space } from '../types';

import { SessionUser } from '~shared/decorators/user.decorator';
import i18n from '~shared/i18n';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(private spacesService: SpacesService) {}

	@Get()
	public async getSpaces(
		@Query() queryDto: SpacesQueryDto,
		@SessionUser() user
	): Promise<IPagination<Space>> {
		const spaces = await this.spacesService.findAll(queryDto, user?.id);
		return spaces;
	}

	@Get(':id')
	public async getSpaceById(@Param('id', ParseUUIDPipe) id: string): Promise<Space | null> {
		const space = await this.spacesService.findById(id);
		if (!space) {
			throw new NotFoundException(i18n.t(`Space with id ${id} not found`));
		}
		return space;
	}
}
