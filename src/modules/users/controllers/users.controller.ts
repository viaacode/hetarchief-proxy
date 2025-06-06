import {
	Body,
	Controller,
	InternalServerErrorException,
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
import type { User } from '../types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { customError } from '~shared/helpers/custom-error';

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
			this.campaignMonitorService
				.updateNewsletterPreferences({
					email: sessionUser.email,
					firstName: sessionUser.firstName,
					lastName: sessionUser.lastName,
					language: updateUserLangDto.language,
				})
				.then(() => {
					// do not wait for updates to the language to be applied in campaign monitor
				})
				.catch((err) => {
					console.error(
						customError('Failed to update the user language in Campaign Monitor', err, {
							userId: sessionUser.id,
							email: sessionUser.email,
							firstName: sessionUser.firstName,
							lastName: sessionUser.lastName,
							language: updateUserLangDto.language,
						})
					);
				});
			return { message: 'Language updated' };
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to update the user language',
				error: err,
			});
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
