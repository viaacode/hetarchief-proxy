import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserGroupsService } from '../services/user-groups.service';
import { UserGroupsResponse } from '../types';

import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('UserGroups')
@Controller('admin/user-groups')
@RequireAllPermissions(Permission.EDIT_PERMISSION_GROUPS)
export class UserGroupsController {
	private logger: Logger = new Logger(UserGroupsController.name, { timestamp: true });

	constructor(private userGroupsService: UserGroupsService) {}

	@Get()
	public async getUserGroups(): Promise<UserGroupsResponse[]> {
		return this.userGroupsService.getUserGroups();
	}
}
