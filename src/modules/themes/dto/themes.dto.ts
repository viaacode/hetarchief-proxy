import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

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
