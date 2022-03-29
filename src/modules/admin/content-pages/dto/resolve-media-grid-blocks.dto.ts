import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { MediaItemType } from '~modules/admin/content-pages/content-pages.types';

export class MediaItemDto {
	@ApiProperty({
		required: true,
		enum: MediaItemType,
		description: 'Show one specific item of this type',
	})
	@IsEnum(MediaItemType)
	type: MediaItemType;

	@IsString()
	@ApiProperty({
		required: true,
		description: 'The item has this id',
	})
	value: string;
}

export class MediaItemsDto {
	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({
		type: MediaItemsDto,
		description: 'Show a list of media items',
		required: false,
	})
	mediaItem: MediaItemDto;
}

export class ResolveMediaGridBlocksDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Get items based on search query (AvO only)',
		default: undefined,
		example:
			'https://onderwijs-qas.hetarchief.be/zoeken?filters=%7B%22educationLevel%22%3A%5B%22Secundair%20onderwijs%22%5D%7D',
	})
	searchQuery: string | undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Get this many items from the search query (AvO only)',
		default: undefined,
		example: '8',
	})
	searchQueryLimit: string | undefined;

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({
		type: MediaItemsDto,
		description: 'Get specific media items, collections or bundles',
		required: false,
		example: ['Aanmelden'],
	})
	mediaItems: MediaItemsDto[] | undefined;
}
