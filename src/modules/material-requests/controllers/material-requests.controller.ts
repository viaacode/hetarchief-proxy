import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { MaterialRequestsQueryDto } from '../dto/material-requests.dto';
import { MaterialRequest } from '../material-requests.types';
import { MaterialRequestsService } from '../services/material-requests.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('MaterialRequests')
@Controller('material-requests')
export class MaterialRequestsController {
	constructor(private materialRequestsService: MaterialRequestsService) {}

	@Get()
	@ApiOperation({
		description:
			'Get Materials Requests endpoint for Meemoo Admins and CP Admins. Visitors should use the /personal endpoint. ',
	})
	@RequireAnyPermissions(Permission.READ_ALL_MATERIAL_REQUESTS)
	public async getMaterialRequests(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<MaterialRequest>> {
		return await this.materialRequestsService.findAll(queryDto, {
			userProfileId: user.getId(),
		});
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get Material Requests endpoint for User.',
	})
	@RequireAllPermissions(
		Permission.READ_PERSONAL_APPROVED_MATERIAL_REQUESTS,
		Permission.MANAGE_ACCOUNT
	)
	public async getPersonalMaterialRequests(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<MaterialRequest>> {
		return await this.materialRequestsService.findAll(queryDto, {
			userProfileId: user.getId(),
		});
	}

	@Get(':id')
	@RequireAnyPermissions(
		Permission.READ_ALL_MATERIAL_REQUESTS,
		Permission.READ_PERSONAL_APPROVED_MATERIAL_REQUESTS
	)
	public async getMaterialRequestById(@Param('id') id: string): Promise<MaterialRequest> {
		return await this.materialRequestsService.findById(id);
	}
}
