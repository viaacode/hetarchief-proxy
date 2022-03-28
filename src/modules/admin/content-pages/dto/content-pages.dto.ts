import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import { SearchDateRange } from '~modules/admin/content-pages/content-pages.types';
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
	@Transform((contentTypes) => {
		if (typeof contentTypes.value == 'string') {
			return contentTypes.value.split(',');
		}
		return contentTypes.value;
	})
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by content type',
		required: false,
		example: ['PAGINA'],
	})
	contentTypes?: string[];

	@IsArray()
	@IsOptional()
	@Transform((contentTypes) => {
		if (typeof contentTypes.value == 'string') {
			return contentTypes.value.split(',');
		}
		return contentTypes.value;
	})
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the content pages by their owner profile ids',
		required: false,
		example: ['69ccef3b-751a-4be4-95bc-5ef365fbd504'],
	})
	userProfileIds?: string[];

	@IsArray()
	@IsOptional()
	@Transform((contentTypes) => {
		if (typeof contentTypes.value == 'string') {
			return contentTypes.value.split(',');
		}
		return contentTypes.value;
	})
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
	@Transform((contentTypes) => {
		if (typeof contentTypes.value == 'string') {
			return contentTypes.value.split(',');
		}
		return contentTypes.value;
	})
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
	@Transform((contentTypes) => {
		if (typeof contentTypes.value == 'string') {
			return contentTypes.value.split(',');
		}
		return contentTypes.value;
	})
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
	orderProp? = 'schema_maintainer.schema_name';

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
