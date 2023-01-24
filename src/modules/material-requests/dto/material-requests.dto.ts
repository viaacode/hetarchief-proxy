import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { MaterialRequestOrderProp, MaterialRequestType } from '../material-requests.types';

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

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: typeof MaterialRequestType,
		description: 'Which type of material request is requested',
		default: MaterialRequestType.VIEW,
	})
	type?: string;

	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'List of maintainer ids',
		default: [],
	})
	maintainerIds?: string[];

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
		enum: [Object.values(MaterialRequestOrderProp)],
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
	object_id: string;

	@IsString()
	@Type(() => String)
	@ApiPropertyOptional({
		type: typeof MaterialRequestType,
		description: 'Which type of material request is requested',
		default: MaterialRequestType.VIEW,
	})
	type: string = MaterialRequestType.VIEW;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: "The reason for this user's material request",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason: string;
}

export class UpdateMaterialRequestDto {
	@IsString()
	@Type(() => String)
	@ApiPropertyOptional({
		type: typeof MaterialRequestType,
		description: 'Which type of material request is requested',
		default: MaterialRequestType.VIEW,
	})
	type: string = MaterialRequestType.VIEW;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: "The reason for this user's material request",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason: string;
}
