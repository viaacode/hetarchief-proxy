import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Logger,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { CreateSpaceDto, SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { SpacesService } from '../services/spaces.service';
import { Space } from '../types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import { AssetsService } from '~modules/assets/services/assets.service';
import { AssetFileType } from '~modules/assets/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import i18n from '~shared/i18n';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(private spacesService: SpacesService, private assetsService: AssetsService) {}

	@Get()
	@ApiOperation({
		description: 'Get a list of spaces',
	})
	public async getSpaces(
		@Query() queryDto: SpacesQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Space>> {
		// status filter on inactive requires special permission
		if (
			queryDto.status &&
			(queryDto.status.includes(VisitorSpaceStatus.Inactive) ||
				queryDto.status.includes(VisitorSpaceStatus.Requested)) &&
			!user.has(Permission.READ_ALL_SPACES)
		) {
			const error = new ForbiddenException(
				i18n.t(
					'modules/spaces/controllers/spaces___you-do-not-have-the-right-permissions-to-query-this-data'
				)
			);
			throw error;
		}
		if (!queryDto.status && !user.has(Permission.READ_ALL_SPACES)) {
			// If someone requests all spaces but doesn't have access to all spaces, we only return the active spaces
			queryDto.status = [VisitorSpaceStatus.Active];
		}
		const spaces = await this.spacesService.findAll(queryDto, user.getId());
		return spaces;
	}

	@Get(':slug')
	@ApiOperation({
		description: 'Get a space by slug',
	})
	public async getSpaceBySlug(@Param('slug') slug: string): Promise<Space | null> {
		const space = await this.spacesService.findBySlug(slug);
		if (!space) {
			throw new NotFoundException(i18n.t(`Space with slug "${slug}" not found`));
		}
		return space;
	}

	@Patch(':id')
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		description: 'Update a space',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
				slug: { type: 'string' },
				description: { type: 'string' },
				serviceDescription: { type: 'string' },
				color: { type: 'string' },
				image: { type: 'string' },
				status: { type: 'string' },
			},
		},
	})
	@RequireAnyPermissions(Permission.UPDATE_OWN_SPACE, Permission.UPDATE_ALL_SPACES)
	public async updateSpace(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateSpaceDto: UpdateSpaceDto,
		@UploadedFile() file: Express.Multer.File,
		@SessionUser() user: SessionUserEntity
	): Promise<Space> {
		const space = await this.spacesService.findById(id);
		if (
			user.has(Permission.UPDATE_OWN_SPACE) &&
			user.hasNot(Permission.UPDATE_ALL_SPACES) &&
			user.getMaintainerId() !== space.maintainerId
		) {
			throw new ForbiddenException('You are not authorized to update this visitor space');
		}

		if (updateSpaceDto.slug && user.hasNot(Permission.UPDATE_ALL_SPACES)) {
			throw new ForbiddenException('You are not allowed to update the slug');
		}

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

		return this.spacesService.update(id, updateSpaceDto);
	}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		description: 'Update a space',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				orId: { type: 'string' },
				slug: { type: 'string' },
				file: {
					type: 'string',
					format: 'binary',
				},
				description: { type: 'string' },
				serviceDescription: { type: 'string' },
				color: { type: 'string' },
				image: { type: 'string' },
				status: { type: 'string' },
			},
		},
	})
	@RequireAllPermissions(Permission.CREATE_SPACES)
	public async createSpace(
		@Body() createSpaceDto: CreateSpaceDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<Space> {
		// create dto is inherited from update, and conflicts with slug: required here, optional in update
		if (!createSpaceDto.slug) {
			// same error as other validation errors
			throw new BadRequestException(['slug must be a string']);
		}

		if (file) {
			createSpaceDto.image = await this.assetsService.upload(AssetFileType.SPACE_IMAGE, file);
		}
		// Space is always created with 'REQUESTED' status
		createSpaceDto.status = VisitorSpaceStatus.Requested;

		return this.spacesService.create(createSpaceDto);
	}
}
