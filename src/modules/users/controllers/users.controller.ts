import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateAcceptedTosDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from '../types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	private logger: Logger = new Logger(UsersController.name, { timestamp: true });

	constructor(private usersService: UsersService) {}

	@Post(':id/accepted-tos')
	public async updateTos(
		@Param('id') id: string,
		@Body() updateAcceptedTosDto: UpdateAcceptedTosDto
	): Promise<User> {
		const user = await this.usersService.updateAcceptedTos(id, updateAcceptedTosDto);
		return user;
	}
}
