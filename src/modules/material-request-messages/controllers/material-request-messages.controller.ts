import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	Res,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { IPagination } from '@studiohyperdrive/pagination';
import { AvoFileUploadAssetType, PermissionName } from '@viaa/avo2-types';

import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { AssetsService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { logAndThrow } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/logAndThrow';
import { FilesInterceptor } from '@nestjs/platform-express';
import archiver from 'archiver';
import { mapLimit } from 'blend-promise-utils';
import { addMilliseconds } from 'date-fns';
import type { Request, Response } from 'express';
import { kebabCase } from 'lodash';
import {
	Lookup_App_Material_Request_Message_Type_Enum,
	Lookup_App_Material_Request_Status_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { MaterialRequestMessageBodyAdditionalConditionsDto } from '~modules/material-request-messages/dto/material-request-message-body-additional-conditions.dto';
import { MaterialRequestAttachmentsQueryDto } from '~modules/material-request-messages/dto/material-request-messages.dto';
import {
	MaterialRequestAttachment,
	MaterialRequestAttachmentOrderProp,
	MaterialRequestMessage,
	MaterialRequestMessageBodyAdditionalConditions,
} from '~modules/material-request-messages/material-request-messages.types';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
import { MaterialRequestsService } from '~modules/material-requests/services/material-requests.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { IsEvaluatorGuard } from '~shared/guards/is-evaluator.guard';
import { LocalhostGuard } from '~shared/guards/localhost.guard';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';
import { SortDirection } from '~shared/types';
import { MaterialRequestMessagesService } from '../services/material-request-messages.service';
import { MaterialRequestPdfGeneratorService } from '../services/material-request-pdf-generator';

const ALLOWED_FILE_EXTENSIONS = [
	'pdf',
	'doc',
	'docx',
	'xls',
	'xlsx',
	'jpg',
	'jpeg',
	'png',
	'csv',
	'gif',
	'tiff',
	'tif',
];
const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB
const UPLOAD_FILE_FIELD = 'files';
const MAX_FILE_COUNT = 20;

@UseGuards(LoggedInGuard)
@ApiTags('MaterialRequestMessages')
@Controller('material-requests')
export class MaterialRequestMessagesController {
	constructor(
		private materialRequestMessagesService: MaterialRequestMessagesService,
		private materialRequestsService: MaterialRequestsService,
		private assetsService: AssetsService,
		private materialRequestPdfGenerator: MaterialRequestPdfGeneratorService
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
	public async getMaterialRequestMessages(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Query('page', ParseIntPipe) page: number,
		@Query('size', ParseIntPipe) size: number,
		@Referer() referer: string,
		@Ip() ip: string
	): Promise<IPagination<MaterialRequestMessage>> {
		try {
			await this.verifyAccessToMaterialRequest(materialRequestId, user);

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
		description:
			'Create one or more material request messages with optional file uploads. ' +
			'Each file generates a separate message entry. The first entry contains the message text and the first file. ' +
			'Subsequent entries contain only a file.',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				message: { type: 'string' },
				files: {
					type: 'array',
					items: { type: 'string', format: 'binary' },
				},
			},
			required: ['message'],
		},
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	@UseInterceptors(
		FilesInterceptor(UPLOAD_FILE_FIELD, MAX_FILE_COUNT, {
			limits: { fileSize: MAX_FILE_SIZE_BYTES },
			fileFilter: (_req, file, callback) => {
				const ext = path.extname(file.originalname).slice(1).toLowerCase();
				if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
					return callback(
						new BadRequestException(
							`File type .${ext} is not allowed. Allowed types: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
						),
						false
					);
				}
				callback(null, true);
			},
		})
	)
	public async createMaterialRequestMessage(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Body('message') message: string,
		@UploadedFiles() files?: Express.Multer.File[]
	): Promise<MaterialRequestMessage[]> {
		try {
			const baseTimestamp = Date.now();
			const userId = user.getId();

			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);

			if (!files || files.length === 0) {
				return [
					await this.materialRequestMessagesService.createMessage(
						materialRequest,
						userId,
						Lookup_App_Material_Request_Message_Type_Enum.Message,
						message ? { message } : null
					),
				];
			}

			return await mapLimit(files, 5, async (file, i) => {
				const fileExt = path.extname(file.originalname);
				const attachmentUrl = await this.assetsService.uploadAndTrack(
					AvoFileUploadAssetType.MATERIAL_REQUEST_MESSAGE_ATTACHMENT as any,
					file,
					userId,
					randomUUID() + fileExt
				);
				return this.materialRequestMessagesService.createMessage(
					materialRequest,
					userId,
					Lookup_App_Material_Request_Message_Type_Enum.Message,
					i === 0 ? { message } : null,
					// To ensure the files appear in-order, we tweak the created at date to ensure they are sequential
					addMilliseconds(baseTimestamp, i).toISOString(),
					attachmentUrl,
					file.originalname
				);
			});
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to create material request message', err, {
					materialRequestId,
					userId: user?.getId(),
				})
			);
		}
	}

	@Post(':materialRequestId/extra-conditions/add')
	@UseGuards(IsEvaluatorGuard)
	public async addExtraConditions(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Body('extraConditions') extraConditions: MaterialRequestMessageBodyAdditionalConditionsDto
	): Promise<void> {
		try {
			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);
			await this.materialRequestMessagesService.addExtraConditions(
				materialRequest,
				user.getId(),
				extraConditions
			);
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to add extra conditions to material request', err, {
					materialRequestId,
					userId: user?.getId(),
					extraConditions,
				})
			);
		}
	}

	@Post(':materialRequestId/extra-conditions/:action')
	public async acceptExtraConditions(
		@Param('materialRequestId') materialRequestId: string,
		@Param('action') action: 'accept' | 'decline',
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string,
		@Req() request: Request
	): Promise<void> {
		try {
			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);
			if (user.getId() !== materialRequest.requesterId) {
				throw new ForbiddenException(
					'Only the requester of the material request can accept or decline additional conditions'
				);
			}
			const additionalConditionsEvent = materialRequest.history.find(
				(event) =>
					event.messageType === Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditions
			);
			const hasAdditionalConditionsAlreadyAccepted: boolean = !!materialRequest.history.find(
				(event) =>
					event.messageType ===
					Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsAccepted
			);
			const hasAdditionalConditionsAlreadyDeclined: boolean = !!materialRequest.history.find(
				(event) =>
					event.messageType ===
					Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsDenied
			);
			if (!additionalConditionsEvent) {
				throw new BadRequestException(
					'This material request does not have additional conditions to accept'
				);
			}
			if (hasAdditionalConditionsAlreadyAccepted) {
				throw new BadRequestException(
					'Additional conditions for this material request have already been accepted'
				);
			}
			if (hasAdditionalConditionsAlreadyDeclined) {
				throw new BadRequestException(
					'Additional conditions for this material request have already been declined'
				);
			}
			if (action === 'accept') {
				await this.materialRequestMessagesService.acceptExtraConditions(
					materialRequest,
					user.getId()
				);
				const autoAccept = (
					additionalConditionsEvent.body as MaterialRequestMessageBodyAdditionalConditions
				).autoApproveAfterAcceptAdditionalConditions;
				if (autoAccept) {
					await this.materialRequestsService.updateMaterialRequestStatus(
						materialRequestId,
						{
							status: Lookup_App_Material_Request_Status_Enum.Approved,
							motivation: null,
						},
						user,
						referer,
						ip,
						request.path,
						EventsHelper.getEventId(request)
					);
				} else {
					// The evaluator will still have to manually approve the material request
				}
			} else if (action === 'decline') {
				await this.materialRequestMessagesService.declineExtraConditions(
					materialRequest,
					user.getId()
				);
				await this.materialRequestsService.updateMaterialRequestStatus(
					materialRequestId,
					{
						status: Lookup_App_Material_Request_Status_Enum.Cancelled,
						motivation: null,
					},
					user,
					referer,
					ip,
					request.path,
					EventsHelper.getEventId(request)
				);
			} else {
				throw new BadRequestException(
					'This endpoint only accepts paths: /extra-conditions/accept or /extra-conditions/decline'
				);
			}
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to accept extra conditions of material request', err, {
					materialRequestId,
					userId: user?.getId(),
				})
			);
		}
	}

	@Get(':materialRequestId/attachments')
	@ApiOperation({
		description:
			'Get attachments for a specific material request. Returns paginated list ordered from oldest to newest by default.',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 1',
		example: 1,
	})
	@ApiQuery({
		name: 'size',
		required: false,
		type: Number,
		description: 'The max. number of results to return',
		example: 10,
	})
	@ApiQuery({
		name: 'orderProp',
		required: false,
		enum: MaterialRequestAttachmentOrderProp,
		description: 'Property to sort the results by',
		example: MaterialRequestAttachmentOrderProp.CREATED_AT,
	})
	@ApiQuery({
		name: 'orderDirection',
		required: false,
		enum: SortDirection,
		description: 'Direction to sort in. either desc or asc',
		example: SortDirection.asc,
	})
	@RequireAnyPermissions(
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS
	)
	public async getMaterialRequestAttachments(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Query() queryDto: MaterialRequestAttachmentsQueryDto
	): Promise<IPagination<MaterialRequestAttachment>> {
		try {
			await this.verifyAccessToMaterialRequest(materialRequestId, user);

			return await this.materialRequestMessagesService.findAttachments(
				materialRequestId,
				queryDto.page,
				queryDto.size,
				queryDto.orderProp,
				queryDto.orderDirection
			);
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to get material request attachments', err, {
					materialRequestId,
					userId: user?.getId(),
					page: queryDto.page,
					size: queryDto.size,
					orderProp: queryDto.orderProp,
					orderDirection: queryDto.orderDirection,
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
		@Res() res: Response
	): Promise<void> {
		try {
			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);

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
		@SessionUser() user: SessionUserEntity
	): Promise<{ url: string; filename: string }> {
		try {
			await this.verifyAccessToMaterialRequest(materialRequestId, user);

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
		user: SessionUserEntity
	): Promise<MaterialRequest> {
		const materialRequest = await this.materialRequestsService.findById(
			materialRequestId,
			user,
			false,
			undefined,
			undefined
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

	@Get(':materialRequestId/test-generate-reuse-summary-pdf')
	@UseGuards(LocalhostGuard)
	@ApiOperation({
		description: 'Test PDF generation for a material request reuse form. Localhost only.',
	})
	public async testGenerateReuseSummaryPdf(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ pdfUrl: string }> {
		try {
			const materialRequest = await this.materialRequestsService.findById(
				materialRequestId,
				user,
				false,
				undefined,
				undefined
			);
			const pdfUrl =
				await this.materialRequestPdfGenerator.generateReuseFormPdfAndUpload(materialRequest);
			return {
				pdfUrl: pdfUrl,
			};
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to generate material request PDF', err, {
					materialRequestId,
				})
			);
		}
	}

	@Get(':materialRequestId/test-generate-complete-summary-pdf')
	@UseGuards(LocalhostGuard)
	@ApiOperation({
		description: 'Test PDF generation for a completed material request. Localhost only.',
	})
	public async testGenerateCompleteSummaryPdf(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ pdfUrl: string }> {
		try {
			const materialRequest = await this.materialRequestsService.findById(
				materialRequestId,
				user,
				false,
				undefined,
				undefined
			);
			const pdfUrl =
				await this.materialRequestPdfGenerator.generateFinalSummaryPdfAndUpload(materialRequest);
			return {
				pdfUrl: pdfUrl,
			};
		} catch (err) {
			logAndThrow(
				new CustomError('Failed to generate complete summary PDF', err, {
					materialRequestId,
				})
			);
		}
	}
}
