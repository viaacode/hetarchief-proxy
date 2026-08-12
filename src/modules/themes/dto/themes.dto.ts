import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	IsUrl,
	Min,
} from 'class-validator';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirectionWithRandom } from '~shared/types';
import { AddIeObjectToThemeResult, ThemeIeObjectOrderProp, ThemeOrderProp } from '../themes.types';

export class CreateThemeDto {
	@IsString()
	@ApiProperty({ type: String, description: 'The slug of the theme', example: 'culture-society' })
	slug: string;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The Dutch name of the theme',
		example: 'Cultuur & samenleving',
	})
	nameNl: string;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The English name of the theme',
		example: 'Culture & society',
	})
	nameEn: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The Dutch description of the theme',
		example: 'Een collectie over cultuur en samenleving',
	})
	descriptionNl?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The English description of the theme',
		example: 'A collection about culture and society',
	})
	descriptionEn?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme (set automatically when a file is uploaded)',
		example: 'https://example.com/image.jpg',
	})
	imageUrl?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The Dutch content page path of the theme',
		example: '/themas/cultuur-samenleving',
	})
	contentPagePathNl?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The English content page path of the theme',
		example: '/themes/culture-society',
	})
	contentPagePathEn?: string | null;
}

export class UpdateThemeDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The slug of the theme',
		example: 'culture-society',
	})
	slug?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The Dutch name of the theme',
		example: 'Cultuur en samenleving',
	})
	nameNl?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The English name of the theme',
		example: 'Culture & society',
	})
	nameEn?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The Dutch description of the theme',
		example: 'Een collectie over cultuur en samenleving',
	})
	descriptionNl?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The English description of the theme',
		example: 'A collection about culture and society',
	})
	descriptionEn?: string | null;

	@IsString()
	@IsUrl()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme',
		example: 'https://example.com/image.jpg',
	})
	imageUrl?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The Dutch content page path of the theme',
		example: '/themas/cultuur-samenleving',
	})
	contentPagePathNl?: string | null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The English content page path of the theme',
		example: '/themes/culture-society',
	})
	contentPagePathEn?: string | null;
}

export class AddIeObjectsToThemeDto {
	@IsArray()
	@IsString({ each: true })
	@ApiProperty({
		type: [String],
		description: 'The schema identifiers (ie-object ids) to link to the theme',
		example: ['id-1', 'id-2', 'id-3'],
	})
	ieObjectSchemaIdentifiers: string[];
}

export class ThemeResponseDto {
	@ApiProperty({ type: String, description: 'The id of the theme' })
	id: string;

	@ApiProperty({ type: String, description: 'The slug of the theme' })
	slug: string;

	@ApiProperty({ type: String, description: 'The Dutch name of the theme' })
	nameNl: string;

	@ApiProperty({ type: String, description: 'The English name of the theme' })
	nameEn: string;

	@ApiProperty({ type: String, nullable: true, description: 'The Dutch description of the theme' })
	descriptionNl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The English description of the theme',
	})
	descriptionEn: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme',
	})
	imageUrl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The Dutch content page path of the theme',
	})
	contentPagePathNl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The English content page path of the theme',
	})
	contentPagePathEn: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description:
			'When the theme was last updated. Is null when the theme comes from the random order view, which does not expose it',
	})
	updatedAt: string | null;
}

export class ThemeIeObjectLinkResponseDto {
	@ApiProperty({ type: String, description: 'The id of the link entry' })
	id: string;

	@ApiProperty({ type: String, description: 'The id of the theme' })
	themeId: string;

	@ApiProperty({ type: String, description: 'The intellectual entity id' })
	intellectualEntityId: string;
}

export class AddIeObjectToThemeResultDto {
	@ApiProperty({
		type: String,
		description: 'The schema identifier that was submitted',
		example: 'qsnk362q84',
	})
	schemaIdentifier: string;

	@ApiProperty({
		enum: AddIeObjectToThemeResult,
		description:
			'What happened to this schema identifier. Reported per submitted identifier, in the order they were submitted',
		example: AddIeObjectToThemeResult.ADDED,
	})
	result: AddIeObjectToThemeResult;
}

