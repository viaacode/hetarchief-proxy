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
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';

import {
	AddIeObjectsToThemeDto,
	CreateThemeDto,
	IeObjectsInThemeQueryDto,
	IeObjectsInThemeResponseDto,
	ThemeIeObjectLinkResponseDto,
	ThemeResponseDto,
	UpdateThemeDto,
} from '../dto/themes.dto';
import { ThemesService } from '../services/themes.service';

@ApiTags('Themes')
@Controller('themes')
export class ThemesController {
	constructor(private themesService: ThemesService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all themes',
		description: 'Returns a list of all themes ordered by Dutch name.',
	})
	@ApiOkResponse({
		description: 'Returns all themes',
		type: ThemeResponseDto,
		isArray: true,
	})
	public async getThemes(): Promise<ThemeResponseDto[]> {
		return this.themesService.getThemes();
	}

	@Post()
	@ApiOperation({
		summary: 'Create a new theme',
		description: 'Creates a new theme with the provided data.',
	})
	@ApiBody({ type: CreateThemeDto })
	@ApiCreatedResponse({
		description: 'Returns the newly created theme',
		type: ThemeResponseDto,
	})
	public async createTheme(@Body() createThemeDto: CreateThemeDto): Promise<ThemeResponseDto> {
		return this.themesService.createTheme(createThemeDto);
	}

	@Patch(':themeId')
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

	@Get(':themeIdentifier/ie-objects')
	@ApiOperation({
		summary: 'Get ie-objects linked to a theme',
		description:
			'Accepts either a UUID or a slug. When a UUID is provided the ie-objects are returned in stable insertion order. When a slug is provided a random selection is returned (use the optional `limit` query param to cap the count).',
	})
	@ApiParam({
		name: 'themeIdentifier',
		description: 'The UUID or slug of the theme',
		type: String,
		example: 'nature',
	})
	@ApiOkResponse({
		description: 'Returns the theme with its linked ie-objects',
		type: IeObjectsInThemeResponseDto,
	})
	@ApiNotFoundResponse({ description: 'Theme with the given identifier was not found' })
	public async getIeObjects(
		@Param('themeIdentifier') themeIdentifier: string,
		@Query() queryDto: IeObjectsInThemeQueryDto
	): Promise<IeObjectsInThemeResponseDto> {
		const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (UUID_PATTERN.test(themeIdentifier)) {
			return this.themesService.getIeObjectsByThemeUuid(themeIdentifier);
		}
		return this.themesService.getIeObjectsByThemeSlug(themeIdentifier, queryDto.limit);
	}

	@Post(':themeId/ie-objects')
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
