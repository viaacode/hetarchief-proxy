import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { SortDirection } from '~shared/types';

export class SpacesQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "The query to search for. Use '%' for wildcard.",
		default: '%',
	})
	query? = '%';

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
		default: 'schema_maintainer.schema_name',
		enum: [
			'id',
			'schema_image',
			'schema_color',
			'schema_audience_type',
			'schema_description',
			'schema_public_access',
			'schema_service_description',
			'is_published',
			'published_at',
			'created_at',
			'updated_at',
			'schema_maintainer.schema_name',
			'schema_maintainer.schema_identifier',
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

export class UpdateSpaceDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The description for this space',
		default: undefined,
	})
	description?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The (background) color for this space',
		default: undefined,
		example: '#ffffff',
	})
	color?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The service description for this space. This is shown as additional info when making a visit request',
		default: undefined,
	})
	serviceDescription?: string;
}
