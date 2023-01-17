import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { MaterialRequestsQueryDto } from '../dto/material-requests.dto';
import { MaterialRequestsService } from '../services/material-requests.service';
import { MaterialRequest } from '../types';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('MaterialRequests')
@Controller('material-requests')
export class MaterialRequestsController {
	constructor(private materialRequestsService: MaterialRequestsService) {}

	@Get('personal')
	@ApiOperation({
		description: 'Get Material Requests endpoint for User.',
	})
	@RequireAllPermissions(
		Permission.READ_PERSONAL_APPROVED_MATERIAL_REQUESTS,
		Permission.MANAGE_ACCOUNT
	)
	public async getPersonalVisits(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<MaterialRequest>> {
		const visits = await this.materialRequestsService.findAll(queryDto, {
			userProfileId: user.getId(),
		});

		return visits;
	}
}
