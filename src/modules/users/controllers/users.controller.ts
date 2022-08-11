import { Body, Controller, Logger, Param, Patch, Session, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateAcceptedTosDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from '../types';

import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(LoggedInGuard)
export class UsersController {
	private logger: Logger = new Logger(UsersController.name, { timestamp: true });

	constructor(private usersService: UsersService) {}

	@Patch(':id/accepted-tos')
	public async updateTos(
		@Body() updateAcceptedTosDto: UpdateAcceptedTosDto,
		@Param('id') id: string,
		@Session() session: Record<string, any>
	): Promise<User> {
		const user = await this.usersService.updateAcceptedTos(id, updateAcceptedTosDto);

		// update the acceptedTosAt property on the session user
		const sessionUser = SessionHelper.getArchiefUserInfo(session);
		sessionUser.acceptedTosAt = user.acceptedTosAt;
		SessionHelper.setArchiefUserInfo(session, sessionUser);

		return user;
	}
}
