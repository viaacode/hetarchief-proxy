import { DataService, Locale, StillsObjectType, VideoStillsService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { compact, groupBy, intersection, isArray, isEmpty, isNil, kebabCase, set } from 'lodash';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	SendRequestListDto,
	UpdateMaterialRequestStatusDto,
} from '../dto/material-requests.dto';
import {
	DOWNLOAD_AVAILABILITY_DAYS,
	MAP_MATERIAL_REQUEST_STATUS_TO_EMAIL_TEMPLATE,
	ORDER_PROP_TO_DB_PROP,
} from '../material-requests.consts';
import {
	GqlMaterialRequest,
	GqlMaterialRequestMaintainer,
	MaterialRequest,
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
	FindMaterialRequestsWithUnresolvedDownloadStatusDocument,
	FindMaterialRequestsWithUnresolvedDownloadStatusQuery,
	GetMaterialRequestForDownloadJobDocument,
	GetMaterialRequestForDownloadJobQuery,
	GetMaterialRequestForDownloadJobQueryVariables,
	InsertMaterialRequestDocument,
	type InsertMaterialRequestMutation,
	type InsertMaterialRequestMutationVariables,
	InsertMaterialRequestReuseFormDocument,
	InsertMaterialRequestReuseFormMutation,
	InsertMaterialRequestReuseFormMutationVariables,
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
import {
	EmailTemplate,
	type MaterialRequestEmailInfo,
} from '~modules/campaign-monitor/campaign-monitor.types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { convertSchemaIdentifierToId } from '~modules/ie-objects/helpers/convert-schema-identifier-to-id';
import {
	IeObjectAccessThrough,
	IeObjectLicense,
	IeObjectType,
	IeObjectsVisitorSpaceInfo,
	SimpleIeObjectType,
} from '~modules/ie-objects/ie-objects.types';
import type { Organisation } from '~modules/organisations/organisations.types';

import { OrganisationsService } from '~modules/organisations/services/organisations.service';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { AvoStillsStillInfo, AvoUserCommonUser } from '@viaa/avo2-types';
import { addDays } from 'date-fns';
import { limitAccessToObjectDetails } from '~modules/ie-objects/helpers/limit-access-to-object-details';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import { IE_OBJECT_INTRA_CP_LICENSES } from '~modules/ie-objects/ie-objects.conts';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
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
		private mediahavenJobWatcherService: MediahavenJobsWatcherService,
		private usersService: UsersService
	) {}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		isPersonal: boolean,
		user: SessionUserEntity,
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

		if (!isNil(hasDownloadUrl)) {
			const downloadUrlQuery = [];

			if (hasDownloadUrl.includes('true')) {
				downloadUrlQuery.push({ download_url: { _is_null: false } });
			}

			if (hasDownloadUrl.includes('false')) {
				downloadUrlQuery.push({
					_and: [
						{ download_url: { _is_null: true } },
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
					this.adapt(mr, organisations, visitorSpaceAccessInfo, user, referer, ip)
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
		const ieObjectId = convertSchemaIdentifierToId(createMaterialRequestDto.objectSchemaIdentifier);
		const variables: InsertMaterialRequestMutationVariables = {
			newMaterialRequest: {
				ie_object_id: ieObjectId,
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

		const { insert_app_material_requests_one: createdMaterialRequest } =
			await this.dataService.execute<
				InsertMaterialRequestMutation,
				InsertMaterialRequestMutationVariables
			>(InsertMaterialRequestDocument, variables);

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

		return this.adapt(updatedRequest, organisations, visitorSpaceAccessInfo, user, referer, ip);
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
		userId: string
	) {
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
				currentRequest.requesterId !== userId
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
		ip: string
	): Promise<MaterialRequest> {
		const currentRequest = await this.findById(materialRequestId, user, referer, ip);

		const { status, motivation } = statusOptions;

		this.validateStatusTransition(currentRequest, status, user.getId());

		const updateMaterialRequest: Partial<GqlMaterialRequest> = {
			status: status,
			updated_at: new Date().toISOString(),
		};

		if (status === Lookup_App_Material_Request_Status_Enum.Cancelled) {
			updateMaterialRequest.cancelled_at = new Date().toISOString();
		} else if (status === Lookup_App_Material_Request_Status_Enum.Approved) {
			updateMaterialRequest.status_motivation = motivation;
			updateMaterialRequest.approved_at = new Date().toISOString();
		} else if (status === Lookup_App_Material_Request_Status_Enum.Denied) {
			updateMaterialRequest.status_motivation = motivation;
			updateMaterialRequest.denied_at = new Date().toISOString();
		}

		const updateMaterialRequestStatusResponse = await this.dataService.execute<
			UpdateMaterialRequestStatusMutation,
			UpdateMaterialRequestStatusMutationVariables
		>(UpdateMaterialRequestStatusDocument, {
			materialRequestId: currentRequest.id,
			updateMaterialRequest,
		});

		const graphQlMaterialRequest =
			updateMaterialRequestStatusResponse.update_app_material_requests.returning?.[0];

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
			organisations,
			visitorSpaceAccessInfo,
			user,
			referer,
			ip
		);

		if (updatedRequest.status === Lookup_App_Material_Request_Status_Enum.Approved) {
			// If the request is approved, we need to start prepping the download
			const materialRequestForDownload = await this.getMaterialRequestForDownloadJob(
				updatedRequest.id
			);
			await this.mediahavenJobWatcherService.createExportJob(materialRequestForDownload);
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
			template === EmailTemplate.MATERIAL_REQUEST_REQUESTER_CANCELLED ||
			template === EmailTemplate.MATERIAL_REQUEST_DOWNLOAD_READY_MAINTAINER
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
			throw error;
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
						template: EmailTemplate.MATERIAL_REQUEST_MAINTAINER,
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
				template: EmailTemplate.MATERIAL_REQUEST_REQUESTER,
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

		const objectSchemaIdentifier = graphQlMaterialRequest.intellectualEntity?.schema_identifier;
		let objectAccessThrough: IeObjectAccessThrough[] = [];
		let objectLicences: IeObjectLicense[] = [];
		if (user) {
			const licenses = await this.getAccessThroughAndLicences(
				objectSchemaIdentifier,
				visitorSpaceAccessInfo,
				user,
				ip
			);
			objectAccessThrough = licenses.objectAccessThrough;
			objectLicences = licenses.objectLicences;
		}

		const isPublicDomain: boolean =
			objectLicences?.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
			objectLicences?.includes(IeObjectLicense.PUBLIC_DOMAIN);

		let objectThumbnailUrl: string | undefined;
		const ieObjectThumbnailUrl =
			graphQlMaterialRequest.intellectualEntity?.schemaThumbnail?.schema_thumbnail_url?.[0];
		const isComplexFlow = this.isComplexReuseFlow(
			graphQlMaterialRequest.intellectualEntity?.dctermsFormat?.[0]?.dcterms_format as IeObjectType,
			objectLicences,
			user?.getIsKeyUser()
		);
		if (isComplexFlow) {
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
			referer,
			ip,
			isPublicDomain
		);

		return {
			id: graphQlMaterialRequest.id,
			objectId: graphQlMaterialRequest.ie_object_id,
			objectSchemaIdentifier,
			objectSchemaName: graphQlMaterialRequest.intellectualEntity?.schema_name,
			objectDctermsFormat: graphQlMaterialRequest.intellectualEntity?.dctermsFormat?.[0]
				?.dcterms_format as IeObjectType,
			objectThumbnailUrl,
			objectPublishedOrCreatedDate:
				graphQlMaterialRequest.intellectualEntity?.schema_date_published ||
				graphQlMaterialRequest.intellectualEntity?.created_at,
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
			approvedAt: graphQlMaterialRequest.approved_at,
			deniedAt: graphQlMaterialRequest.denied_at,
			cancelledAt: graphQlMaterialRequest.cancelled_at,
			type: graphQlMaterialRequest.type,
			isPending: graphQlMaterialRequest.is_pending,
			status: graphQlMaterialRequest.status,
			statusMotivation: graphQlMaterialRequest.status_motivation,
			downloadUrl: graphQlMaterialRequest.download_url ?? null,
			downloadAvailableAt: graphQlMaterialRequest.download_available_at,
			downloadExpiresAt: graphQlMaterialRequest.download_available_at
				? addDays(
						new Date(graphQlMaterialRequest.download_available_at),
						DOWNLOAD_AVAILABILITY_DAYS
					).toISOString()
				: null,
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
				graphQlMaterialRequest.intellectualEntity?.schemaMaintainer?.visitorSpace?.slug ||
				kebabCase(organisation?.schemaName),
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
		};
	}

	public adaptMaterialRequestsForDownloadJobs(
		materialRequests: FindMaterialRequestsWithUnresolvedDownloadStatusQuery['app_material_requests'][0]
	): MaterialRequestForDownload {
		return {
			id: materialRequests.id,
			type: materialRequests.type,
			status: materialRequests.status,
			approvedAt: materialRequests.approved_at,
			downloadJobId: materialRequests.download_job_id || null,
			downloadRetries: materialRequests.download_retries,
			downloadStatus: materialRequests.download_status || null,
			objectRepresentationId: materialRequests.ie_object_representation_id || null,
			objectId: materialRequests.ie_object_id,
			updatedAt: materialRequests.updated_at,
			reuseForm: {
				downloadQuality: materialRequests.material_request_reuse_form_values?.[0]
					?.value as MaterialRequestExportQuality,
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

	public async getAccessThroughAndLicences(
		objectSchemaIdentifier: string,
		visitorSpaceAccessInfo: IeObjectsVisitorSpaceInfo,
		user: SessionUserEntity,
		ip: string
	): Promise<{
		objectAccessThrough: IeObjectAccessThrough[];
		objectLicences: IeObjectLicense[];
	}> {
		const objectMetadata = await this.ieObjectsService.findMetadataByIeObjectId(
			convertSchemaIdentifierToId(objectSchemaIdentifier),
			null,
			ip
		);

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
			objectAccessThrough: censoredObjectMetadata?.accessThrough,
			objectLicences: censoredObjectMetadata?.licenses,
		};
	}

	public async findAllWithUnresolvedDownload(): Promise<MaterialRequestForDownload[]> {
		const response =
			await this.dataService.execute<FindMaterialRequestsWithUnresolvedDownloadStatusQuery>(
				FindMaterialRequestsWithUnresolvedDownloadStatusDocument
			);

		return response.app_material_requests?.map(this.adaptMaterialRequestsForDownloadJobs);
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
		return materialRequest ? this.adaptMaterialRequestsForDownloadJobs(materialRequest) : null;
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
		return this.adapt(materialRequest);
	}
}
