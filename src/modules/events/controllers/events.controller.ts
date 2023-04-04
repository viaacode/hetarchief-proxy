import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { CreateEventsDto } from '../dto/events.dto';
import { EventsService } from '../services/events.service';

import { LogEvent } from '~modules/events/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
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
			subject: user.getId() || 'anonymous',
			time: new Date().toISOString(),
			userRole: user.getGroupId() || 'anonymous',
		};

		if (createEventsDto.data) {
			logEvent.data = createEventsDto.data;
		}

		await this.eventsService.insertEvents([logEvent]);

		return true;
	}
}
