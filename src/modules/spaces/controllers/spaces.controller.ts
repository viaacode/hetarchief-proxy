import { AssetsService, TranslationsService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	GoneException,
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
import { type IPagination } from '@studiohyperdrive/pagination';
import { AssetType } from '@viaa/avo2-types';
import { uniqBy } from 'lodash';

import { CreateSpaceDto, SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { SpacesService } from '../services/spaces.service';
import { type VisitorSpace } from '../types';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName, Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { VisitorSpaceStatus } from '~shared/types/types';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
	constructor(
		private spacesService: SpacesService,
		private assetsService: AssetsService,
		private translationsService: TranslationsService
	) {}

	@Get()
	@ApiOperation({
		description: 'Get a list of spaces',
	})
	public async getSpaces(
		@Query() queryDto: SpacesQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<VisitorSpace>> {
		// status filter on inactive requires special permission
		if (
			queryDto.status &&
			(queryDto.status.includes(VisitorSpaceStatus.Inactive) ||
				queryDto.status.includes(VisitorSpaceStatus.Requested)) &&
			!user.has(Permission.READ_ALL_SPACES)
		) {
			throw new ForbiddenException(
				this.translationsService.tText(
					'modules/spaces/controllers/spaces___you-do-not-have-the-right-permissions-to-query-this-data',
					null,
					user.getLanguage()
				)
			);
		}
		if (!queryDto.status && !user.has(Permission.READ_ALL_SPACES)) {
			// If someone requests all spaces but doesn't have access to all spaces, we only return the active spaces
			queryDto.status = [VisitorSpaceStatus.Active];
		}
		const spaces = await this.spacesService.findAll(queryDto, user.getId());

		// CP ADMINS always have access to their own space
		if (user.getGroupName() === GroupName.CP_ADMIN) {
			const ownSpace = await this.spacesService.findSpaceByOrganisationId(
				user.getOrganisationId()
			);
			if (ownSpace) {
				spaces.items = uniqBy([...spaces.items, ownSpace], (space) => space.id);
			}
		}

		return spaces;
	}

	@Get(':slug')
	@ApiOperation({
		description: 'Get a space by slug',
	})
	public async getSpaceBySlug(
		@Param('slug') slug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitorSpace | null> {
		const space = await this.spacesService.findBySlug(slug);
		if (!space) {
			throw new NotFoundException(
				this.translationsService.tText(
					'modules/spaces/controllers/spaces___space-with-slug-slug-not-found',
					{
						slug,
					},
					user.getLanguage()
				)
			);
		}
		if (
			space.status === VisitorSpaceStatus.Inactive &&
			!user.has(Permission.UPDATE_ALL_SPACES)
		) {
			throw new GoneException(`Space with slug "${slug}" is inactive`);
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
				descriptionNl: { type: 'string' },
				serviceDescriptionNl: { type: 'string' },
				descriptionEn: { type: 'string' },
				serviceDescriptionEn: { type: 'string' },
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
	): Promise<VisitorSpace> {
		const visitorSpace = await this.spacesService.findById(id);
		if (
			user.has(Permission.UPDATE_OWN_SPACE) &&
			user.hasNot(Permission.UPDATE_ALL_SPACES) &&
			user.getOrganisationId() !== visitorSpace.maintainerId
		) {
			throw new ForbiddenException('You are not authorized to update this visitorSpace');
		}

		if (updateSpaceDto.slug && user.hasNot(Permission.UPDATE_ALL_SPACES)) {
			throw new ForbiddenException('You are not allowed to update the slug');
		}

		if (file) {
			updateSpaceDto.image = await this.assetsService.uploadAndTrack(
				AssetType.SPACE_IMAGE,
				file,
				visitorSpace.maintainerId
			);
			if (visitorSpace.image) {
				// visitorSpace already has an image: delete existing one
				await this.assetsService.delete(visitorSpace.image);
			}
		} else if (visitorSpace.image && updateSpaceDto.image === '') {
			// image is empty: delete current image
			await this.assetsService.delete(visitorSpace.image);
		}

		return this.spacesService.update(id, updateSpaceDto, user.getLanguage());
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
				descriptionNl: { type: 'string' },
				serviceDescriptionNl: { type: 'string' },
				descriptionEn: { type: 'string' },
				serviceDescriptionEn: { type: 'string' },
				color: { type: 'string' },
				image: { type: 'string' },
				status: { type: 'string' },
			},
		},
	})
	@RequireAllPermissions(Permission.CREATE_SPACES)
	public async createSpace(
		@Body() createSpaceDto: CreateSpaceDto,
		@UploadedFile() file: Express.Multer.File,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitorSpace> {
		// create dto is inherited from update, and conflicts with slug: required here, optional in update
		if (!createSpaceDto.slug) {
			// same error as other validation errors
			throw new BadRequestException(['slug must be a string']);
		}

		if (file) {
			createSpaceDto.image = await this.assetsService.uploadAndTrack(
				AssetType.SPACE_IMAGE,
				file,
				createSpaceDto.orId
			);
		}
		// Space is always created with 'REQUESTED' status
		createSpaceDto.status = VisitorSpaceStatus.Requested;

		return this.spacesService.create(createSpaceDto, user.getLanguage());
	}
}
