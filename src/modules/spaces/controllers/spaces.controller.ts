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
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import i18n from '~shared/i18n';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(private spacesService: SpacesService, private assetsService: AssetsService) {}

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

	@Post(':id')
	@UseGuards(LoggedInGuard)
	@UseInterceptors(FileInterceptor('file'))
	public async updateSpace(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateSpaceDto: UpdateSpaceDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<Space> {
		let space = await this.spacesService.findById(id);
		if (file) {
			updateSpaceDto.image = await this.assetsService.upload(AssetFileType.SPACE_IMAGE, file);
			if (space.image) {
				// space already has an image: delete existing one
				await this.assetsService.delete(space.image);
			}
		} else if (space.image && updateSpaceDto.image === '') {
			// image is empty: delete current image
			await this.assetsService.delete(space.image);
		}
		space = await this.spacesService.update(id, updateSpaceDto);
		return space;
	}
}
