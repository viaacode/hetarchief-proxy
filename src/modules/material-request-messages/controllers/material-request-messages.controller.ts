import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Res,
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
import archiver from 'archiver';
import type { Response } from 'express';
import { kebabCase } from 'lodash';
import { Lookup_App_Material_Request_Message_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import {
	MaterialRequestAttachment,
	MaterialRequestMessage,
} from '~modules/material-request-messages/material-request-messages.types';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
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

	@Get(':materialRequestId/attachments')
	@ApiOperation({
		description:
			'Get attachments for a specific material request. Returns paginated list ordered from oldest to newest.',
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	public async getMaterialRequestAttachments(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Query('page', ParseIntPipe) page: number,
		@Query('size', ParseIntPipe) size: number,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<IPagination<MaterialRequestAttachment>> {
		try {
			await this.verifyAccessToMaterialRequest(materialRequestId, user, referer, ip);

			return await this.materialRequestMessagesService.findAttachments(
				materialRequestId,
				page,
				size
			);
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to get material request attachments', err, {
					materialRequestId,
					userId: user?.getId(),
					page,
					size,
				})
			);
		}
	}

	@Get(':materialRequestId/attachments/download-zip')
	@ApiOperation({
		description:
			'Download all attachments for a material request as a single ZIP file. Streams files directly from storage.',
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	public async downloadAttachmentsAsZip(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string,
		@Res() res: Response
	): Promise<void> {
		try {
			const materialRequest = await this.verifyAccessToMaterialRequest(
				materialRequestId,
				user,
				referer,
				ip
			);

			const attachments =
				await this.materialRequestMessagesService.getAllAttachments(materialRequestId);

			if (attachments.length === 0) {
				throw new NotFoundException('No attachments found for this material request');
			}

			const requestName = kebabCase(materialRequest.requestGroupName || 'material-request');
			const maintainerName = kebabCase(materialRequest.maintainerName || '');
			const zipFilename = `${requestName}-${maintainerName}-attachments.zip`;
			res.setHeader('Content-Type', 'application/zip');
			res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

			const archive = archiver('zip', { zlib: { level: 5 } });
			archive.pipe(res);

			for (const attachment of attachments) {
				const response = await fetch(attachment.attachmentUrl);
				if (!response.ok) {
					console.error(`Failed to fetch attachment: ${attachment.attachmentUrl}`);
					continue;
				}

				const arrayBuffer = await response.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				const filename = attachment.attachmentFilename
					? this.toKebabCaseFilename(attachment.attachmentFilename)
					: `attachment-${attachment.id}`;
				archive.append(buffer, { name: filename });
			}

			await archive.finalize();
		} catch (err) {
			if (!res.headersSent) {
				logAndThrow(
					new CustomError('Failed to download material request attachments as zip', err, {
						materialRequestId,
						userId: user?.getId(),
					})
				);
			}
		}
	}

	@Get(':materialRequestId/attachments/:attachmentId/download')
	@ApiOperation({
		description: 'Get a download URL for a specific attachment.',
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	public async getAttachmentDownloadUrl(
		@Param('materialRequestId') materialRequestId: string,
		@Param('attachmentId') attachmentId: string,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<{ url: string; filename: string }> {
		try {
			await this.verifyAccessToMaterialRequest(materialRequestId, user, referer, ip);

			const attachment = await this.materialRequestMessagesService.findAttachmentById(
				materialRequestId,
				attachmentId
			);

			if (!attachment) {
				throw new NotFoundException('Attachment not found');
			}

			return {
				url: attachment.attachmentUrl,
				filename: attachment.attachmentFilename,
			};
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to get attachment download URL', err, {
					materialRequestId,
					attachmentId,
					userId: user?.getId(),
				})
			);
		}
	}

	private async verifyAccessToMaterialRequest(
		materialRequestId: string,
		user: SessionUserEntity,
		referer: string,
		ip: string
	): Promise<MaterialRequest> {
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
				'You do not have permission to access this material request. Only requester and evaluators of the organisation of the material can access it.'
			);
		}

		return materialRequest;
	}

	private toKebabCaseFilename(filename: string): string {
		const parsed = path.parse(filename);
		return `${kebabCase(parsed.name)}${parsed.ext}`;
	}
}
