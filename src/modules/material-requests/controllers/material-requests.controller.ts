import { Body, Controller, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	UpdateMaterialRequestDto,
} from '../dto/material-requests.dto';
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
			'Get materials requests endpoint for meemoo admins and CP admins. Visitors should use the /personal endpoint.',
	})
	@RequireAnyPermissions(Permission.VIEW_ANY_MATERIAL_REQUESTS)
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
		description: 'Get material requests for the logged in user.',
	})
	@RequireAllPermissions(Permission.VIEW_OWN_MATERIAL_REQUESTS, Permission.MANAGE_ACCOUNT)
	public async getPersonalMaterialRequests(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<MaterialRequest>> {
		return this.materialRequestsService.findAll(queryDto, {
			userProfileId: user.getId(),
		});
	}

	@Get(':id')
	@RequireAnyPermissions(
		Permission.VIEW_ANY_MATERIAL_REQUESTS,
		Permission.VIEW_OWN_MATERIAL_REQUESTS
	)
	public async getMaterialRequestById(@Param('id') id: string): Promise<MaterialRequest> {
		return await this.materialRequestsService.findById(id);
	}

	@Put()
	@ApiOperation({
		description: 'Create a material request',
	})
	@RequireAnyPermissions(Permission.CREATE_MATERIAL_REQUESTS)
	public async createMaterialRequest(
		@Body() createMaterialRequestDto: CreateMaterialRequestDto,
		@SessionUser() user: SessionUserEntity
	): Promise<MaterialRequest> {
		return await this.materialRequestsService.createMaterialRequest(createMaterialRequestDto, {
			userProfileId: user.getId(),
		});
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Update a material request',
	})
	@RequireAnyPermissions(Permission.EDIT_MATERIAL_REQUESTS)
	public async updateMaterialRequest(
		@Param('id') materialRequestId: string,
		@Body() updateMaterialRequestDto: UpdateMaterialRequestDto,
		@SessionUser() user: SessionUserEntity
	): Promise<MaterialRequest> {
		return await this.materialRequestsService.updateMaterialRequest(
			materialRequestId,
			user.getId(),
			updateMaterialRequestDto
		);
	}
}
