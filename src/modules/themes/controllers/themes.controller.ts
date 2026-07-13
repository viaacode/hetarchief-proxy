import { AssetsService } from '@meemoo/admin-core-api';
import {
	Body,
	Controller,
	Delete,
	Get,
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
import {
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { AvoFileUploadAssetType } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';

import { type IPagination } from '@studiohyperdrive/pagination';
import {
	AddIeObjectsToThemeDto,
	CreateThemeDto,
	IeObjectInThemeResponseDto,
	IeObjectsInThemeResponseDto,
	ThemeIeObjectLinkResponseDto,
	ThemeIeObjectsQueryDto,
	ThemeResponseDto,
	ThemesQueryDto,
	UpdateThemeDto,
} from '../dto/themes.dto';
import { ThemesService } from '../services/themes.service';

@ApiTags('Themes')
@Controller('themes')
export class ThemesController {
	constructor(
		private themesService: ThemesService,
		private assetsService: AssetsService
	) {}

	@Get()
	@ApiOperation({
		summary: 'Get all themes',
		description: 'Returns a paginated list of themes.',
	})
	@ApiOkResponse({
		description: 'Returns a paginated list of themes',
		type: ThemeResponseDto,
		isArray: true,
	})
	public async getThemes(
		@Query() queryDto: ThemesQueryDto
	): Promise<IPagination<ThemeResponseDto>> {
		return this.themesService.getThemes(queryDto);
	}

	@Post()
	@RequireAllPermissions(PermissionName.MANAGE_IE_OBJECT_THEMES)
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		summary: 'Create a new theme',
		description: 'Creates a new theme. Optionally upload a file to set the image.',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			required: ['slug', 'nameNl', 'nameEn'],
			properties: {
				slug: { type: 'string', example: 'culture-society' },
				nameNl: { type: 'string', example: 'Cultuur & Samenleving' },
				nameEn: { type: 'string', example: 'Culture & society' },
				imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
				file: { type: 'string', format: 'binary' },
			},
		},
	})
	@ApiCreatedResponse({
		description: 'Returns the newly created theme',
		type: ThemeResponseDto,
	})
	public async createTheme(
		@Body() createThemeDto: CreateThemeDto,
		@UploadedFile() file: Express.Multer.File
	): Promise<ThemeResponseDto> {
		if (file) {
			createThemeDto.imageUrl = await this.assetsService.uploadAndTrack(
				AvoFileUploadAssetType.IE_OBJECT_THEME as any,
				file,
				createThemeDto.slug
			);
		}
		return this.themesService.createTheme(createThemeDto);
	}

	@Patch(':themeId')
	@RequireAllPermissions(PermissionName.MANAGE_IE_OBJECT_THEMES)
	@ApiOperation({
		summary: 'Update a theme',
		description: 'Partially updates a theme by its UUID.',
	})
	@ApiParam({
		name: 'themeId',
		description: 'The UUID of the theme',
		type: String,
		example: '00000000-0000-0000-0000-000000000001',
	})
	@ApiBody({ type: UpdateThemeDto })
	@ApiOkResponse({
		description: 'Returns the updated theme',
		type: ThemeResponseDto,
	})
	@ApiNotFoundResponse({ description: 'Theme with the given UUID was not found' })
	public async updateTheme(
		@Param('themeId', ParseUUIDPipe) themeId: string,
		@Body() updateThemeDto: UpdateThemeDto
	): Promise<ThemeResponseDto> {
		return this.themesService.updateTheme(themeId, updateThemeDto);
	}

	@Delete(':themeId')
	@RequireAllPermissions(PermissionName.MANAGE_IE_OBJECT_THEMES)
	@ApiOperation({
		summary: 'Delete a theme',
		description: 'Deletes a theme by its UUID.',
	})
	@ApiParam({
		name: 'themeId',
		description: 'The UUID of the theme',
		type: String,
		example: '00000000-0000-0000-0000-000000000001',
	})
	@ApiOkResponse({ description: 'Returns the deletion status', type: Object })
	@ApiNotFoundResponse({ description: 'Theme with the given UUID was not found' })
	public async deleteTheme(
		@Param('themeId', ParseUUIDPipe) themeId: string
	): Promise<{ status: string }> {
		const affectedRows = await this.themesService.deleteTheme(themeId);
		if (affectedRows > 0) {
			return { status: 'the theme has been deleted' };
		}
		throw new NotFoundException(`Theme with id '${themeId}' not found`);
	}

	@Get(':themeUuid/ie-objects')
	@ApiOperation({
		summary: 'Get theme info and their ie-objects',
		description:
			'Accepts a UUID. Ie-objects are returned paginated (orderProp supports page, size, orderProp, orderDirection).',
	})
	@ApiParam({
		name: 'themeUuid',
		description: 'The UUID of the theme',
		type: String,
		example: '8fc4fb4a-7752-4955-aa49-6ea6e91e8529',
	})
	@ApiOkResponse({
		description: 'Returns the theme with its linked ie-objects',
		type: IeObjectsInThemeResponseDto,
	})
	@ApiNotFoundResponse({ description: 'Theme with the given identifier was not found' })
	public async getIeObjects(
		@Param('themeUuid') themeUuid: string,
		@Query() queryDto: ThemeIeObjectsQueryDto
	): Promise<IeObjectsInThemeResponseDto | IPagination<IeObjectInThemeResponseDto>> {
		return this.themesService.getIeObjectsByThemeUuid(themeUuid, queryDto);
	}

	@Post(':themeId/ie-objects')
	@RequireAllPermissions(PermissionName.MANAGE_IE_OBJECT_THEMES)
	@ApiOperation({
		summary: 'Add ie-objects to a theme',
		description: 'Links one or more ie-objects (by schema identifier) to a theme.',
	})
	@ApiParam({
		name: 'themeId',
		description: 'The UUID of the theme',
		type: String,
		example: '00000000-0000-0000-0000-000000000001',
	})
	@ApiBody({ type: AddIeObjectsToThemeDto })
	@ApiCreatedResponse({
		description: 'Returns the created theme–ie-object link entries',
		type: ThemeIeObjectLinkResponseDto,
		isArray: true,
	})
	public async addIeObjectsToTheme(
		@Param('themeId', ParseUUIDPipe) themeId: string,
		@Body() dto: AddIeObjectsToThemeDto
	): Promise<ThemeIeObjectLinkResponseDto[]> {
		return this.themesService.addIeObjectsToTheme(themeId, dto.ieObjectSchemaIdentifiers);
	}

	@Delete(':themeId/ie-objects/:ieObjectId')
	@RequireAllPermissions(PermissionName.MANAGE_IE_OBJECT_THEMES)
	@ApiOperation({
		summary: 'Remove an ie-object from a theme',
		description: 'Removes the link between a theme and a specific ie-object.',
	})
	@ApiParam({
		name: 'themeId',
		description: 'The UUID of the theme',
		type: String,
		example: '00000000-0000-0000-0000-000000000001',
	})
	@ApiParam({
		name: 'ieObjectId',
		description: 'The intellectual entity id of the ie-object',
		type: String,
		example: 'ie-object-schema-identifier',
	})
	@ApiOkResponse({ description: 'Returns the deletion status', type: Object })
	@ApiNotFoundResponse({ description: 'Link not found for the given theme and ie-object' })
	public async deleteIeObjectFromTheme(
		@Param('themeId', ParseUUIDPipe) themeId: string,
		@Param('ieObjectId') ieObjectId: string
	): Promise<{ status: string }> {
		const affectedRows = await this.themesService.deleteIeObjectFromTheme(themeId, ieObjectId);
		if (affectedRows > 0) {
			return { status: 'the ie-object has been removed from the theme' };
		}
		throw new NotFoundException(
			`No link found between theme '${themeId}' and ie-object '${ieObjectId}'`
		);
	}
}
