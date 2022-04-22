import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { addDays, addHours } from 'date-fns';
import { string } from 'joi';

import { VisitStatus, VisitTimeframe } from '~modules/visits/types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';

export class CreateVisitDto {
	@IsString()
	@ApiProperty({
		type: string,
		description: "The space's slug",
		example: 'vrt',
	})
	visitorSpaceSlug: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: string,
		description: 'The requested timeframe by the user',
		example: 'Next thursday afternoon from 2 to 6',
	})
	timeframe?: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: string,
		description: "The reason for this user's visit",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason?: string;

	@IsBoolean()
	@ApiProperty({
		type: Boolean,
		description: 'If the user accepted the Terms of Service for this reading room',
		example: true,
	})
	acceptedTos: boolean;
}

export class UpdateVisitStatusDto {
	@ApiProperty({
		required: true,
		enum: VisitStatus,
		description:
			'Transition the visit to any of these states: APPROVED, DENIED, CANCELLED_BY_VISITOR',
	})
	@IsEnum(VisitStatus)
	status: VisitStatus;
}

export class UpdateVisitDto extends PartialType<UpdateVisitStatusDto>(UpdateVisitStatusDto) {
	@IsDateString()
	@IsOptional()
	@ApiProperty({
		type: string,
		description: "The start of this user's visit",
		example: addDays(new Date(), 2).toISOString(),
	})
	startAt?: string;

	@IsDateString()
	@IsOptional()
	@ApiProperty({
		type: string,
		description: "The start of this user's visit",
		example: addHours(addDays(new Date(), 2), 2).toISOString(),
	})
	endAt?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: string,
		description: "An optional note from the content partner about the user's visit",
		example: 'A visit is limited to max. 2h',
	})
	note?: string;
}

export class VisitsQueryDto {
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

	@ApiPropertyOptional({
		isArray: true,
		required: false,
		enum: VisitStatus,
		description: `Status of the visit request. Options are: ${Object.values(VisitStatus).join(
			', '
		)}`,
		default: undefined,
	})
	@IsOptional()
	@IsEnum(VisitStatus, { each: true })
	@IsArray()
	@Transform(commaSeparatedStringToArray)
	status?: VisitStatus | VisitStatus[];

	@ApiPropertyOptional({
		required: false,
		enum: VisitTimeframe,
		description: `Filters visits based on startAt and endAt times. Active means current time is between the startAt and endAt.  Options are: ${Object.values(
			VisitTimeframe
		).join(', ')}`,
		default: undefined,
	})
	@IsOptional()
	@IsEnum(VisitTimeframe, { each: true })
	timeframe?: VisitTimeframe;

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
			'spaceName',
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
			'updatedById',
			'updatedByName',
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
