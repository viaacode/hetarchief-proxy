import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { OrganisationSlugOrderProp } from '~modules/organisations/organisations.types';
import { SortDirection } from '~shared/types';

export class OrganisationSlugQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Text to search for in the name or id or slug.',
		default: undefined,
	})
	query?: string;

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
		default: 20,
	})
	size? = 20;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'name',
		enum: OrganisationSlugOrderProp,
	})
	orderProp? = OrganisationSlugOrderProp.NAME;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.asc,
		enum: [SortDirection.asc, SortDirection.desc],
	})
	orderDirection? = SortDirection.asc;
}

export class UpdateOrganisationSlugDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'The new slug',
	})
	slug? = undefined;
}
