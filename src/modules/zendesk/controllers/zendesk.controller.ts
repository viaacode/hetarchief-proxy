import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Requests } from 'node-zendesk';

import { ZendeskService } from '../services/zendesk.service';

import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Zendesk')
@Controller('zendesk')
export class ZendeskController {
	constructor(private zendeskService: ZendeskService) {}

	@Post('/support')
	public async createTicket(
		@Body() createTicketRequest: Requests.CreateModel
	): Promise<Requests.ResponseModel> {
		return await this.zendeskService.createTicket(createTicketRequest);
	}
}
