import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { AccessType, VisitorSpaceOrderProps } from '~modules/spaces/spaces.types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';
import { VisitorSpaceStatus } from '~shared/types/types';

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
	@IsEnum(VisitorSpaceStatus, { each: true })
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'Filter spaces by status',
		default: undefined,
		example: VisitorSpaceStatus.Active,
		enum: VisitorSpaceStatus,
	})
	@Transform(commaSeparatedStringToArray)
	status?: VisitorSpaceStatus[] = [VisitorSpaceStatus.Active];

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

	@Type(() => String)
	@IsEnum(VisitorSpaceOrderProps)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: VisitorSpaceOrderProps.OrganisationName,
		enum: VisitorSpaceOrderProps,
	})
	orderProp?: VisitorSpaceOrderProps = VisitorSpaceOrderProps.OrganisationName;

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
		description: 'The slug for this space, should be unique.',
	})
	slug?: string;

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
		description: 'The description for this space in Dutch',
		default: undefined,
	})
	descriptionNl?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The service description for this space in Dutch. This is shown as additional info when making a visit request',
		default: undefined,
	})
	serviceDescriptionNl?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The description for this space in English',
		default: undefined,
	})
	descriptionEn?: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The service description for this space in English. This is shown as additional info when making a visit request',
		default: undefined,
	})
	serviceDescriptionEn?: string;

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
	@IsEnum(VisitorSpaceStatus, {
		message: `Status must be one of: ${Object.values(VisitorSpaceStatus).join(', ')}`,
	})
	@ApiPropertyOptional({
		type: String,
		description: `The status for this visitor space. Possible statuses: ${Object.values(
			VisitorSpaceStatus
		).join(', ')}`,
		example: VisitorSpaceStatus.Active,
		enum: VisitorSpaceStatus,
	})
	status?: VisitorSpaceStatus;
}

export class CreateSpaceDto extends UpdateSpaceDto {
	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description:
			'Create a space for the maintainer with this or_id. A maintainer can have only 1 space.',
		default: undefined,
	})
	orId: string;
}
