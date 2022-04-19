import { Controller, Get, Logger, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { NavigationItem } from '~modules/navigations/navigations.types';
import { NavigationsService } from '~modules/navigations/services/navigations.service';
import { SessionHelper } from '~shared/auth/session-helper';

@ApiTags('Navigations')
@Controller('navigations')
export class NavigationsController {
	private logger: Logger = new Logger(NavigationsController.name, { timestamp: true });

	constructor(private navigationsService: NavigationsService) {}

	@ApiOperation({
		description:
			'Get navigation items for the current user (logged in or not logged in). Currently there are not yet special permission groups',
	})
	@Get('elements')
	async getNavigationElementsForUser(
		@Session() session: Record<string, any>
	): Promise<Record<string, NavigationItem[]>> {
		const user = SessionHelper.getArchiefUserInfo(session);
		const navigations = await this.navigationsService.getNavigationElementsForUser(user);
		return navigations;
	}
}
