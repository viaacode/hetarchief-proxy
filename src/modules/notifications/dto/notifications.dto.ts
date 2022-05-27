import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { NotificationType } from '../types';

export class NotificationsQueryDto {
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
}

// not yet exposed in api, used internally for consistency
export class DeleteNotificationDto {
	@IsArray()
	@IsEnum(NotificationType, { each: true })
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'Filter spaces by status',
		default: undefined,
		example: [NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED],
		enum: NotificationType,
	})
	types?: NotificationType[];
}
