import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { SortDirection } from '~shared/types';

export class MaterialRequestsQueryDto {
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
