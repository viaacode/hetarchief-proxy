import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	SendRequestListDto,
	UpdateMaterialRequestDto,
} from '../dto/material-requests.dto';
import { MaterialRequest, MaterialRequestMaintainer } from '../material-requests.types';
import { MaterialRequestsService } from '../services/material-requests.service';

import {
	MaterialRequestEmailInfo,
	Template,
} from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { Recipient } from '~shared/types/types';

// @UseGuards(LoggedInGuard)
@ApiTags('MaterialRequests')
@Controller('material-requests')
export class MaterialRequestsController {
	constructor(
		private materialRequestsService: MaterialRequestsService,
		private campaignMonitorService: CampaignMonitorService
	) {}

	@Get()
	@ApiOperation({
		description:
			'Get materials requests endpoint for meemoo admins and CP admins. Visitors should use the /personal endpoint.',
	})
	// @RequireAnyPermissions(Permission.VIEW_ANY_MATERIAL_REQUESTS)
	public async getMaterialRequests(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<MaterialRequest>> {
		return await this.materialRequestsService.findAll(queryDto, {
			userProfileId: user.getId(),
			userGroup: user.getGroupId(),
			isPersonal: false,
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
			userGroup: user.getGroupId(),
			isPersonal: true,
		});
	}

	@Get('maintainers')
	@RequireAnyPermissions(Permission.VIEW_ANY_MATERIAL_REQUESTS)
	public async getMaintainers(): Promise<MaterialRequestMaintainer[] | []> {
		return await this.materialRequestsService.findMaintainers();
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
	@RequireAnyPermissions(Permission.EDIT_OWN_MATERIAL_REQUESTS)
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

	@Delete(':id')
	@ApiOperation({
		description: 'Delete a material request',
	})
	@RequireAnyPermissions(Permission.DELETE_OWN_MATERIAL_REQUESTS)
	public async deleteMaterialRequest(
		@Param('id') materialRequestId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const affectedRows = await this.materialRequestsService.deleteMaterialRequest(
			materialRequestId,
			user.getId()
		);

		if (affectedRows > 0) {
			return { status: 'Material request has been deleted' };
		} else {
			return { status: `no material requests found with that id: ${materialRequestId}` };
		}
	}

	@Post('/send')
	@ApiOperation({
		description: 'Send request list',
	})
	public async sendRequestList(
		@Body() sendRequestListDto: SendRequestListDto,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const dto = new MaterialRequestsQueryDto();
		dto.isPending = true; //werkt nog niet
		//opletten met limit en paginatie
		const materialRequests = await this.materialRequestsService.findAll(dto, {
			userProfileId: user.getId(),
			userGroup: user.getGroupId(),
			isPersonal: true,
		});
		// materialRequests.items.forEach(
		// 	(mr) =>
		// 		(mr.contactMail = mr.contactMail.find(
		// 			(contact) => contact.contact_type === 'primary'
		// 		)?.email)
		// );

		materialRequests.items.forEach(
			(mr) => (mr.contactMail = 'emile.vantichelen@studiohyperdrive.be')
		);
		//met group by van lodash alles per maintainer maken
		const emailInfo: MaterialRequestEmailInfo = {
			template: Template.MATERIAL_REQUEST,
			materialRequests: materialRequests.items,
			sendRequestListDto,
			firstName: user.getFirstName(),
			lastName: user.getLastName(),
		};
		this.campaignMonitorService.sendForMaterialRequest(emailInfo);
	}
}
