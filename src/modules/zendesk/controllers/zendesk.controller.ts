import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateTicketRequestDto } from '../dto/zendesk.dto';
import { ZendeskService } from '../services/zendesk.service';
import { CreateTicketResponse } from '../zendesk.types';

import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Zendesk')
@Controller('zendesk')
export class ZendeskController {
	@Post('/support')
	@ApiOperation({ description: 'Create ticket through Zendesk API' })
	@RequireAnyPermissions(Permission.CREATE_TICKET_ZENDESK)
	public async createTicket(
		@Body() createTicketRequest: CreateTicketRequestDto
	): Promise<CreateTicketResponse> {
		return await ZendeskService.createTicket(createTicketRequest);
	}
}
