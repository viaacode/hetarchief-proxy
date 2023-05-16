import {
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { isEmpty, isNil } from 'lodash';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	SendRequestListDto,
	UpdateMaterialRequestDto,
} from '../dto/material-requests.dto';
import {
	MaterialRequest,
	MaterialRequestMaintainer,
	MaterialRequestMaintainerContactType,
} from '../material-requests.types';
import { MaterialRequestsService } from '../services/material-requests.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName, Permission } from '~modules/users/types';
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
		// ARC-1472 Validatie the user group if the request has maintainerIds
		queryDto = this.validateMaintainerIdsWithUserGroup(user, queryDto);

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
		// ARC-1472 Validatie the user group if the request has maintainerIds
		queryDto = this.validateMaintainerIdsWithUserGroup(user, queryDto);

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
	public async getMaterialRequestById(
		@Param('id', ParseUUIDPipe) id: string
	): Promise<MaterialRequest> {
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
		@Param('id', ParseUUIDPipe) materialRequestId: string,
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
		@Param('id', ParseUUIDPipe) materialRequestId: string,
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
		description: 'Send material request list',
	})
	public async sendRequestList(
		@Body() sendRequestListDto: SendRequestListDto,
		@SessionUser() user: SessionUserEntity
	): Promise<{ message: 'success' }> {
		const dto = new MaterialRequestsQueryDto();
		dto.isPending = true;
		dto.size = 100;

		try {
			const materialRequests = await this.materialRequestsService.findAll(dto, {
				userProfileId: user.getId(),
				userGroup: user.getGroupId(),
				isPersonal: true,
			});

			materialRequests.items.forEach((materialRequest: MaterialRequest) => {
				materialRequest.contactMail = materialRequest?.contactMail?.find(
					(contact) =>
						contact.contact_type === MaterialRequestMaintainerContactType.ONTSLUITING
				)?.email;
				materialRequest.requesterCapacity = sendRequestListDto.type;
				materialRequest.organisation = sendRequestListDto?.organisation;
			});

			await this.materialRequestsService.sendRequestList(
				materialRequests.items,
				sendRequestListDto,
				{
					firstName: user.getFirstName(),
					lastName: user.getLastName(),
				}
			);

			await Promise.all(
				materialRequests.items.map(async (materialRequest: MaterialRequest) => {
					await this.materialRequestsService.updateMaterialRequest(
						materialRequest.id,
						user.getId(),
						{
							type: materialRequest.type,
							reason: materialRequest.reason,
							organisation: materialRequest.organisation,
							requester_capacity: materialRequest.requesterCapacity,
							is_pending: false,
							updated_at: new Date().toISOString(),
						}
					);
				})
			);

			return { message: 'success' };
		} catch (error) {
			throw new InternalServerErrorException({
				message: 'Material request list could not be send.',
				error,
			});
		}
	}

	// helpers
	// ========================
	public validateMaintainerIdsWithUserGroup(
		user: SessionUserEntity,
		queryDto: MaterialRequestsQueryDto
	): MaterialRequestsQueryDto {
		if (!isNil(queryDto?.maintainerIds) || !isEmpty(queryDto?.maintainerIds)) {
			if ([GroupName.VISITOR, GroupName.KIOSK_VISITOR].includes(user.getGroupName())) {
				queryDto.maintainerIds = [];
			}

			if (user.getGroupId() === GroupId.CP_ADMIN) {
				queryDto.maintainerIds = [user.getMaintainerId()];
			}
		}

		return queryDto;
	}
}
