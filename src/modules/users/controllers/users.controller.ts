import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Logger,
	Param,
	ParseUUIDPipe,
	Patch,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateAcceptedTosDto, UpdateUserLangDto } from '../dto/users.dto';
import { UsersService } from '../services/users.service';
import { User } from '../types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(LoggedInGuard)
export class UsersController {
	private logger: Logger = new Logger(UsersController.name, { timestamp: true });

	constructor(
		private usersService: UsersService,
		private campaignMonitorService: CampaignMonitorService
	) {}

	@Patch('/update-language')
	public async updateUser(
		@Body() updateUserLangDto: UpdateUserLangDto,
		@Session() session: Record<string, any>
	): Promise<Record<string, string>> {
		try {
			const sessionUser = SessionHelper.getArchiefUserInfo(session);
			await this.usersService.updateUserLanguage(sessionUser.id, updateUserLangDto);
			sessionUser.language = updateUserLangDto.language;
			SessionHelper.setArchiefUserInfo(session, sessionUser);
			await this.campaignMonitorService.updateNewsletterPreferences({
				email: sessionUser.email,
				firstName: sessionUser.firstName,
				lastName: sessionUser.lastName,
				language: updateUserLangDto.language,
			});
			return { message: 'Language updated' };
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Patch(':id/accepted-tos')
	public async updateTos(
		@Body() updateAcceptedTosDto: UpdateAcceptedTosDto,
		@Param('id', ParseUUIDPipe) id: string,
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
