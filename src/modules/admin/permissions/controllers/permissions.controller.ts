import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionsService } from '../services/permissions.service';
import { PermissionResponse } from '../types';

import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Permissions')
@Controller('admin/permissions')
@RequireAllPermissions(Permission.EDIT_PERMISSION_GROUPS)
export class PermissionsController {
	private logger: Logger = new Logger(PermissionsController.name, { timestamp: true });

	constructor(private permissionsService: PermissionsService) {}

	@Get()
	public async getPermissions(): Promise<PermissionResponse[]> {
		return this.permissionsService.getPermissions();
	}
}
