import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

import {
	MaterialRequestListType,
	MaterialRequestOrderProp,
	MaterialRequestRequesterCapacity,
	MaterialRequestType,
} from '../material-requests.types';

import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';

export class MaterialRequestsQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			"Text to search for in the name or email af the requester. Use '%' for wildcard.",
		default: undefined,
	})
	query?: string;

	@IsArray()
	@IsEnum(MaterialRequestType, { each: true })
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		description: 'Which type of material request is requested',
		default: undefined,
		enum: MaterialRequestType,
	})
	@Transform(commaSeparatedStringToArray)
	type? = undefined;

	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'List of maintainer ids',
		default: [],
	})
	@Transform(commaSeparatedStringToArray)
	maintainerIds?: string[];

	@IsBoolean()
	@Type(() => Boolean)
	@Transform((input) => {
		return input.value;
	})
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Is the material request pending or already requested',
		default: null,
	})
	isPending?: boolean | null;

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
		default: 'createdAt',
		enum: MaterialRequestOrderProp,
	})
	orderProp? = MaterialRequestOrderProp.CREATED_AT;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.desc,
		enum: [SortDirection.asc, SortDirection.desc],
	})
	orderDirection? = SortDirection.desc;
}

export class CreateMaterialRequestDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'The object schema identifier',
		example: '9f2479c1-4489-4bd0-86b3-881b9449a8c0',
	})
	objectId: string;

	@IsString()
	@IsEnum(MaterialRequestType)
	@ApiProperty({
		type: String,
		description: 'Which type of material request is requested',
		default: undefined,
		enum: MaterialRequestType,
	})
	type = undefined;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: "The reason for this user's material request",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason: string;

	@IsString()
	@IsEnum(MaterialRequestRequesterCapacity)
	@ApiProperty({
		type: String,
		description: 'Which capacity the requester is part of',
		default: undefined,
		enum: MaterialRequestRequesterCapacity,
	})
	requesterCapacity = undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'To which organisation the user belongs to',
		default: null,
	})
	organisation?: string | null = null;
}

export class UpdateMaterialRequestDto {
	@IsString()
	@IsEnum(MaterialRequestType)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Which type of material request is requested',
		default: undefined,
		enum: MaterialRequestType,
	})
	type? = undefined;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "The reason for this user's material request",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason?: string;

	@IsString()
	@IsEnum(MaterialRequestRequesterCapacity)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Which capacity the requester is part of',
		default: undefined,
		enum: MaterialRequestRequesterCapacity,
	})
	requesterCapacity? = undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'To which organisation the user belongs to',
	})
	organisation?: string | null;
}

export class SendRequestListDto {
	@IsString()
	@IsEnum(MaterialRequestListType)
	@ApiPropertyOptional({
		type: String,
		enum: MaterialRequestListType,
	})
	type: MaterialRequestListType;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The name of the organisation to which the user belongs',
	})
	organisation?: string | null;
}
