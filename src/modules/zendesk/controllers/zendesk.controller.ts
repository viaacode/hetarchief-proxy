import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateTicketRequestDto } from '../dto/zendesk.dto';
import { ZendeskService } from '../services/zendesk.service';
import type { CreateTicketResponse } from '../zendesk.types';

@ApiTags('Zendesk')
@Controller('zendesk')
export class ZendeskController {
	@Post('/support')
	@ApiOperation({ description: 'Create ticket through Zendesk API' })
	public async createTicket(
		@Body() createTicketRequest: CreateTicketRequestDto
	): Promise<CreateTicketResponse> {
		return await ZendeskService.createTicket(createTicketRequest);
	}
}
