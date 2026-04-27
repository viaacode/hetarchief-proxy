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
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { IPagination } from '@studiohyperdrive/pagination';
import { AvoFileUploadAssetType, PermissionName } from '@viaa/avo2-types';

import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { AssetsService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { FilesInterceptor } from '@nestjs/platform-express';
import archiver from 'archiver';
import { mapLimit } from 'blend-promise-utils';
import type { Request, Response } from 'express';
import { kebabCase, noop } from 'lodash';
import {
	Lookup_App_Material_Request_Message_Type_Enum,
	Lookup_App_Material_Request_Status_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { ConsentToTrackOption, EmailTemplate, } from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { AddExtraConditionsBodyDto } from '~modules/material-request-messages/dto/material-request-message-body-additional-conditions.dto';
import {
	CreateMaterialRequestMessageDto,
	MaterialRequestAttachmentsQueryDto,
} from '~modules/material-request-messages/dto/material-request-messages.dto';
import {
	ExtraConditionsAction,
	MaterialRequestAttachment,
	MaterialRequestMessage,
	MaterialRequestMessageBodyAdditionalConditions,
} from '~modules/material-request-messages/material-request-messages.types';
import { getStatusEvent } from '~modules/material-requests/material-requests.consts';
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
		private materialRequestPdfGenerator: MaterialRequestPdfGeneratorService,
		private campaignMonitorService: CampaignMonitorService
	) {}

	@Get(':materialRequestId/messages')
	@ApiOperation({
		description:
			'Get messages for a specific materials request. And mark messages as read for the current user.',
	})
	@ApiQuery({
		name: 'page',
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 1',
		example: 1,
	})
	@ApiQuery({
		name: 'size',
		type: Number,
		description: 'The max. number of results to return',
		example: 20,
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
			const error = new CustomError('Failed to get material request messages', err, {
				materialRequestId,
				userId: user?.getId(),
				page,
				size,
			});
			console.log(error);
			error.innerException = null;
			throw error;
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
			await this.verifyAccessToMaterialRequest(materialRequestId, user);
			const count = await this.materialRequestMessagesService.countUnreadMessages(
				materialRequestId,
				user.getId()
			);
			return { count };
		} catch (err) {
			const error = new CustomError('Failed to count material request messages', err, {
				materialRequestId,
				userId: user?.getId(),
			});
			console.log(error);
			error.innerException = null;
			throw error;
		}
	}

	@Post(':materialRequestId/messages')
	@ApiOperation({
		description: 'Create one material request messages with optional file uploads. ',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: CreateMaterialRequestMessageDto })
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
	): Promise<MaterialRequestMessage> {
		try {
			const userId = user.getId();

			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);
			const attachments = files?.length
				? await mapLimit(files, 5, async (file) => {
						const fileExt = path.extname(file.originalname);
						const attachmentUrl = await this.assetsService.uploadAndTrack(
							AvoFileUploadAssetType.MATERIAL_REQUEST_MESSAGE_ATTACHMENT as any,
							file,
							userId,
							randomUUID() + fileExt
						);
						return {
							attachmentUrl,
							attachmentFilename: file.originalname,
						};
					})
				: null;

			return this.materialRequestMessagesService.createMessage(
				materialRequest,
				userId,
				Lookup_App_Material_Request_Message_Type_Enum.Message,
				message ? { message } : null,
				new Date().toISOString(),
				attachments
			);
		} catch (err) {
			const error = new CustomError('Failed to create material request message', err, {
				materialRequestId,
				userId: user?.getId(),
			});
			console.log(error);
			error.innerException = null;
			throw error;
		}
	}

	@Post(':materialRequestId/extra-conditions/add')
	@UseGuards(IsEvaluatorGuard)
	@ApiOperation({
		description: 'Add extra conditions to a material request. Only evaluators can do this.',
	})
	@ApiBody({ type: AddExtraConditionsBodyDto })
	public async addExtraConditions(
		@Param('materialRequestId') materialRequestId: string,
		@SessionUser() user: SessionUserEntity,
		@Body() body: AddExtraConditionsBodyDto
	): Promise<void> {
		try {
			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);
			await this.materialRequestMessagesService.addExtraConditions(
				materialRequest,
				user.getId(),
				body.extraConditions
			);
			// send email to notify requester of additional conditions
			this.materialRequestMessagesService
				.sendEmailForAdditionalConditionsToRequester(materialRequest)
				.then(noop);
		} catch (err) {
			const error = new CustomError('Failed to add extra conditions to material request', err, {
				materialRequestId,
				userId: user?.getId(),
				extraConditions: body.extraConditions,
			});
			console.log(error);
			error.innerException = null;
			throw error;
		}
	}

	/**
	 * Will send a reminder email when additional conditions were added to a material request, but the requester has not yet accepted or declined them within 30 days.
	 * This endpoint will be triggered by a cron job trigger in the hasura database
	 */
	@Post('send-reminders-for-material-request-additional-conditions')
	public async sendRemindersForAdditionalConditions(): Promise<{ message: string }> {
		const materialRequestsWithPendingAdditionalConditions =
			await this.materialRequestsService.findMaterialRequestsWithPendingAdditionalConditions();
		await mapLimit(materialRequestsWithPendingAdditionalConditions, 5, async (materialRequest) => {
			await this.campaignMonitorService.sendTransactionalMail(
				{
					template:
						EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_ADDITIONAL_REQUIREMENTS_REMINDER,
					data: {
						to: materialRequest.requesterMail,
						replyTo: materialRequest.contactMail,
						consentToTrack: ConsentToTrackOption.UNCHANGED,
						data: this.campaignMonitorService.convertMaterialRequestToEmailTemplateFields(
							materialRequest
						),
					},
				},
				materialRequest.requesterLanguage
			);
		});
		return {
			message: `Sent ${materialRequestsWithPendingAdditionalConditions.length} reminders for pending additional conditions for material requests`,
		};
	}

	@Post(':materialRequestId/extra-conditions/:action')
	@ApiOperation({
		description:
			'Accept or decline extra conditions for a material request. Only the requester can perform this action. Use "accept" or "decline" as the action path parameter.',
	})
	@ApiParam({
		name: 'action',
		enum: ExtraConditionsAction,
		description: 'Whether to accept or decline the extra conditions',
	})
	public async acceptOrDeclineExtraConditions(
		@Param('materialRequestId') materialRequestId: string,
		@Param('action') action: ExtraConditionsAction,
		@SessionUser() user: SessionUserEntity,
		@Referer() referer: string,
		@Ip() ip: string,
		@Req() request: Request
	): Promise<void> {
		try {
			// Validate access for current user and material request
			const materialRequest = await this.verifyAccessToMaterialRequest(materialRequestId, user);
			if (user.getId() !== materialRequest.requesterId) {
				throw new ForbiddenException(
					'Only the requester of the material request can accept or decline additional conditions'
				);
			}
			const additionalConditionsEvent = getStatusEvent(
				materialRequest.history,
				Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditions
			);
			const hasAdditionalConditionsAlreadyAccepted: boolean = !!getStatusEvent(
				materialRequest.history,
				Lookup_App_Material_Request_Message_Type_Enum.AdditionalConditionsAccepted
			);
			const hasAdditionalConditionsAlreadyDeclined: boolean = !!getStatusEvent(
				materialRequest.history,
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
			if (action === ExtraConditionsAction.ACCEPT) {
				await this.materialRequestMessagesService.acceptExtraConditions(
					materialRequest,
					user.getId()
				);
				// Send email for the acceptance of the additional conditions
				this.materialRequestMessagesService
					.sendEmailForAcceptanceOfAdditionalConditionsToEvaluators(materialRequest, user.getId())
					.then(noop);

				// Check if whole material request should be approved
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
			} else if (action === ExtraConditionsAction.DECLINE) {
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
			const error = new CustomError('Failed to accept extra conditions of material request', err, {
				materialRequestId,
				userId: user?.getId(),
			});
			console.log(error);
			error.innerException = null;
			throw error;
		}
	}

	@Get(':materialRequestId/attachments')
	@ApiOperation({
		description:
			'Get attachments for a specific material request. Returns paginated list ordered from oldest to newest by default.',
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
			const error = new CustomError('Failed to get material request attachments', err, {
				materialRequestId,
				userId: user?.getId(),
				page: queryDto.page,
				size: queryDto.size,
				orderProp: queryDto.orderProp,
				orderDirection: queryDto.orderDirection,
			});
			console.log(error);
			error.innerException = null;
			throw error;
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
				const error = new CustomError(
					'Failed to download material request attachments as zip',
					err,
					{
						materialRequestId,
						userId: user?.getId(),
					}
				);
				console.log(error);
				throw error;
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
			const error = new CustomError('Failed to get attachment download URL', err, {
				materialRequestId,
				attachmentId,
				userId: user?.getId(),
			});
			console.log(error);
			error.innerException = null;
			throw error;
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

		if (materialRequest.isArchived) {
			throw new NotFoundException(
				'This material request is archived. No messages or attachments are available.'
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
			const error = new CustomError('Failed to generate material request PDF', err, {
				materialRequestId,
			});
			console.log(error);
			error.innerException = null;
			throw error;
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
			const error = new CustomError('Failed to generate complete summary PDF', err, {
				materialRequestId,
			});
			console.log(error);
			error.innerException = null;
			throw error;
		}
	}
}
