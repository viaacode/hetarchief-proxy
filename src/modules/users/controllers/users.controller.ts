import { Body, Controller, Logger, Param, Put, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateAcceptedTosDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from '../types';

import { SessionHelper } from '~shared/auth/session-helper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	private logger: Logger = new Logger(UsersController.name, { timestamp: true });

	constructor(private usersService: UsersService) {}

	@Put(':id/accepted-tos')
	public async updateTos(
		@Body() updateAcceptedTosDto: UpdateAcceptedTosDto,
		@Param('id') id: string,
		@Session() session: Record<string, any>
	): Promise<User> {
		const user = await this.usersService.updateAcceptedTos(id, updateAcceptedTosDto);
		SessionHelper.setArchiefUserInfo(session, user);
		return user;
	}
}
