import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { MediaFormat } from '../types';

import { SortDirection } from '~shared/types/sorting';

export class SearchFilters {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The text to search for in the title, description and abstract of the media items.',
		default: '',
	})
	query?: string;

	@IsString()
	@IsOptional()
	@IsEnum(MediaFormat)
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the results on format: video or audio',
		required: false,
		enum: MediaFormat,
	})
	format?: MediaFormat;
}

export class MediaQueryDto {
	@Type(() => SearchFilters)
	@IsOptional()
	@ValidateNested()
	@ApiPropertyOptional({
		type: SearchFilters,
		description: 'Filters to query the media items',
	})
	filters?: SearchFilters;

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

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({
		type: Array,
		description: 'The aggregates to include in the result',
		default: [],
	})
	requestedAggs?: Array<keyof SearchFilters>;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'dcterms_available',
		enum: [
			'schema_in_language',
			'dcterms_available',
			'schema_creator.Archiefvormer?',
			'schema_creator.Maker?',
			'schema_creator.productionCompany?',
			'schema_identifier',
			'schema_description?',
			'schema_publisher.Publisher',
			'schema_duration',
			'schema_abstract?',
			'premis_identifier',
			'schema_genre?',
			'schema_date_published?',
			'schema_license?',
			'schema_date_created?',
			'schema_contributor',
			'schema_maintainer.schema_identifier',
			'dcterms_format',
			'schema_name',
		],
	})
	orderProp? = 'dcterms_available';

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
