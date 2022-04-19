import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { LogEventType } from '../types';

export class CreateEventsDto {
	@IsString()
	@IsEnum(LogEventType, {
		message: `Event type must be one of: ${Object.values(LogEventType).join(', ')}`,
	})
	@ApiProperty({
		type: String,
		description: `Log an event with this type. Possible types: ${Object.values(
			LogEventType
		).join(', ')}`,
		example: LogEventType.USER_AUTHENTICATE,
		enum: LogEventType,
	})
	type: LogEventType;
}
