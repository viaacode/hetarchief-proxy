import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionsService } from '../services/permissions.service';
import { Permission } from '../types';

import { LoggedInGuard } from '~shared/guards/logged-in.guard';

// @UseGuards(LoggedInGuard)
@ApiTags('Permissions')
@Controller('admin/permissions')
export class PermissionsController {
	private logger: Logger = new Logger(PermissionsController.name, { timestamp: true });

	constructor(private permissionsService: PermissionsService) {}

	@Get()
	public async getPermissions(): Promise<Permission[]> {
		return this.permissionsService.getPermissions();
	}
}
