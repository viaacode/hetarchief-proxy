import { parse } from 'node:path';
import {
	AssetsService,
	DataService,
	Locale,
	StillsObjectType,
	VideoStillsService,
} from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { mapLimit } from 'blend-promise-utils';
import { compact, groupBy, intersection, isArray, isEmpty, isNil, kebabCase, noop, set, } from 'lodash';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	SendRequestListDto,
	UpdateMaterialRequestStatusDto,
} from '../dto/material-requests.dto';
import {
	getAdditionEventDate,
	MAP_MATERIAL_REQUEST_STATUS_TO_EMAIL_TEMPLATE,
	MAP_MATERIAL_REQUEST_STATUS_TO_EVENT_TYPE,
	ORDER_PROP_TO_DB_PROP,
	getAdditionEventDate,
	getStatusEvent,
} from '../material-requests.consts';
import {
	GqlMaterialRequest,
	GqlMaterialRequestMaintainer,
	MaterialRequest,
	MaterialRequestDurationType,
	MaterialRequestExportQuality,
	MaterialRequestForDownload,
	MaterialRequestMaintainer,
	MaterialRequestOrderProp,
	MaterialRequestReuseForm,
	MaterialRequestReuseFormKey,
	MaterialRequestSendRequestListUserInfo,
} from '../material-requests.types';

import {
	type App_Material_Requests_Bool_Exp,
	type App_Material_Requests_Set_Input,
	DeleteMaterialRequestDocument,
	type DeleteMaterialRequestMutation,
	type DeleteMaterialRequestMutationVariables,
	FindMaintainersWithMaterialRequestsDocument,
	type FindMaintainersWithMaterialRequestsQuery,
	type FindMaintainersWithMaterialRequestsQueryVariables,
	FindMaterialRequestsByIdDocument,
	type FindMaterialRequestsByIdQuery,
	type FindMaterialRequestsByIdQueryVariables,
	FindMaterialRequestsDocument,
	type FindMaterialRequestsQuery,
	type FindMaterialRequestsQueryVariables,
	FindMaterialRequestsReadyToArchiveDocument,
	FindMaterialRequestsReadyToArchiveQuery,
	FindMaterialRequestsReadyToArchiveQueryVariables,
	FindMaterialRequestsWithAlmostExpiredDownloadDocument,
	FindMaterialRequestsWithAlmostExpiredDownloadQuery,
	FindMaterialRequestsWithAlmostExpiredDownloadQueryVariables,
	FindMaterialRequestsWithExpiredDownloadDocument,
	FindMaterialRequestsWithExpiredDownloadQuery,
	FindMaterialRequestsWithExpiredDownloadQueryVariables,
	FindMaterialRequestsWithUnresolvedDownloadStatusDocument,
	FindMaterialRequestsWithUnresolvedDownloadStatusQuery,
	GetMaterialRequestByJobIdForDownloadJobDocument,
	GetMaterialRequestByJobIdForDownloadJobQueryVariables,
	GetMaterialRequestForDownloadJobDocument,
	GetMaterialRequestForDownloadJobQuery,
	GetMaterialRequestForDownloadJobQueryVariables,
	InsertMaterialRequestDocument,
	type InsertMaterialRequestMutation,
	type InsertMaterialRequestMutationVariables,
	InsertMaterialRequestReuseFormDocument,
	InsertMaterialRequestReuseFormMutation,
	InsertMaterialRequestReuseFormMutationVariables,
	Lookup_App_Material_Request_Download_Status_Enum,
	Lookup_App_Material_Request_Message_Type_Enum,
	Lookup_App_Material_Request_Requester_Capacity_Enum,
	Lookup_App_Material_Request_Status_Enum,
	Lookup_App_Material_Request_Type_Enum,
	Lookup_Languages_Enum,
	UpdateMaterialRequestDocument,
	UpdateMaterialRequestForUserDocument,
	UpdateMaterialRequestForUserMutation,
	UpdateMaterialRequestForUserMutationVariables,
	type UpdateMaterialRequestMutation,
	type UpdateMaterialRequestMutationVariables,
	UpdateMaterialRequestStatusDocument,
	UpdateMaterialRequestStatusMutation,
	UpdateMaterialRequestStatusMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { EmailTemplate, type MaterialRequestEmailInfo, } from '~modules/campaign-monitor/campaign-monitor.types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import {
	type IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	type IeObjectSector,
	IeObjectsVisitorSpaceInfo,
	IeObjectType,
	SimpleIeObjectType,
} from '~modules/ie-objects/ie-objects.types';
import type { Organisation } from '~modules/organisations/organisations.types';

