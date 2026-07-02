import { Controller, Get, Param, Query } from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';

import { IeObjectsInThemeQueryDto, IeObjectsInThemeResponseDto } from '../dto/themes.dto';
import { ThemesService } from '../services/themes.service';

@ApiTags('Themes')
@Controller('themes')
export class ThemesController {
	constructor(private themesService: ThemesService) {}

	@Get(':themeSlug/ie-objects')
	@ApiOperation({
		summary: 'Get ie-objects linked to a theme by its slug',
		description:
			'Returns the theme metadata together with a random selection of linked ie-objects.',
	})
	@ApiParam({
		name: 'themeSlug',
		description: 'The slug of the theme',
		type: String,
		example: 'nature',
	})
	@ApiOkResponse({
		description: 'Returns the theme with its linked ie-objects',
		type: IeObjectsInThemeResponseDto,
	})
	@ApiNotFoundResponse({ description: 'Theme with the given slug was not found' })
	public async getIeObjectsInTheme(
		@Param('themeSlug') themeSlug: string,
		@Query() queryDto: IeObjectsInThemeQueryDto
	): Promise<IeObjectsInThemeResponseDto> {
		return this.themesService.getIeObjectsInTheme(themeSlug, queryDto.limit);
	}
}
