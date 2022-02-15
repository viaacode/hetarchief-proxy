import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

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
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the results on format: Video / Audio / Image / News', // TODO add enum when real values are known and available in ES
		default: '',
	})
	format?: string;
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
}
