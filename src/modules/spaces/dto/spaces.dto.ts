import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { Lookup_Maintainer_Visitor_Space_Status_Enum } from '~generated/graphql-db-types-hetarchief';
import { AccessType } from '~modules/spaces/types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';

export class SpacesQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "The query to search for. Use '%' for wildcard.",
		default: undefined,
	})
	query? = undefined;

	@IsString()
	@IsEnum(AccessType)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Get spaces that are currently accessible by the user',
		default: undefined,
		example: AccessType.ACTIVE,
		enum: AccessType,
	})
	accessType? = undefined;

	@IsArray()
	@IsEnum(Lookup_Maintainer_Visitor_Space_Status_Enum, { each: true })
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'Filter spaces by status',
		default: undefined,
		example: Lookup_Maintainer_Visitor_Space_Status_Enum.Active,
		enum: Lookup_Maintainer_Visitor_Space_Status_Enum,
	})
	@Transform(commaSeparatedStringToArray)
	status?: Lookup_Maintainer_Visitor_Space_Status_Enum[];

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
		default: 'content_partner.schema_name',
		enum: [
			'id',
			'schema_image',
			'schema_color',
			'schema_audience_type',
			'schema_description',
			'schema_public_access',
			'schema_service_description',
			'status',
			'published_at',
			'created_at',
			'updated_at',
			'content_partner.schema_name',
			'content_partner.schema_identifier',
		],
	})
	orderProp? = 'content_partner.schema_name';

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

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The url to the image for this space. S3 images only. Will delete the previous from S3 if one was set. If a file is uploaded and image is set, image will be ignored',
		default: undefined,
	})
	image?: string;

	@IsString()
	@IsOptional()
	@IsEnum(Lookup_Maintainer_Visitor_Space_Status_Enum, {
		message: `Status must be one of: ${Object.values(
			Lookup_Maintainer_Visitor_Space_Status_Enum
		).join(', ')}`,
	})
	@ApiPropertyOptional({
		type: String,
		description: `The status for this visitor space. Possible statuses: ${Object.values(
			Lookup_Maintainer_Visitor_Space_Status_Enum
		).join(', ')}`,
		example: Lookup_Maintainer_Visitor_Space_Status_Enum.Active,
		enum: Lookup_Maintainer_Visitor_Space_Status_Enum,
	})
	status?: Lookup_Maintainer_Visitor_Space_Status_Enum;
}
