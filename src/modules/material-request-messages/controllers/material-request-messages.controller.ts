import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { IPagination } from '@studiohyperdrive/pagination';
import { AvoFileUploadAssetType, PermissionName } from '@viaa/avo2-types';

import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { AssetsService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { logAndThrow } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/logAndThrow';
import { FileInterceptor } from '@nestjs/platform-express';
import { Lookup_App_Material_Request_Message_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { MaterialRequestMessage } from '~modules/material-request-messages/material-request-messages.types';
import { MaterialRequestsService } from '~modules/material-requests/services/material-requests.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { MaterialRequestMessagesService } from '../services/material-request-messages.service';

@UseGuards(LoggedInGuard)
@ApiTags('MaterialRequestMessages')
@Controller('material-request-messages')
export class MaterialRequestMessagesController {
	constructor(
		private materialRequestMessagesService: MaterialRequestMessagesService,
		private materialRequestsService: MaterialRequestsService,
		protected assetsService: AssetsService
	) {}

	@Get(':materialRequestId/messages')
	@ApiOperation({
		description:
			'Get messages for a specific materials request. And mark messages as read for the current user.',
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	public async getMaterialRequests(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Query('page', ParseIntPipe) page: number,
		@Query('size', ParseIntPipe) size: number,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<IPagination<MaterialRequestMessage>> {
		try {
			const materialRequest = await this.materialRequestsService.findById(
				materialRequestId,
				user,
				referer,
				ip
			);

			const isRequester = user.getId() === materialRequest.requesterId;
			const isEvaluatorOfTheCp =
				user?.getOrganisationId() === materialRequest.maintainerId && user.getIsEvaluator();
			const isMeemooAdmin = user.getGroupName() === GroupName.MEEMOO_ADMIN;
			if (!isRequester && !isEvaluatorOfTheCp && !isMeemooAdmin) {
				throw new ForbiddenException(
					'You do not have permission to view messages for this material request. Only requester and evaluators of the organisation of the material can view the messages'
				);
			}
			// Mark messages as read
			await this.materialRequestMessagesService.deleteMessageUnreadEntries(
				materialRequestId,
				user.getId()
			);

			// Return messages to client
			return await this.materialRequestMessagesService.findAll(materialRequestId, page, size);
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to get material request messages', err, {
					materialRequestId,
					userId: user?.getId(),
					page,
					size,
				})
			);
		}
	}

	@Get(':materialRequestId/messages/count-unread')
	@ApiOperation({
		description: 'Get count of material request messages.',
	})
	@RequireAnyPermissions(PermissionName.VIEW_OWN_MATERIAL_REQUESTS)
	public async getMaterialRequestMessagesCount(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ count: number }> {
		try {
			const count = await this.materialRequestMessagesService.countUnreadMessages(
				materialRequestId,
				user.getId()
			);
			return { count };
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to count material request messages', err, {
					materialRequestId,
					userId: user?.getId(),
				})
			);
		}
	}

	@Post(':materialRequestId/messages')
	@ApiOperation({
		description: 'Create a material request message with optional file upload.',
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	@UseInterceptors(FileInterceptor('file'))
	public async createMaterialRequestMessage(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Body('message') message: string,
		@UploadedFile() file?: Express.Multer.File
	): Promise<MaterialRequestMessage> {
		try {
			let attachmentUrl: string | undefined;
			let attachmentFilename: string | undefined;
			if (file) {
				// Upload file using admin-core-api assets service
				attachmentFilename = file.filename;
				const fileNameParsed = path.parse(attachmentFilename);
				attachmentUrl = await this.assetsService.uploadAndTrack(
					AvoFileUploadAssetType.MATERIAL_REQUEST_MESSAGE_ATTACHMENT as any,
					file,
					user.getId(),
					randomUUID() + fileNameParsed.ext
				);
			}
			return await this.materialRequestMessagesService.createMessage(
				materialRequestId,
				user.getId(),
				Lookup_App_Material_Request_Message_Type_Enum.Message,
				message,
				attachmentUrl,
				attachmentFilename,
				new Date().toISOString()
			);
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to create material request message', err, {
					materialRequestId,
					userId: user?.getId(),
				})
			);
		}
	}
}
