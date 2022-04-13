import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { CreateEventsDto } from '../dto/events.dto';
import { EventsService } from '../services/events.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Events')
@Controller('events')
export class EventsController {
	private logger: Logger = new Logger(EventsController.name, { timestamp: true });

	constructor(private eventsService: EventsService) {}

	@Post()
	public sendEvent(
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity,
		@Body() createEventsDto: CreateEventsDto
	): boolean {
		const logEvent = {
			id: uuidv4(),
			type: createEventsDto.type,
			source: request.path,
			subject: user.getId(),
			time: new Date().toISOString(),
		};

		// We do not await this one to not let the client wait the response
		this.eventsService.insertEvents([logEvent]);

		return true;
	}
}
