import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateIeObjectSupportRequestDto, CreateTicketRequestDto } from '../dto/zendesk.dto';
import { ZendeskService } from '../services/zendesk.service';
import type { CreateTicketResponse } from '../zendesk.types';

@ApiTags('Zendesk')
@Controller('zendesk')
export class ZendeskController {
	constructor(private zendeskService: ZendeskService) {}

	@Post('/support')
	@ApiOperation({ description: 'Create ticket through Zendesk API' })
	public async createTicket(
		@Body() createTicketRequest: CreateTicketRequestDto
	): Promise<CreateTicketResponse> {
		return await ZendeskService.createTicket(createTicketRequest);
	}

	@Post('/ie-object-support')
	@ApiOperation({
		description:
			'Report a problem with an ie-object. A metadata issue emails the maintainer (or meemoo ' +
			'support as a fallback) directly and never creates a Zendesk ticket; any other reason ' +
			'creates a Zendesk ticket and never sends an email.',
	})
	public async createIeObjectSupportTicket(
		@Body() createIeObjectSupportRequest: CreateIeObjectSupportRequestDto
	): Promise<CreateTicketResponse | undefined> {
		return await this.zendeskService.createIeObjectSupportTicket(createIeObjectSupportRequest);
	}
}