export class ThemesQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Search term to filter themes by name (Dutch or English)',
		example: 'cultuur',
	})
	searchTerm?: string;

	@IsNumber()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 0',
		default: 0,
	})
	page? = 0;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 20,
	})
	size? = 20;

	@IsEnum(ThemeOrderProp)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Property to sort the results by',
		default: ThemeOrderProp.NAME_NL,
		enum: ThemeOrderProp,
	})
	orderProp? = ThemeOrderProp.NAME_NL;

	@IsEnum(SortDirectionWithRandom)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'Direction to sort in or random order. If random order is specified, the orderProp will be ignored',
		default: SortDirectionWithRandom.asc,
		enum: SortDirectionWithRandom,
	})
	orderDirection? = SortDirectionWithRandom.asc;
}

export class ThemesByIdsQueryDto {
	@IsArray()
	@IsUUID('4', { each: true })
	@Transform(commaSeparatedStringToArray)
	@ApiProperty({
		type: String,
		description: 'Comma separated list of theme UUIDs to fetch',
		example: '00000000-0000-0000-0000-000000000001,00000000-0000-0000-0000-000000000002',
	})
	ids: string[];
}

export class ThemeIeObjectsQueryDto {
	@IsNumber()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Which page of ie-objects under this theme to fetch. Counting starts at 0',
		default: 0,
	})
	page? = 0;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of ie-objects under this theme to return',
		default: 20,
	})
	size? = 20;

	@IsEnum(ThemeIeObjectOrderProp)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Property to sort the ie-objects by',
		default: ThemeIeObjectOrderProp.NAME,
		enum: ThemeIeObjectOrderProp,
	})
	orderProp? = ThemeIeObjectOrderProp.NAME;

	@IsEnum(SortDirectionWithRandom)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'Direction to sort the ie-objects in or random order. if random order is specified, the orderProp will be ignored',
		default: SortDirectionWithRandom.asc,
		enum: SortDirectionWithRandom,
	})
	orderDirection? = SortDirectionWithRandom.asc;

	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Whether or not the thumbnail url should be resolved',
		default: undefined,
	})
	resolveThumbnailUrl? = false;
}

export class IeObjectInThemeResponseDto {
	@ApiProperty({
		type: String,
		description: 'The intellectual entity id (uri) of the ie-object',
	})
	id: string;

	@ApiProperty({
		type: String,
		nullable: true,
		description:
			'The schema identifier of the ie-object. This is the identifier used to link and unlink objects',
		example: 'qsnk362q84',
	})
	schemaIdentifier: string | null;

	@ApiProperty({ type: String, nullable: true, description: 'The name of the ie-object' })
	name: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The media format (e.g. video, audio, image)',
	})
	format: string | null;

	@ApiProperty({ type: String, nullable: true, description: 'Thumbnail URL of the ie-object' })
	thumbnailUrl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The or-id of the maintaining organisation',
	})
	maintainerId: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The display name of the maintaining organisation',
	})
	maintainerName: string | null;
}

export class IeObjectsInThemeResponseDto {
	@ApiProperty({ type: String, description: 'The id of the theme' })
	id: string;

	@ApiProperty({ type: String, description: 'The slug of the theme' })
	slug: string;

	@ApiProperty({ type: String, description: 'The Dutch name of the theme' })
	nameNl: string;

	@ApiProperty({ type: String, description: 'The English name of the theme' })
	nameEn: string;

	@ApiProperty({ type: String, nullable: true, description: 'The Dutch description of the theme' })
	descriptionNl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The English description of the theme',
	})
	descriptionEn: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme',
	})
	imageUrl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The Dutch content page path of the theme',
	})
	contentPagePathNl: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The English content page path of the theme',
	})
	contentPagePathEn: string | null;

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'When the theme was last updated',
	})
	updatedAt: string | null;

	@ApiProperty({
		type: IeObjectInThemeResponseDto,
		isArray: true,
		description: 'The ie-objects linked to this theme',
	})
	ieObjects: IeObjectInThemeResponseDto[];

	@ApiPropertyOptional({
		type: Number,
		description: 'The total ie-objects linked to this theme. Is null if random order is specified',
	})
	total: number | null;
}
