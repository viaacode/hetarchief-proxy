import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	Min,
} from 'class-validator';
import { SortDirection } from '~shared/types';
import { ThemeIeObjectOrderProp, ThemeOrderProp } from '../themes.types';

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
		description: 'The header image URL of the theme (set automatically when a file is uploaded)',
		example: 'https://example.com/image.jpg',
	})
	imageUrl?: string | null;
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
	@IsUrl()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme',
		example: 'https://example.com/image.jpg',
	})
	imageUrl?: string | null;
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

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme',
	})
	imageUrl: string | null;
}

export class ThemeIeObjectLinkResponseDto {
	@ApiProperty({ type: String, description: 'The id of the link entry' })
	id: string;

	@ApiProperty({ type: String, description: 'The id of the theme' })
	themeId: string;

	@ApiProperty({ type: String, description: 'The intellectual entity id' })
	intellectualEntityId: string;
}

export class ThemesQueryDto {
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

	@IsEnum(SortDirection)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in',
		default: SortDirection.asc,
		enum: SortDirection,
	})
	orderDirection? = SortDirection.asc;
}

export class ThemeIeObjectsQueryDto {
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

	@IsEnum(ThemeIeObjectOrderProp)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Property to sort the results by',
		default: ThemeIeObjectOrderProp.NAME,
		enum: ThemeIeObjectOrderProp,
	})
	orderProp? = ThemeIeObjectOrderProp.NAME;

	@IsEnum(SortDirection)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in',
		default: SortDirection.asc,
		enum: SortDirection,
	})
	orderDirection? = SortDirection.asc;
}

export class IeObjectsInThemeQueryDto {
	@IsInt()
	@IsOptional()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	@ApiPropertyOptional({
		type: Number,
		description: 'The maximum number of ie-objects to return',
		default: 20,
		minimum: 1,
		maximum: 100,
	})
	limit? = 20;
}

export class IeObjectInThemeResponseDto {
	@ApiProperty({ type: String, description: 'The id of the ie-object' })
	id: string;

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

	@ApiProperty({
		type: String,
		nullable: true,
		description: 'The header image URL of the theme',
	})
	imageUrl: string | null;

	@ApiProperty({
		type: IeObjectInThemeResponseDto,
		isArray: true,
		description: 'The ie-objects linked to this theme',
	})
	ieObjects: IeObjectInThemeResponseDto[];
}
