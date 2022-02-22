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
	IsUUID,
} from 'class-validator';
import { string } from 'joi';

import { VisitStatus } from '~modules/visits/types';
import { SortDirection } from '~shared/types';

export class CreateVisitDto {
	@IsUUID()
	@ApiProperty({
		type: string,
		description: "The space's uuid",
	})
	spaceId: string;

	@IsUUID()
	@ApiProperty({
		type: string,
		description: 'The uuid of the user making the request',
	})
	userProfileId: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: string,
		description: 'The requested timeframe by the user',
	})
	timeframe: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: string,
		description: "The reason for this user's visit",
	})
	reason?: string;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'When the user accepted the Terms of Service',
	})
	acceptedTosAt: string;
}

export class VisitsQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			"Text to search for in the name or email af the requester. Use '%' for wildcard.",
		default: '%',
	})
	query? = '%';

	@ApiProperty({
		isArray: true,
		required: false,
		enum: VisitStatus,
		description: 'Status of the visit request. Options are: PENDING, APPROVED, DENIED',
		default: ['PENDING', 'APPROVED', 'DENIED'],
	})
	@IsOptional()
	@IsEnum(VisitStatus, { each: true })
	@IsArray()
	@Transform((params) => {
		if (typeof params.value == 'string') {
			return params.value.split(',');
		}
		return params.value;
	})
	status? = ['PENDING', 'APPROVED', 'DENIED'];

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
		default: 'startAt',
		enum: [
			'id',
			'spaceId',
			'userProfileId',
			'timeframe',
			'reason',
			'acceptedTos',
			'status',
			'startAt',
			'endAt',
			'createdAt',
			'updatedAt',
			'visitorName',
			'visitorMail',
			'visitorId',
		],
	})
	orderProp? = 'startAt';

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
