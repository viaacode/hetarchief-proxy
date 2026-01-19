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
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { IPagination } from '@studiohyperdrive/pagination';
import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';
import type { Request } from 'express';
import { isEmpty, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	SendRequestListDto,
	UpdateMaterialRequestDto,
	UpdateMaterialRequestStatusDto,
} from '../dto/material-requests.dto';
import type { MaterialRequest, MaterialRequestMaintainer } from '../material-requests.types';

import { MaterialRequestsService } from '../services/material-requests.service';

import { Lookup_App_Material_Request_Status_Enum } from '~generated/graphql-db-types-hetarchief';
import { EventsService } from '~modules/events/services/events.service';
import { type LogEvent, LogEventType } from '~modules/events/types';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import {
	MAP_MATERIAL_REQUEST_STATUS_TO_EVENT_TYPE,
	getAdditionEventDate,
	mapUserToGroupNameAndKeyUser,
} from '~modules/material-requests/material-requests.consts';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName } from '~modules/users/types';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';

@UseGuards(LoggedInGuard)
@ApiTags('MaterialRequests')
@Controller('material-requests')
export class MaterialRequestsController {
	constructor(
		private materialRequestsService: MaterialRequestsService,
		private eventsService: EventsService
	) {}

	@Get()
	@ApiOperation({
		description:
			'Get materials requests endpoint for meemoo admins and CP admins. Visitors should use the /personal endpoint.',
	})
	@RequireAnyPermissions(PermissionName.VIEW_ANY_MATERIAL_REQUESTS)
	public async getMaterialRequests(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<IPagination<MaterialRequest>> {
		// ARC-1472 Validate the user group if the request has maintainerIds
		const validatedQueryDto = this.validateMaintainerIdsWithUserGroup(user, queryDto);

		return await this.materialRequestsService.findAll(validatedQueryDto, false, user, referer, ip);
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get material requests for the logged in user.',
	})
	@RequireAllPermissions(PermissionName.VIEW_OWN_MATERIAL_REQUESTS, PermissionName.MANAGE_ACCOUNT)
	public async getPersonalMaterialRequests(
		@Query() queryDto: MaterialRequestsQueryDto,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<IPagination<MaterialRequest>> {
		// ARC-1472 Validate the user group if the request has maintainerIds
		const validatedQueryDto = this.validateMaintainerIdsWithUserGroup(user, queryDto);

		return this.materialRequestsService.findAll(validatedQueryDto, true, user, referer, ip);
	}

	@Get('maintainers')
	@RequireAnyPermissions(PermissionName.VIEW_ANY_MATERIAL_REQUESTS)
	public async getMaintainers(): Promise<MaterialRequestMaintainer[] | []> {
		return await this.materialRequestsService.findMaintainers();
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS,
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS
	)
	public async getMaterialRequestById(
		@Param('id', ParseUUIDPipe) id: string,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<MaterialRequest> {
		return await this.materialRequestsService.findById(id, user, referer, ip);
	}

	@Put()
	@ApiOperation({
		description: 'Create a material request',
	})
	@RequireAnyPermissions(PermissionName.CREATE_MATERIAL_REQUESTS)
	public async createMaterialRequest(
		@Body() createMaterialRequestDto: CreateMaterialRequestDto,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<MaterialRequest> {
		return await this.materialRequestsService.createMaterialRequest(
			createMaterialRequestDto,
			user,
			referer,
			ip
		);
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Update a material request',
	})
	@RequireAnyPermissions(PermissionName.EDIT_OWN_MATERIAL_REQUESTS)
	public async updateMaterialRequest(
		@Param('id', ParseUUIDPipe) materialRequestId: string,
		@Body() updateMaterialRequestDto: UpdateMaterialRequestDto,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<MaterialRequest> {
		return await this.materialRequestsService.updateMaterialRequestForUser(
			materialRequestId,
			user,
			{
				...(updateMaterialRequestDto.type ? { type: updateMaterialRequestDto.type } : {}),
				...(updateMaterialRequestDto.reason ? { reason: updateMaterialRequestDto.reason } : {}),
				...(updateMaterialRequestDto.requesterCapacity
					? { requester_capacity: updateMaterialRequestDto.requesterCapacity }
					: {}),
				...(updateMaterialRequestDto.organisation
					? { organisation: updateMaterialRequestDto.organisation }
					: {}),
			},
			updateMaterialRequestDto.reuseForm,
			referer,
			ip
		);
	}

	@Patch(':id/status')
	@ApiOperation({
		description: 'Update the status of the material request',
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	public async updateMaterialRequestStatus(
		@Param('id', ParseUUIDPipe) materialRequestId: string,
		@Body() updateMaterialRequestStatusDto: UpdateMaterialRequestStatusDto,
		@Req() request: Request,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<MaterialRequest> {
		const materialRequest = await this.materialRequestsService.updateMaterialRequestStatus(
			materialRequestId,
			updateMaterialRequestStatusDto,
			user,
			referer,
			ip
		);

		const eventType = MAP_MATERIAL_REQUEST_STATUS_TO_EVENT_TYPE[materialRequest.status];

		// Is this a trackable event? (Approved, Denied, Cancelled)
		if (eventType) {
			await this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: eventType,
					source: request.path,
					subject: user?.getId(),
					time: new Date().toISOString(),
					data: {
						type: mapDcTermsFormatToSimpleType(materialRequest.objectDctermsFormat),
						or_id: materialRequest.maintainerId,
						pid: materialRequest.objectSchemaIdentifier,
						material_request_group_id: materialRequest.requestGroupId,
						...getAdditionEventDate(eventType, materialRequest),
					},
				},
			]);
		}

		return materialRequest;
	}

	@Delete(':id')
	@ApiOperation({
		description: 'Delete a material request',
	})
	@RequireAnyPermissions(PermissionName.DELETE_OWN_MATERIAL_REQUESTS)
	public async deleteMaterialRequest(
		@Param('id', ParseUUIDPipe) materialRequestId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: string }> {
		const affectedRows = await this.materialRequestsService.deleteMaterialRequest(
			materialRequestId,
			user?.getId()
		);

		if (affectedRows > 0) {
			return { status: 'Material request has been deleted' };
		}
		return { status: `no material requests found with that id: ${materialRequestId}` };
	}

	@Post('/send')
	@ApiOperation({
		description: 'Send material request list',
	})
	public async sendRequestList(
		@Body() sendRequestListDto: SendRequestListDto,
		@SessionUser() user: SessionUserEntity,
		@Req() request: Request,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<{ message: 'success' }> {
		const dto = new MaterialRequestsQueryDto();
		dto.isPending = true;
		dto.size = 100;

		try {
			const materialRequests = await this.materialRequestsService.findAll(
				dto,
				true,
				user,
				referer,
				ip
			);

			for (const materialRequest of materialRequests.items) {
				// If the email does not exist, the campaign monitor service will default to process.env.MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK
				materialRequest.requesterCapacity = sendRequestListDto.type;
				materialRequest.organisation = sendRequestListDto?.organisation;
				materialRequest.requestGroupName = sendRequestListDto?.requestGroupName;
			}

			await this.materialRequestsService.sendRequestList(
				materialRequests.items,
				sendRequestListDto,
				{
					firstName: user.getFirstName(),
					lastName: user.getLastName(),
					language: user.getLanguage(),
				}
			);

			const material_request_group_id = uuidv4();
			await Promise.all(
				materialRequests.items.map(async (materialRequest: MaterialRequest) => {
					await this.materialRequestsService.updateMaterialRequestForUser(
						materialRequest.id,
						user,
						{
							type: materialRequest.type,
							reason: materialRequest.reason,
							organisation: materialRequest.organisation,
							requester_capacity: materialRequest.requesterCapacity,
							is_pending: false,
							status: materialRequest.reuseForm
								? Lookup_App_Material_Request_Status_Enum.New
								: Lookup_App_Material_Request_Status_Enum.None,
							group_id: material_request_group_id,
							name: materialRequest.reuseForm ? materialRequest.requestGroupName : undefined,
							requested_at: new Date().toISOString(),
						},
						materialRequest.reuseForm,
						referer,
						ip
					);
				})
			);

			// Log events for each material request
			this.eventsService.insertEvents(
				materialRequests.items.map(
					(materialRequest): LogEvent => ({
						id: EventsHelper.getEventId(request),
						type: LogEventType.ITEM_REQUEST,
						source: request.path,
						subject: user?.getId(),
						time: new Date().toISOString(),
						data: {
							material_request_group_id: materialRequest.requestGroupId,
							type: mapDcTermsFormatToSimpleType(materialRequest.objectDctermsFormat),
							external_id: materialRequest.objectSchemaIdentifier,
							fragment_id: materialRequest.objectSchemaIdentifier,
							idp: AvoAuthIdpType.HETARCHIEF,
							user_group_name: mapUserToGroupNameAndKeyUser(user),
							user_group_id: user.getGroupId(),
							or_id: materialRequest.maintainerId,
							contact_form: {
								user_type: materialRequest.requesterCapacity,
								problem_category: materialRequest.type,
								problem_description: materialRequest.reason,
								cp_id: materialRequest.maintainerId,
								local_cp_id: materialRequest.objectMeemooLocalId,
							},
						},
					})
				)
			);

			return { message: 'success' };
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Material request list could not be send.',
				innerException: err,
			});
			console.error(error);

			throw error;
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

			if (
				user.getGroupId() === GroupId.CP_ADMIN ||
				(user.getIsKeyUser() && user.getIsEvaluator())
			) {
				queryDto.maintainerIds = [user.getOrganisationId()];
			}
		}

		return queryDto;
	}
}
