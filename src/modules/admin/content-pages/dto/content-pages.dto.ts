import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import { Lookup_App_Content_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { SearchDateRange } from '~modules/admin/content-pages/content-pages.types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';

export class ContentPageFiltersDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The text to search for in the title, description and abstract of the media items.',
		default: '',
	})
	query?: string;

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description:
			'Filter the content pages by content type. Possible options: ' +
			Object.values(Lookup_App_Content_Type_Enum).join(', '),
		required: false,
		example: [Lookup_App_Content_Type_Enum.Pagina],
	})
	contentTypes?: string[];

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their owner profile ids',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	userProfileIds?: string[];

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by the owner user group id',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	userGroupIds?: string[];

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their creation date',
		required: false,
		example: { gte: '2021-12-30T23:00:00.000Z' },
	})
	createdAt?: SearchDateRange;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their modification date',
		required: false,
		example: { gte: '2021-12-30T23:00:00.000Z' },
	})
	updatedAt?: SearchDateRange;

	@IsBoolean()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their published status',
		required: false,
		example: { gte: '2021-12-30T23:00:00.000Z' },
	})
	isPublic?: boolean;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their publish date',
		required: false,
		example: { gte: '2021-12-30T23:00:00.000Z' },
	})
	publishedAt?: SearchDateRange;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their publishAt date',
		required: false,
		example: { gte: '2021-12-30T23:00:00.000Z' },
	})
	publishAt?: SearchDateRange;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their depublishAt date',
		required: false,
		example: { gte: '2021-12-30T23:00:00.000Z' },
	})
	depublishAt?: SearchDateRange;

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their label ids',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	labelIds?: string[];
}

export class ContentPagesQueryDto {
	@IsObject()
	@Type(() => ContentPageFiltersDto)
	@IsOptional()
	@ApiPropertyOptional({
		type: ContentPageFiltersDto,
		description: 'Filters to specify which content pages you want to receive',
		default: undefined,
	})
	filters? = undefined;

	@IsBoolean()
	@Type(() => Boolean)
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Also include the content blocks for each page',
		default: false,
	})
	withBlocks? = false;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 1',
		default: 1,
	})
	page? = 1;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 10,
	})
	size? = 10;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'title_lower',
		enum: [
			'id',
			'title',
			'title_lower',
			'description',
			'is_public',
			'publish_at',
			'depublish_at',
			'created_at',
			'updated_at',
			'is_protected',
			'content_type',
			'user_profile_id',
			'path',
			'user_group_ids',
			'content_width',
			'thumbnail_path',
			'header_path',
			'seo_title',
			'seo_description',
			'seo_keywords',
			'published_at',
			'meta_description',
			'updated_by_profile_id',
			'is_deleted',
			'seo_image_path',
		],
	})
	orderProp? = 'title_lower';

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.asc,
		enum: SortDirection,
	})
	orderDirection? = SortDirection.asc;
}

export class ContentPageOverviewParams {
	@IsBoolean()
	@Type(() => Boolean)
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Also include the content blocks for each page',
		default: false,
	})
	withBlock? = false;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'Type of the content pages you want to fetch. eg: PAGINA, FAQ_ITEM, ...',
		example: 'FAQ_ITEM',
	})
	contentType: string;

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description:
			'Visible tabs in the page overview component for which we should fetch item counts',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	labelIds?: string[];

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Selected tabs for which we should fetch content page items',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	selectedLabelIds?: string[];

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'title_lower',
		enum: [
			'id',
			'title',
			'description',
			'is_public',
			'publish_at',
			'depublish_at',
			'created_at',
			'updated_at',
			'is_protected',
			'content_type',
			'user_profile_id',
			'path',
			'user_group_ids',
			'content_width',
			'thumbnail_path',
			'header_path',
			'seo_title',
			'seo_description',
			'seo_keywords',
			'published_at',
			'meta_description',
			'updated_by_profile_id',
			'is_deleted',
			'seo_image_path',
		],
	})
	orderProp? = 'title';

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.asc,
		enum: SortDirection,
	})
	orderDirection? = SortDirection.asc;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 1',
		default: 1,
	})
	page? = 1;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 10,
	})
	size? = 10;
}