import { OrganisationsService } from '~modules/organisations/services/organisations.service';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { ConfigService } from '@nestjs/config';
import { AvoStillsStillInfo, AvoUserCommonUser } from '@viaa/avo2-types';
import { addDays, addMonths, isWithinInterval, subDays, subMonths } from 'date-fns';
import type { Configuration } from '~config';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { limitAccessToObjectDetails } from '~modules/ie-objects/helpers/limit-access-to-object-details';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import { IE_OBJECT_INTRA_CP_LICENSES } from '~modules/ie-objects/ie-objects.conts';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { MaterialRequestEvent } from '~modules/material-request-messages/material-request-messages.types';
import { MaterialRequestMessagesService } from '~modules/material-request-messages/services/material-request-messages.service';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { GroupName } from '~modules/users/types';
import { AUDIO_WAVE_FORM_URL } from '~shared/consts/audio-wave-form-url';
import { customError } from '~shared/helpers/custom-error';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class MaterialRequestsService {
	constructor(
		private dataService: DataService,
		private campaignMonitorService: CampaignMonitorService,
		private organisationsService: OrganisationsService,
		private spacesService: SpacesService,
		private ieObjectsService: IeObjectsService,
		private videoStillsService: VideoStillsService,
		private usersService: UsersService,
		private eventsService: EventsService,
		private mediahavenJobWatcherService: MediahavenJobsWatcherService,
		private configService: ConfigService<Configuration>,
		private materialRequestMessageService: MaterialRequestMessagesService,
		private assetsService: AssetsService
	) {}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		isPersonal: boolean,
		user: SessionUserEntity,
		resolveThumbnailUrl: boolean,
		referer: string,
		ip: string
	): Promise<IPagination<MaterialRequest>> {
		const {
			query,
			type,
			status,
			hasDownloadUrl,
			maintainerIds,
			isPending,
			isArchived,
			page,
			size,
			orderProp,
			orderDirection,
		} = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: App_Material_Requests_Bool_Exp = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			// Everyone should be able to search on the IE Objects name
			where._or = [{ intellectualEntity: { schema_name: { _ilike: query } } }];

			if (isPersonal) {
				// So these are outgoing requests
				where._or = [
					...where._or,
					{
						intellectualEntity: {
							schemaMaintainer: { skos_pref_label: { _ilike: query } },
						},
					},
					{ name: { _ilike: query } },
				];
			} else {
				// Incoming requests
				where._or = [
					...where._or,
					{ requested_by: { full_name: { _ilike: query } } },
					{ requested_by: { full_name_reversed: { _ilike: query } } },
					{ requested_by: { mail: { _ilike: query } } },
				];
			}
		}

		if (isPersonal && !isEmpty(user.getId())) {
			where.profile_id = { _eq: user.getId() };
		}

		if (!isEmpty(type)) {
			where.type = {
				_in: isArray(type) ? type : [type],
			};
		}

		if (!isEmpty(status)) {
			where.status = {
				_in: isArray(status) ? status : [status],
			};
		}

		if (!isEmpty(maintainerIds)) {
			where.intellectualEntity = {
				schemaMaintainer: {
					org_identifier: {
						_in: isArray(maintainerIds) ? maintainerIds : [maintainerIds],
					},
				},
			};
		}

		if (!isNil(isPending)) {
			where.is_pending = {
				_eq: isPending,
			};
		}

		if (!isNil(isArchived)) {
			where.is_archived = {
				_eq: isArchived,
			};
		}

		if (!isNil(hasDownloadUrl)) {
			const downloadUrlQuery = [];

			if (hasDownloadUrl.includes('true')) {
				downloadUrlQuery.push({
					_and: [
						{ download_url: { _is_null: false } },
						{
							download_url: { _neq: '' },
						},
						{
							download_status: {
								_eq: 'SUCCEEDED',
							},
						},
					],
				});
			}

			if (hasDownloadUrl.includes('false')) {
				downloadUrlQuery.push({
					_and: [
						{
							_or: [
								{ download_url: { _is_null: true } },
								{ download_url: { _eq: '' } },
								{
									download_status: {
										_neq: 'SUCCEEDED',
									},
								},
							],
						},
						{
							status: {
								_in: [
									Lookup_App_Material_Request_Status_Enum.Approved,
									Lookup_App_Material_Request_Status_Enum.Denied,
								],
							},
						},
					],
				});
			}

			where._and = [
				...(where._and || []),
				{ type: { _eq: Lookup_App_Material_Request_Type_Enum.Reuse } },
				{ _or: downloadUrlQuery },
			];
		}

		const orderBy = [
			set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP.requestedAt,
				orderDirection || SortDirection.desc
			),
		];

		if (orderProp === MaterialRequestOrderProp.STATUS) {
			// In case we have requested without a requestedAt, we sort them on creation date
			orderBy.push(set({}, ORDER_PROP_TO_DB_PROP.requestedAt, SortDirection.desc));
			orderBy.push(set({}, ORDER_PROP_TO_DB_PROP.createdAt, SortDirection.desc));
		}

		if (
			(ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP.requestedAt) ===
			ORDER_PROP_TO_DB_PROP.requestedAt
		) {
			// In case we have requested without a requestedAt, we sort them on creation date
			orderBy.push(set({}, ORDER_PROP_TO_DB_PROP.createdAt, orderDirection || SortDirection.desc));
		}

		const materialRequestsResponse = await this.dataService.execute<
			FindMaterialRequestsQuery,
			FindMaterialRequestsQueryVariables
		>(FindMaterialRequestsDocument, {
			where,
			offset,
			limit,
			orderBy,
		});
		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact(
				materialRequestsResponse.app_material_requests.map(
					(matRequest) => matRequest?.intellectualEntity?.schemaMaintainer?.org_identifier
				)
			)
		);
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		return Pagination<MaterialRequest>({
			items: await Promise.all(
				materialRequestsResponse.app_material_requests.map((mr) =>
					this.adapt(
						mr,
						resolveThumbnailUrl,
						organisations,
						visitorSpaceAccessInfo,
						user,
						referer,
						ip
					)
				)
			),
			page,
			size,
			total: materialRequestsResponse.app_material_requests_aggregate.aggregate.count,
		});
	}

	public async findById(
		id: string,
		user: SessionUserEntity,
		resolveThumbnailUrl: boolean,
		referer: string,
		ip: string
	): Promise<MaterialRequest> {
		const materialRequestResponse = await this.dataService.execute<
			FindMaterialRequestsByIdQuery,
			FindMaterialRequestsByIdQueryVariables
		>(FindMaterialRequestsByIdDocument, { id });

		if (isNil(materialRequestResponse) || !materialRequestResponse.app_material_requests[0]) {
			throw new NotFoundException(`Material Request with id '${id}' not found`);
		}

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact(
				materialRequestResponse.app_material_requests.map(
					(matRequest) => matRequest?.intellectualEntity?.schemaMaintainer?.org_identifier
				)
			)
		);

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		return this.adapt(
			materialRequestResponse.app_material_requests[0],
			resolveThumbnailUrl,
			organisations,
			visitorSpaceAccessInfo,
			user,
			referer,
			ip
		);
	}

	public async findMaintainers(): Promise<MaterialRequestMaintainer[] | []> {
		const response = await this.dataService.execute<
			FindMaintainersWithMaterialRequestsQuery,
			FindMaintainersWithMaterialRequestsQueryVariables
		>(FindMaintainersWithMaterialRequestsDocument, {});

		if (isNil(response) || !response.graph_organisations_with_material_requests[0]) {
			return [];
		}

		const maintainers = response.graph_organisations_with_material_requests;
		return maintainers.map((maintainer: GqlMaterialRequestMaintainer) =>
			this.adaptMaintainers(maintainer)
		);
	}

	public async createMaterialRequest(
		createMaterialRequestDto: CreateMaterialRequestDto,
		user: SessionUserEntity,
		referer: string,
		ip: string
	): Promise<MaterialRequest> {
		const variables: InsertMaterialRequestMutationVariables = {
			newMaterialRequest: {
				ie_object_id: createMaterialRequestDto.objectId,
				profile_id: user.getId(),
				reason: createMaterialRequestDto.reason,
				type: createMaterialRequestDto.type,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				is_pending: true,
				organisation: createMaterialRequestDto?.organisation || user.getOrganisationName(),
				organisation_sector: user.getSector(),
				requester_capacity:
					createMaterialRequestDto?.requesterCapacity ||
					Lookup_App_Material_Request_Requester_Capacity_Enum.Other,
				ie_object_representation_id: createMaterialRequestDto.objectRepresentationId,
			},
		};

		const createdMaterialRequestResponse = await this.dataService.execute<
			InsertMaterialRequestMutation,
			InsertMaterialRequestMutationVariables
		>(InsertMaterialRequestDocument, variables);
		const createdMaterialRequest = createdMaterialRequestResponse.insert_app_material_requests_one;

		createdMaterialRequest.material_request_reuse_form_values =
			await this.insertReuseFormForMaterialRequest(
				createdMaterialRequest.id,
				createdMaterialRequest.ie_object_representation_id,
				createMaterialRequestDto.reuseForm,
				createdMaterialRequest?.intellectualEntity?.dctermsFormat?.[0]
					.dcterms_format as IeObjectType
			);

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([createdMaterialRequest?.intellectualEntity?.schemaMaintainer?.org_identifier])
		);
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		return this.adapt(
			createdMaterialRequest,
			true,
			organisations,
			visitorSpaceAccessInfo,
			user,
			referer,
			ip
		);
	}

	public async updateMaterialRequestForUser(
		materialRequestId: string,
		user: SessionUserEntity,
		materialRequestInfo: Pick<
			App_Material_Requests_Set_Input,
			| 'type'
			| 'reason'
			| 'organisation'
			| 'organisation_sector'
			| 'requester_capacity'
			| 'is_pending'
			| 'status'
			| 'name'
			| 'group_id'
			| 'requested_at'
			| 'cancelled_at'
		>,
		reuseForm: Record<string, string> | MaterialRequestReuseForm | undefined,
		referer: string,
		ip: string
	): Promise<MaterialRequest> {
		const updateMaterialRequest = {
			...materialRequestInfo,
			updated_at: new Date().toISOString(),
		};

		const { update_app_material_requests: updatedMaterialRequest } = await this.dataService.execute<
			UpdateMaterialRequestForUserMutation,
			UpdateMaterialRequestForUserMutationVariables
		>(UpdateMaterialRequestForUserDocument, {
			materialRequestId,
			userProfileId: user.getId(),
			updateMaterialRequest,
		});

		const updatedRequest = updatedMaterialRequest.returning?.[0];

		if (isEmpty(updatedRequest)) {
			throw new BadRequestException(
				`Material request (${materialRequestId}) could not be updated.`
			);
		}

		updatedRequest.material_request_reuse_form_values =
			await this.insertReuseFormForMaterialRequest(
				materialRequestId,
				updatedRequest.ie_object_representation_id,
				materialRequestInfo.type === Lookup_App_Material_Request_Type_Enum.Reuse
					? reuseForm
					: undefined,
				updatedRequest?.intellectualEntity?.dctermsFormat?.[0]?.dcterms_format as IeObjectType
			);

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([updatedRequest?.intellectualEntity?.schemaMaintainer?.org_identifier])
		);
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		return this.adapt(
			updatedRequest,
			true,
			organisations,
			visitorSpaceAccessInfo,
			user,
			referer,
			ip
		);
	}

	public async deleteMaterialRequest(
		materialRequestId: string,
		userProfileId: string
	): Promise<number> {
		const response = await this.dataService.execute<
			DeleteMaterialRequestMutation,
			DeleteMaterialRequestMutationVariables
		>(DeleteMaterialRequestDocument, {
			materialRequestId,
			userProfileId,
		});

		return response.delete_app_material_requests.affected_rows;
	}

	private validateStatusTransition(
		currentRequest: MaterialRequest,
		newStatus: Lookup_App_Material_Request_Status_Enum,
		user: SessionUserEntity
	) {
		const isRequester = currentRequest.requesterId === user.getId();
		const isEvaluatorOfCp =
			user.getOrganisationId() === currentRequest.maintainerId && user.getIsEvaluator();
		const isUserAllowedToCancel = isRequester;

		// Non meemoo admins should be of the same organisation in order to update the status
		const isUserAllowedToAdvanceStatus =
			!isRequester && (isEvaluatorOfCp || user.getGroupName() === GroupName.MEEMOO_ADMIN);

		// User is not allowed to do anything with the status
		if (!isUserAllowedToCancel && !isUserAllowedToAdvanceStatus) {
			throw new BadRequestException(
				`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
			);
		}

		if (currentRequest.status === Lookup_App_Material_Request_Status_Enum.New) {
			// The current status is still NEW, and we are not trying to set the status to cancelled or pending => Not allowed
			if (
				newStatus !== Lookup_App_Material_Request_Status_Enum.Cancelled &&
				newStatus !== Lookup_App_Material_Request_Status_Enum.Pending
			) {
				throw new BadRequestException(
					`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
				);
			}

			// Trying to update the status to cancelled, but user is not the one who made the request
			if (
				newStatus === Lookup_App_Material_Request_Status_Enum.Cancelled &&
				!isUserAllowedToCancel
			) {
				throw new BadRequestException(
					`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
				);
			}

			// Trying to update the status to pending, but user is the one who made the request or the user is not part of the same organisation
			if (
				newStatus === Lookup_App_Material_Request_Status_Enum.Pending &&
				!isUserAllowedToAdvanceStatus
			) {
				throw new BadRequestException(
					`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
				);
			}
		} else if (currentRequest.status === Lookup_App_Material_Request_Status_Enum.Pending) {
			// The current status is PENDING, and we are not trying to set the status to APPROVED or DENIED => Not allowed
			if (
				newStatus !== Lookup_App_Material_Request_Status_Enum.Approved &&
				newStatus !== Lookup_App_Material_Request_Status_Enum.Denied
			) {
				throw new BadRequestException(
					`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
				);
			}

			// Trying to update the status to APPROVED or DENIED, but user is the one who made the request or the user is not part of the same organisation
			if (!isUserAllowedToAdvanceStatus) {
				throw new BadRequestException(
					`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
				);
			}
		} else {
			// No other status updates are allowed
			throw new BadRequestException(
				`Material request (${currentRequest.id}) could not be set to ${newStatus}.`
			);
		}
	}

	public async updateMaterialRequestStatus(
		materialRequestId: string,
		statusOptions: UpdateMaterialRequestStatusDto,
		user: SessionUserEntity,
		referer: string,
		ip: string,
		requestPath: string,
		eventId?: string
	): Promise<MaterialRequest> {
		const currentRequest = await this.findById(
			materialRequestId,
			user,
			false,
			undefined,
			undefined
		);

		const { status, motivation } = statusOptions;

		this.validateStatusTransition(currentRequest, status, user);

		if (status === Lookup_App_Material_Request_Status_Enum.Cancelled) {
			await this.materialRequestMessageService.createMessage(
				currentRequest,
				user.getId(),
				Lookup_App_Material_Request_Message_Type_Enum.Cancelled
			);
		} else if (status === Lookup_App_Material_Request_Status_Enum.Approved) {
			await this.materialRequestMessageService.createMessage(
				currentRequest,
				user.getId(),
				Lookup_App_Material_Request_Message_Type_Enum.Approved,
				{ motivation }
			);
		} else if (status === Lookup_App_Material_Request_Status_Enum.Denied) {
			await this.materialRequestMessageService.createMessage(
				currentRequest,
				user.getId(),
				Lookup_App_Material_Request_Message_Type_Enum.Denied,
				{ motivation }
			);
		}

		const updateMaterialRequestStatusResponse = await this.dataService.execute<
			UpdateMaterialRequestStatusMutation,
			UpdateMaterialRequestStatusMutationVariables
		>(UpdateMaterialRequestStatusDocument, {
			materialRequestId: currentRequest.id,
			updateMaterialRequest: {
				status: status,
				updated_at: new Date().toISOString(),
			},
		});

		const graphQlMaterialRequest =
			updateMaterialRequestStatusResponse.update_app_material_requests_by_pk;

		if (isEmpty(graphQlMaterialRequest)) {
			const error = customError('Failed to update material request status', null, {
				response: updateMaterialRequestStatusResponse,
			});
			console.error(error);
			throw new BadRequestException(
				`Material request (${currentRequest.id}) could not be set to ${status}.`
			);
		}

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([graphQlMaterialRequest?.intellectualEntity?.schemaMaintainer?.org_identifier])
		);
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const updatedRequest = await this.adapt(
			graphQlMaterialRequest,
			true,
			organisations,
			visitorSpaceAccessInfo,
			user,
			referer,
			ip
		);

		this.trackMaterialRequestStatusChangeEvent(updatedRequest, requestPath, user?.getId(), eventId);

		if (updatedRequest.status === Lookup_App_Material_Request_Status_Enum.Approved) {
			// If the request is approved, we need to start prepping the download
			const materialRequestForDownload = await this.getMaterialRequestForDownloadJob(
				updatedRequest.id
			);
			await this.mediahavenJobWatcherService.createExportJob(materialRequestForDownload);
		}

		if (
			updatedRequest.status === Lookup_App_Material_Request_Status_Enum.Denied ||
			updatedRequest.status === Lookup_App_Material_Request_Status_Enum.Cancelled
		) {
			// Generate a summary PDF of the reuse form and store it in a REUSE_SUMMARY message
			await this.materialRequestMessageService.createFinalSummaryMessage(
				updatedRequest,
				user.getId()
			);
		}

		const emailTemplateToSend = MAP_MATERIAL_REQUEST_STATUS_TO_EMAIL_TEMPLATE[status];

		if (updatedRequest && emailTemplateToSend) {
			const requesterUser = await this.usersService.getById(updatedRequest.requesterId);
			await this.sentStatusUpdateEmail(emailTemplateToSend, updatedRequest, requesterUser);
		}

		return updatedRequest;
	}

	public isSendToMaintainerEmailTemplate(template: EmailTemplate): boolean {
		return (
			template === EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER_CANCELLED ||
			template ===
				EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_READY_MAINTAINER
		);
	}

	public async sentStatusUpdateEmail(
		template: EmailTemplate,
		request: MaterialRequest,
		requesterUser: AvoUserCommonUser
	): Promise<void> {
		try {
			// Emailed maintainer when the requester cancelled their request
			// Emailed the requester when the maintainer approved or denied the request
			const sentToMaintainer = this.isSendToMaintainerEmailTemplate(template);

			const emailInfo: MaterialRequestEmailInfo = {
				to: sentToMaintainer ? request.contactMail : request.requesterMail,
				replyTo: sentToMaintainer ? request.requesterMail : null,
				template,
				language: sentToMaintainer ? Locale.Nl : (requesterUser.language as Lookup_Languages_Enum),
				materialRequests: [request],
				sendRequestListDto: {
					type: request.requesterCapacity,
					organisation: request.requesterOrganisation,
					requestGroupName: request.requestGroupName,
				},
				requesterFirstName: requesterUser.firstName,
				requesterLastName: requesterUser.lastName,
			};

			await this.campaignMonitorService.sendForMaterialRequest(emailInfo);
		} catch (err) {
			const error = customError('Failed to send email about material request status update', err, {
				template,
				request,
				requesterUser,
			});
			console.error(error);
			// Do not throw errors when email cannot be sent
		}
	}

	/**
	 * Send a list of objects as material requests to various maintainers and an overview of all objects to the requester
	 * @param materialRequests
	 * @param sendRequestListDto
	 * @param userInfo
	 */
	public async sendRequestList(
		materialRequests: MaterialRequest[],
		sendRequestListDto: SendRequestListDto,
		userInfo: MaterialRequestSendRequestListUserInfo
	): Promise<void> {
		try {
			const groupedMaterialRequests: any = groupBy(materialRequests, 'maintainerId');
			const groupedArray = [];

			for (const key of Object.keys(groupedMaterialRequests)) {
				groupedArray.push(groupedMaterialRequests[key]);
			}

			// Send mail to each maintainer containing only material requests for objects they are the maintainer of
			await Promise.all(
				groupedArray.map(async (materialRequests: MaterialRequest[]) => {
					const emailInfo: MaterialRequestEmailInfo = {
						// Each materialRequest in this group has the same maintainer, otherwise, the maintainer will receive multiple mails
						to: materialRequests[0].contactMail,
						replyTo: materialRequests[0]?.requesterMail,
						template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER,
						materialRequests: materialRequests,
						sendRequestListDto,
						requesterFirstName: userInfo.firstName,
						requesterLastName: userInfo.lastName,
						language: userInfo.language,
					};
					await this.campaignMonitorService.sendForMaterialRequest(emailInfo);
				})
			);

			// Send mail to the requester containing all of their material requests for all the objects they requested
			const emailInfo: MaterialRequestEmailInfo = {
				to: materialRequests[0]?.requesterMail,
				replyTo: null, // Reply to support@meemoo.be
				template: EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER,
				materialRequests: materialRequests,
				sendRequestListDto,
				requesterFirstName: userInfo.firstName,
				requesterLastName: userInfo.lastName,
				language: userInfo.language,
			};
			await this.campaignMonitorService.sendForMaterialRequest(emailInfo);
		} catch (err) {
			const error = {
				message: 'Failed to send the material requests',
				innerException: err,
			};
			console.error(error);
			throw new InternalServerErrorException(error);
		}
	}

	private insertReuseFormForMaterialRequest = async (
		materialRequestId: string,
		representationId: string,
		reuseForm: Record<string, string> | MaterialRequestReuseForm,
		ieObjectType: IeObjectType
	) => {
		if (reuseForm) {
			// Avoid duplicate thumbnails so filtering the original in favor of a more accurate one
			const keys = Object.keys(reuseForm).filter(
				(key) => key !== MaterialRequestReuseFormKey.thumbnailUrl
			);

			// For audio objects we don't need to do a request to the video stills service, since we just want to show a waveform
			let thumbnailUrl: string;
			if (mapDcTermsFormatToSimpleType(ieObjectType) === IeObjectType.AUDIO) {
				thumbnailUrl = AUDIO_WAVE_FORM_URL;
			} else {
				thumbnailUrl = await this.findVideoStillForMaterialRequest(representationId, reuseForm);
			}
			const reuseFormVariables: InsertMaterialRequestReuseFormMutationVariables = {
				keyValues: [
					...keys.map((key) => ({
						material_request_id: materialRequestId,
						key,
						value: reuseForm[key]?.toString(),
					})),
					{
						material_request_id: materialRequestId,
						key: MaterialRequestReuseFormKey.thumbnailUrl,
						value: thumbnailUrl,
					},
				],
			};

			const { insert_app_material_request_reuse_form_values: createdMaterialRequestFormValues } =
				await this.dataService.execute<
					InsertMaterialRequestReuseFormMutation,
					InsertMaterialRequestReuseFormMutationVariables
				>(InsertMaterialRequestReuseFormDocument, reuseFormVariables);

			return createdMaterialRequestFormValues.returning;
		}
	};

	/**
	 * Gets the video still closest to the cut point that is passed
	 * This function should only be used for video files, audio should return the default wave form AUDIO_WAVE_FORM_URL and newspapers don't need stills
	 * if you use this function for audio, you'll get an ugly speaker
	 * @param representationId
	 * @param reuseForm
	 * @private
	 */
	private async findVideoStillForMaterialRequest(
		representationId: string,
		reuseForm: Record<string, string> | MaterialRequestReuseForm
	): Promise<string | null> {
		const startTime = Number.parseInt(reuseForm?.startTime.toString());

		if (startTime && startTime > 0 && representationId) {
			const mediaFile =
				await this.ieObjectsService.getVideoFileByRepresentationId(representationId);
			const stillInfos = await this.videoStillsService.getFirstVideoStills([
				{
					id: mediaFile.id,
					storedAt: mediaFile.storedAt,
					type: StillsObjectType.video,
					startTime: startTime * 1000,
				},
			]);
			const filteredInfos = (stillInfos?.filter((item) => !isNil(item)) ||
				[]) as AvoStillsStillInfo[];

			if (filteredInfos.length) {
				return filteredInfos[0].thumbnailImagePath;
			}
		}

		return null;
	}

	public isComplexReuseFlow(
		ieObjectType: IeObjectType,
		ieObjectLicenses: IeObjectLicense[],
		isKeyUser: boolean
	): boolean {
		const simpleType = mapDcTermsFormatToSimpleType(ieObjectType);
		return (
			(simpleType === SimpleIeObjectType.AUDIO || simpleType === SimpleIeObjectType.VIDEO) &&
			isKeyUser &&
			intersection(ieObjectLicenses, IE_OBJECT_INTRA_CP_LICENSES).length > 0
		);
	}

	/**
	 * Adapt a material request as returned by a graphQl response to our internal model
	 */
	public async adapt(
		graphQlMaterialRequest: GqlMaterialRequest,
		resolveThumbnailUrl: boolean,
		organisations?: Organisation[],
		visitorSpaceAccessInfo?: IeObjectsVisitorSpaceInfo,
		user?: SessionUserEntity,
		referer?: string,
		ip?: string
	): Promise<MaterialRequest | null> {
		if (!graphQlMaterialRequest) {
			return null;
		}

		const organisation = organisations?.find(
			(org) =>
				org.schemaIdentifier ===
				graphQlMaterialRequest.intellectualEntity?.schemaMaintainer?.org_identifier
		);

		let reuseForm: MaterialRequest['reuseForm'];
		try {
			for (const keyValue of graphQlMaterialRequest.material_request_reuse_form_values) {
				if (!reuseForm) {
					reuseForm = {};
				}

				if (keyValue.key === 'startTime' || keyValue.key === 'endTime') {
					const parsed = Number.parseFloat(keyValue.value);
					reuseForm[keyValue.key] = Number.isNaN(parsed) ? null : parsed;
				} else {
					reuseForm[keyValue.key] = keyValue.value;
				}
			}
		} catch (_) {
			reuseForm = null;
		}

		const rawObject: GqlMaterialRequest['intellectualEntity'] =
			graphQlMaterialRequest.intellectualEntity;
		const objectId = rawObject?.id;
		const objectSchemaIdentifier = rawObject?.schema_identifier;
		let objectAccessThrough: IeObjectAccessThrough[] = [];
		let objectLicences: IeObjectLicense[] = [];
		let hasAccessToEssence = false;
		if (user && objectId) {
			const objectForAccessChecks: Pick<
				IeObject,
				'licenses' | 'schemaIdentifier' | 'maintainerId' | 'sector'
			> = {
				maintainerId: rawObject.schemaMaintainer.org_identifier,
				schemaIdentifier: rawObject.schema_identifier,
				licenses: rawObject.schemaLicenses.map(
					(license) => license.schema_license
				) as IeObjectLicense[],
				sector: rawObject.schemaMaintainer.ha_org_sector as IeObjectSector,
			};
			const access = this.getAccessThroughAndLicences(
				objectForAccessChecks,
				visitorSpaceAccessInfo,
				user
			);
			objectAccessThrough = access.objectAccessThrough;
			objectLicences = access.objectLicences;
			hasAccessToEssence = access.hasAccessToEssence;
		}

		const isPublicDomain: boolean =
			objectLicences?.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
			objectLicences?.includes(IeObjectLicense.PUBLIC_DOMAIN);

		let objectThumbnailUrl: string | undefined;
		const ieObjectThumbnailUrl = rawObject?.schemaThumbnail?.schema_thumbnail_url?.[0];
		const isComplexFlow = this.isComplexReuseFlow(
			rawObject?.dctermsFormat?.[0]?.dcterms_format as IeObjectType,
			objectLicences,
			user?.getIsKeyUser()
		);

		if (!hasAccessToEssence || !resolveThumbnailUrl) {
			objectThumbnailUrl = undefined;
		} else if (isComplexFlow) {
			// New material request with reuse form flow
			if (graphQlMaterialRequest.ie_object_representation_id) {
				// If we know exactly which video of the ie object the user is requesting material for, we can get the thumbnail url for that specific representation
				objectThumbnailUrl = await this.ieObjectsService.getThumbnailUrlWithToken(
					reuseForm?.thumbnailUrl || ieObjectThumbnailUrl,
					referer,
					ip,
					isPublicDomain
				);
			} else {
				// The user doesn't have access to the ie object essence (video), so we should not show any thumbnail for this material request
				objectThumbnailUrl = undefined;
			}
		} else {
			// Old material request flow
			objectThumbnailUrl = await this.ieObjectsService.getThumbnailUrlWithToken(
				ieObjectThumbnailUrl,
				referer,
				ip,
				isPublicDomain
			);
		}

		const objectRepresentations = await this.ieObjectsService.adaptRepresentations(
			[graphQlMaterialRequest.objectRepresentation],
			resolveThumbnailUrl,
			isPublicDomain,
			referer,
			ip
		);

		const history = (
			(graphQlMaterialRequest as FindMaterialRequestsByIdQuery['app_material_requests'][0])
				.messages_and_events || []
		).map(this.materialRequestMessageService.adaptEvent);

		return {
			id: graphQlMaterialRequest.id,
			objectId,
			objectSchemaIdentifier,
			objectSchemaName: rawObject?.schema_name,
			objectDctermsFormat: rawObject?.dctermsFormat?.[0]?.dcterms_format as IeObjectType,
			objectThumbnailUrl,
			objectPublishedOrCreatedDate: rawObject?.schema_date_published || rawObject?.created_at,
			objectAccessThrough,
			objectLicences,
			objectRepresentationId: graphQlMaterialRequest.ie_object_representation_id,
			objectRepresentation: objectRepresentations?.[0],
			reuseForm,
			profileId: graphQlMaterialRequest.profile_id,
			reason: graphQlMaterialRequest.reason,
			createdAt: graphQlMaterialRequest.created_at,
			updatedAt: graphQlMaterialRequest.updated_at,
			requestedAt: graphQlMaterialRequest.requested_at,
			type: graphQlMaterialRequest.type,
			isPending: graphQlMaterialRequest.is_pending,
			...this.adaptArchivationData(graphQlMaterialRequest, history),
			status: graphQlMaterialRequest.status,
			...this.adaptDownloadRelatedData(graphQlMaterialRequest),
			requestGroupName: graphQlMaterialRequest.name ?? null,
			requestGroupId: graphQlMaterialRequest.group_id ?? null,
			requesterId: graphQlMaterialRequest.requested_by.id,
			requesterFullName: graphQlMaterialRequest.requested_by.full_name,
			requesterMail: graphQlMaterialRequest.requested_by.mail,
			requesterCapacity: graphQlMaterialRequest.requester_capacity,
			requesterUserGroupId: graphQlMaterialRequest.requested_by.group?.id || null,
			requesterUserGroupName: graphQlMaterialRequest.requested_by.group?.name || null,
			requesterUserGroupLabel: graphQlMaterialRequest.requested_by.group?.label || null,
			requesterUserGroupDescription: graphQlMaterialRequest.requested_by.group?.description || null,
			requesterOrganisation: graphQlMaterialRequest.organisation, // Requester organisation (free input field) in some cases
			requesterOrganisationSector: graphQlMaterialRequest.organisation_sector || null,
			maintainerId: organisation?.schemaIdentifier,
			maintainerName: organisation?.schemaName,
			maintainerSlug:
				rawObject?.schemaMaintainer?.visitorSpace?.slug || kebabCase(organisation?.schemaName),
			maintainerLogo: organisation?.logo
				// TODO remove this workaround once the INT organisations assets are available
				.replace('https://assets-int.viaa.be/images/', 'https://assets.viaa.be/images/')
				.replace('https://assets-tst.viaa.be/images/', 'https://assets.viaa.be/images/'),
			contactMail: this.spacesService.adaptEmail(
				(graphQlMaterialRequest as FindMaterialRequestsQuery['app_material_requests'][0])
					?.intellectualEntity?.schemaMaintainer?.schemaContactPoint
			),
			objectMeemooLocalId:
				(graphQlMaterialRequest as FindMaterialRequestsQuery['app_material_requests'][0])
					?.intellectualEntity?.premisIdentifier?.[0]?.value || null,
			history,
		};
	}

	private adaptDownloadRelatedData(
		graphQlMaterialRequest: GqlMaterialRequest
	): Pick<MaterialRequest, 'downloadAvailableAt' | 'downloadStatus' | 'downloadExpiresAt'> {
		const { download_available_at, download_status } = graphQlMaterialRequest;

		let downloadStatus = download_status ?? null;

		// The downloadStatus says it succeeded, but we have no url, so we can assume something went wrong
		if (
			!download_available_at &&
			download_status === Lookup_App_Material_Request_Download_Status_Enum.Succeeded
		) {
			downloadStatus = Lookup_App_Material_Request_Download_Status_Enum.Failed;
		}

		const DAYS_AVAILABLE = Number.parseFloat(
			this.configService.get('MATERIAL_REQUEST_DOWNLOAD_DAYS_AVAILABLE')
		);

		return {
			downloadAvailableAt: download_available_at,
			downloadStatus,
			downloadExpiresAt: download_available_at
				? addDays(new Date(download_available_at), DAYS_AVAILABLE).toISOString()
				: null,
		};
	}

	private adaptArchivationData(
		graphQlMaterialRequest: GqlMaterialRequest,
		history: MaterialRequestEvent[]
	): Pick<MaterialRequest, 'isArchived' | 'willBeArchivedAt'> {
		const closureEvent = getStatusEvent(
			history,
			Lookup_App_Material_Request_Message_Type_Enum.FinalSummary
		);

		if (!closureEvent) {
			return { isArchived: false, willBeArchivedAt: null };
		}

		const TIME_BEFORE_ARCHIVATION = Number.parseFloat(
			this.configService.get('MATERIAL_REQUEST_TIME_BEFORE_ARCHIVATION')
		);
		const USE_DAYS =
			this.configService.get('MATERIAL_REQUEST_USE_DAYS_INSTEAD_MONTHS_BEFORE_ARCHIVATION') ===
			'true';

		let willBeArchivedAt: string;

		if (USE_DAYS) {
			willBeArchivedAt = addDays(new Date(), TIME_BEFORE_ARCHIVATION).toISOString();
		} else {
			willBeArchivedAt = addMonths(new Date(), TIME_BEFORE_ARCHIVATION).toISOString();
		}

		return {
			isArchived: graphQlMaterialRequest.is_archived,
			willBeArchivedAt,
		};
	}

	public adaptMaterialRequestForDownloadJobs(
		materialRequest:
			| FindMaterialRequestsWithUnresolvedDownloadStatusQuery['app_material_requests'][0]
			| GetMaterialRequestForDownloadJobQuery['app_material_requests'][0]
	): MaterialRequestForDownload {
		const fieldValues: Partial<{
			[MaterialRequestReuseFormKey.downloadQuality]: MaterialRequestExportQuality;
			[MaterialRequestReuseFormKey.startTime]: string;
			[MaterialRequestReuseFormKey.endTime]: string;
			[MaterialRequestReuseFormKey.durationType]: MaterialRequestDurationType;
		}> = Object.fromEntries(
			materialRequest.material_request_reuse_form_values.map((field) => [field.key, field.value])
		);
		return {
			id: materialRequest.id,
			type: materialRequest.type,
			status: materialRequest.status,
			downloadUrl: materialRequest.download_url || null,
			downloadJobId: materialRequest.download_job_id || null,
			downloadRetries: materialRequest.download_retries,
			downloadStatus: materialRequest.download_status || null,
			objectRepresentationId: materialRequest.ie_object_representation_id || null,
			requesterId: materialRequest.profile_id,
			objectId: materialRequest.ie_object_id,
			updatedAt: materialRequest.updated_at,
			maintainerId: materialRequest.intellectualEntity.schemaMaintainer.org_identifier,
			reuseForm: {
				downloadQuality: fieldValues.downloadQuality,
				startTime: fieldValues.startTime ? Number.parseInt(fieldValues.startTime, 10) : null,
				endTime: fieldValues.endTime ? Number.parseInt(fieldValues.endTime, 10) : null,
				durationType: fieldValues.durationType ?? MaterialRequestDurationType.PARTIAL,
			},
		};
	}

	public adaptMaintainers(
		graphQlMaterialRequestMaintainer: GqlMaterialRequestMaintainer
	): MaterialRequestMaintainer {
		return {
			id: graphQlMaterialRequestMaintainer.org_identifier,
			name: graphQlMaterialRequestMaintainer.skos_pref_label,
		};
	}

	public getAccessThroughAndLicences(
		objectMetadata: Pick<IeObject, 'licenses' | 'schemaIdentifier' | 'maintainerId' | 'sector'>,
		visitorSpaceAccessInfo: IeObjectsVisitorSpaceInfo,
		user: SessionUserEntity
	): {
		objectAccessThrough: IeObjectAccessThrough[];
		objectLicences: IeObjectLicense[];
		hasAccessToEssence: boolean;
	} {
		// Set a fake thumbnailUrl to see if our existing censor logic will censor the thumbnail
		// We don't need the actual thumbnail in this function, we just need to see if it is accessible to the current user
		(objectMetadata as any).thumbnailUrl = 'fake-thumbnail-for-access-check';
		const censoredObjectMetadata = limitAccessToObjectDetails(objectMetadata, {
			userId: user.getId(),
			isKeyUser: user.getIsKeyUser(),
			sector: user.getSector(),
			groupId: user.getGroupId(),
			maintainerId: user.getOrganisationId(),
			accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
			accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
		});

		return {
			objectAccessThrough: censoredObjectMetadata?.accessThrough ?? [],
			objectLicences: censoredObjectMetadata?.licenses ?? [],
			hasAccessToEssence:
				!!censoredObjectMetadata?.thumbnailUrl || !!censoredObjectMetadata?.pages?.length,
		};
	}

	public async findAllWithUnresolvedDownload(): Promise<MaterialRequestForDownload[]> {
		const response =
			await this.dataService.execute<FindMaterialRequestsWithUnresolvedDownloadStatusQuery>(
				FindMaterialRequestsWithUnresolvedDownloadStatusDocument
			);

		return response.app_material_requests?.map(this.adaptMaterialRequestForDownloadJobs);
	}

	/**
	 * Finds all the material requests that
	 * - are approved
	 * - have a download available
	 * - have a download that will expire in 8 days or less
	 * - have a requester that has not yet been sent an expiry warning email
	 */
	async findAllWithAlmostExpiredDownload(): Promise<MaterialRequest[]> {
		try {
			const DAYS_AVAILABLE = this.configService.get<number>(
				'MATERIAL_REQUEST_DOWNLOAD_DAYS_AVAILABLE'
			);
			const DAYS_BEFORE_EXPIRATION = this.configService.get<number>(
				'MATERIAL_REQUEST_DOWNLOAD_WARNING_DAYS_BEFORE_EXPIRING'
			);
			const response = await this.dataService.execute<
				FindMaterialRequestsWithAlmostExpiredDownloadQuery,
				FindMaterialRequestsWithAlmostExpiredDownloadQueryVariables
			>(FindMaterialRequestsWithAlmostExpiredDownloadDocument, {
				warningDate: subDays(new Date(), DAYS_AVAILABLE - DAYS_BEFORE_EXPIRATION).toISOString(),
			});
			return await mapLimit(
				response.app_material_requests,
				5,
				// Requires arrow wrapper, because otherwise the second param is the index in the array,
				// and that's interpreted as the organisations array in the adapt function
				(materialRequest: GqlMaterialRequest) => this.adapt(materialRequest, false)
			);
		} catch (err) {
			const error = customError(
				'Failed to find material requests with almost expired download',
				err
			);
			console.error(error);
			return [];
		}
	}

	/**
	 * Finds all the material requests that
	 * - are approved
	 * - have a download available
	 * - have a download that is expired
	 */
	async findAllWithExpiredDownload(): Promise<MaterialRequest[]> {
		try {
			const DAYS_AVAILABLE = Number.parseFloat(
				this.configService.get('MATERIAL_REQUEST_DOWNLOAD_DAYS_AVAILABLE')
			);
			const response = await this.dataService.execute<
				FindMaterialRequestsWithExpiredDownloadQuery,
				FindMaterialRequestsWithExpiredDownloadQueryVariables
			>(FindMaterialRequestsWithExpiredDownloadDocument, {
				expirationDate: subDays(new Date(), DAYS_AVAILABLE).toISOString(),
			});
			return await mapLimit(
				response.app_material_requests,
				5,
				// Requires arrow wrapper, because otherwise the second param is the index in the array,
				// and that's interpreted as the organisations array in the adapt function
				(materialRequest: GqlMaterialRequest) => this.adapt(materialRequest, false)
			);
		} catch (err) {
			const error = customError('Failed to find material requests with expired download', err);
			console.error(error);
			return [];
		}
	}

	/**
	 * Finds all the material requests that have a final summary document, meaning these requests are
	 * - approved but the download is expired
	 * - approved but the download has failed
	 * - cancelled
	 * - denied
	 */
	public async checkAllReadyForArchivation(): Promise<void> {
		try {
			const TIME_BEFORE_ARCHIVATION = Number.parseFloat(
				this.configService.get('MATERIAL_REQUEST_TIME_BEFORE_ARCHIVATION')
			);
			const USE_DAYS =
				this.configService.get('MATERIAL_REQUEST_USE_DAYS_INSTEAD_MONTHS_BEFORE_ARCHIVATION') ===
				'true';

			let expirationDate: string;

			if (USE_DAYS) {
				expirationDate = subDays(new Date(), TIME_BEFORE_ARCHIVATION).toISOString();
			} else {
				expirationDate = subMonths(new Date(), TIME_BEFORE_ARCHIVATION).toISOString();
			}

			const response = await this.dataService.execute<
				FindMaterialRequestsReadyToArchiveQuery,
				FindMaterialRequestsReadyToArchiveQueryVariables
			>(FindMaterialRequestsReadyToArchiveDocument, { expirationDate });

			await mapLimit(response.app_material_requests, 5, async (materialRequest) => {
				try {
					await this.updateMaterialRequest(materialRequest.id, {
						is_archived: true,
					});
					const attachmentUrls = materialRequest.messages_and_events.flatMap((item) =>
						item.attachments.map((attachment) => attachment.attachment_url)
					);
					await mapLimit(attachmentUrls, 5, async (url) => {
						try {
							await this.assetsService.delete(url);
						} catch (err) {
							// Log the error but don't throw, since the main flow of updating the material request is successful
							console.error('Failed to delete attachment for material request ', err, {
								materialRequestId: materialRequest.id,
								attachmentUrl: url,
							});
						}
					});
				} catch (err) {
					// Log the error but don't throw, since the main flow of updating the material request is successful
					console.error('Failed to update material request archived status', err, {
						materialRequestId: materialRequest.id,
					});
				}
			});

			console.info(`marked ${response.app_material_requests.length} material requests as archived`);
		} catch (err) {
			const error = customError('Failed to find material requests with final summary', err);
			console.error(error);
		}
	}

	public async getMaterialRequestForDownloadJob(
		materialRequestId: string
	): Promise<MaterialRequestForDownload | null> {
		const response = await this.dataService.execute<
			GetMaterialRequestForDownloadJobQuery,
			GetMaterialRequestForDownloadJobQueryVariables
		>(GetMaterialRequestForDownloadJobDocument, {
			materialRequestId,
		});

		const materialRequest = response.app_material_requests?.[0];
		return materialRequest ? this.adaptMaterialRequestForDownloadJobs(materialRequest) : null;
	}

	async getMaterialRequestsByJobId(
		exportJobIds: string[]
	): Promise<(MaterialRequestForDownload | null)[]> {
		const response = await this.dataService.execute<
			GetMaterialRequestForDownloadJobQuery,
			GetMaterialRequestByJobIdForDownloadJobQueryVariables
		>(GetMaterialRequestByJobIdForDownloadJobDocument, {
			jobIds: exportJobIds,
		});

		const materialRequests = response.app_material_requests;
		return materialRequests.map(this.adaptMaterialRequestForDownloadJobs);
	}

	/**
	 * Update the download job id for a material request
	 * also increments the download retries
	 * and set the download status
	 * @param materialRequestId
	 * @param setFields the fields of the material request to update
	 */
	public async updateMaterialRequest(
		materialRequestId: string,
		setFields: App_Material_Requests_Set_Input
	): Promise<MaterialRequest> {
		const response = await this.dataService.execute<
			UpdateMaterialRequestMutation,
			UpdateMaterialRequestMutationVariables
		>(UpdateMaterialRequestDocument, {
			materialRequestId,
			materialRequestFields: setFields,
		});
		const materialRequest = response?.update_app_material_requests?.returning?.[0];
		if (!materialRequest) {
			throw new CustomError('Could not update material request. Material request not found', null, {
				materialRequestId,
				setFields,
				response,
			});
		}
		return this.adapt(materialRequest, false);
	}

	/**
	 * Find the download url for the specified request
	 * Will throw an error if
	 * - the request status is not approved
	 * - the download status is not succeeded
	 * - the download has expired
	 * - there is no download url
	 * Will otherwise log an event and send a notification to the user
	 * @param materialRequestId
	 * @param user
	 * @param requestPath
	 * @param eventId
	 */
	public async getDownloadUrlForMaterialRequest(
		materialRequestId: string,
		user: SessionUserEntity,
		requestPath: string,
		eventId: string
	): Promise<string> {
		// Reusing the current implementations for logic like the organisations of the findById
		// or logic to get the downloadUrl of the getMaterialRequestForDownloadJob
		const [materialRequest, materialRequestForDownload] = await Promise.all([
			this.findById(materialRequestId, user, false, undefined, undefined),
			this.getMaterialRequestForDownloadJob(materialRequestId),
		]);

		const downloadAvailableAt = materialRequest?.downloadAvailableAt
			? new Date(materialRequest?.downloadAvailableAt)
			: null;
		const downloadExpiresAt = materialRequest?.downloadExpiresAt
			? new Date(materialRequest?.downloadExpiresAt)
			: null;

		const downloadExpired =
			!!downloadAvailableAt &&
			!!downloadExpiresAt &&
			!isWithinInterval(Date.now(), {
				start: downloadAvailableAt,
				end: downloadExpiresAt,
			});

		const isRequestApproved =
			materialRequest.status === Lookup_App_Material_Request_Status_Enum.Approved;
		const hasDownloadJobSucceeded =
			materialRequest.downloadStatus === Lookup_App_Material_Request_Download_Status_Enum.Succeeded;

		if (
			!isRequestApproved ||
			!hasDownloadJobSucceeded ||
			downloadExpired ||
			!materialRequestForDownload.downloadUrl
		) {
			const error = new CustomError(
				'The download for this request is expired or not yet available',
				null,
				{
					materialRequestId,
					materialRequest,
				}
			);
			console.error(error);
			throw error;
		}

		this.eventsService
			.insertEvents([
				{
					id: eventId,
					type: LogEventType.ITEM_REQUEST_DOWNLOAD_EXECUTED,
					source: requestPath,
					subject: user?.getId(),
					time: new Date().toISOString(),
					data: {
						type: mapDcTermsFormatToSimpleType(materialRequest.objectDctermsFormat),
						or_id: materialRequest.maintainerId,
						pid: materialRequest.objectSchemaIdentifier,
						material_request_group_id: materialRequest.requestGroupId,
						fragment_id: materialRequest.objectSchemaIdentifier,
					},
				},
			])
			.then(noop);

		const requester = await this.usersService.getById(materialRequest.profileId);
		await this.sentStatusUpdateEmail(
			EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_DOWNLOADED,
			materialRequest,
			requester
		);

		const objectTitle = kebabCase(materialRequest.objectSchemaName);
		const maintainerName = kebabCase(materialRequest.maintainerName);
		const extension = parse(materialRequestForDownload.downloadUrl).ext;
		const desiredFileName = `${objectTitle}__${maintainerName}${extension}`;
		return await this.mediahavenJobWatcherService.getS3DownloadSignedUrl(
			materialRequestForDownload.downloadUrl,
			desiredFileName
		);
	}

	private trackMaterialRequestStatusChangeEvent(
		updatedRequest: MaterialRequest,
		requestPath: string,
		userId: string,
		eventId: string
	) {
		const eventType = MAP_MATERIAL_REQUEST_STATUS_TO_EVENT_TYPE[updatedRequest.status];

		// Is this a trackable event? (Approved, Denied, Cancelled)
		if (eventType) {
			this.eventsService
				.insertEvents([
					{
						id: eventId,
						type: eventType,
						source: requestPath,
						subject: userId,
						time: new Date().toISOString(),
						data: {
							type: mapDcTermsFormatToSimpleType(updatedRequest.objectDctermsFormat),
							or_id: updatedRequest.maintainerId,
							pid: updatedRequest.objectSchemaIdentifier,
							material_request_group_id: updatedRequest.requestGroupId,
							...getAdditionEventDate(eventType, updatedRequest),
						},
					},
				])
				.then(noop)
				.catch((err) => {
					const error = new CustomError(
						'Failed to log event for material request status update',
						err,
						{
							materialRequestId: updatedRequest.id,
							requestPath,
							eventId,
							updatedRequest,
						}
					);
					console.error(error);
				});
		}
	}
}
