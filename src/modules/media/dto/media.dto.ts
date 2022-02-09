import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SearchFilters {
	@IsString()
	@IsOptional()
	query?: string;
}

export class MediaQueryDto {
	@Type(() => SearchFilters)
	@IsOptional()
	@ValidateNested()
	filters?: SearchFilters;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	size? = 10;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	from? = 0;
}
