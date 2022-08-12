import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsString } from 'class-validator';

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

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The url of the page who triggered the event',
		example:
			'https://bezoek-qas.hetarchief.be/or-rf5kf25/0039e1149b7d4d70b165a3ae777ebbf43c41abdd1a674d34be2d2bea08baba875497fb98d4e84239af32a3c3f8a42cc9',
		required: true,
	})
	path: string;

	@IsObject()
	@ApiProperty({
		type: Object,
		description: `Additional information about the event. For instance the video id, or the page url`,
		example: {
			schema_identifier:
				'09f17b37445c4ce59f645c2d5db9dbf8dbee79eba623459caa8c6496108641a0900618cb6ceb4e9b8ad907e47b980ee3',
		},
		required: false,
	})
	data?: Record<string, unknown>;
}
