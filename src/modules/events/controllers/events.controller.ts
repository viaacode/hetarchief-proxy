import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CreateEventsDto } from '../dto/events.dto';
import { EventsService } from '../services/events.service';

import { LogEvent } from '~modules/events/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { SessionUser } from '~shared/decorators/user.decorator';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Events')
@Controller('events')
export class EventsController {
	private logger: Logger = new Logger(EventsController.name, { timestamp: true });

	constructor(private eventsService: EventsService) {}

	@Post()
	public async sendEvent(
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity,
		@Body() createEventsDto: CreateEventsDto
	): Promise<boolean> {
		const logEvent: LogEvent = {
			id: EventsHelper.getEventId(request),
			type: createEventsDto.type,
			source: createEventsDto.path,
			subject: user.getId() || null,
			time: new Date().toISOString(),
		};

		if (createEventsDto.data) {
			logEvent.data = createEventsDto.data;
		}

		logEvent.data = {
			...logEvent.data,
			user_group_name: user.getGroupName() || GroupName.ANONYMOUS,
			user_group_id: user.getGroupId() || null,
		};

		await this.eventsService.insertEvents([logEvent]);

		return true;
	}
}
