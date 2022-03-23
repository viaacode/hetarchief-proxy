import {
	Body,
	Controller,
	Get,
	Logger,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { SpacesService } from '../services/spaces.service';
import { Space } from '../types';

import { AssetsService } from '~modules/assets/services/assets.service';
import { AssetFileType } from '~modules/assets/types';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import i18n from '~shared/i18n';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(protected spacesService: SpacesService, protected assetsService: AssetsService) {}

	@Get()
	public async getSpaces(@Query() queryDto: SpacesQueryDto): Promise<IPagination<Space>> {
		const spaces = await this.spacesService.findAll(queryDto);
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

	@Post(':id')
	@UseGuards(LoggedInGuard)
	@UseInterceptors(FileInterceptor('file'))
	public async updateSpace(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateSpaceDto: UpdateSpaceDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<Space> {
		if (file) {
			console.log(file);
			const key = await this.assetsService.upload(AssetFileType.SPACE_IMAGE, file);
			// todo save key
			this.logger.log(`Saved key: ${key}`);
		}
		const space = await this.spacesService.update(id, updateSpaceDto);
		return space;
	}
}
