import { DataService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { compact, groupBy, isArray, isEmpty, isNil, kebabCase, set } from 'lodash';

import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	SendRequestListDto,
} from '../dto/material-requests.dto';
import { ORDER_PROP_TO_DB_PROP } from '../material-requests.consts';
import type {
	GqlMaterialRequest,
	GqlMaterialRequestMaintainer,
	MaterialRequest,
	MaterialRequestFindAllExtraParameters,
	MaterialRequestMaintainer,
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
	InsertMaterialRequestDocument,
	type InsertMaterialRequestMutation,
	type InsertMaterialRequestMutationVariables,
	Lookup_App_Material_Request_Requester_Capacity_Enum,
	UpdateMaterialRequestDocument,
	type UpdateMaterialRequestMutation,
	type UpdateMaterialRequestMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import {
	EmailTemplate,
	type MaterialRequestEmailInfo,
} from '~modules/campaign-monitor/campaign-monitor.types';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { convertSchemaIdentifierToId } from '~modules/ie-objects/helpers/convert-schema-identifier-to-id';
import type { IeObjectType } from '~modules/ie-objects/ie-objects.types';
import type { Organisation } from '~modules/organisations/organisations.types';

import { OrganisationsService } from '~modules/organisations/services/organisations.service';

import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { GroupId } from '~modules/users/types';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class MaterialRequestsService {
	private logger: Logger = new Logger(MaterialRequestsService.name, { timestamp: true });

	constructor(
		private dataService: DataService,
		private campaignMonitorService: CampaignMonitorService,
		private organisationsService: OrganisationsService,
		private spacesService: SpacesService,
		private ieObjectsService: IeObjectsService
	) {}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		parameters: MaterialRequestFindAllExtraParameters,
		referer: string,
		ip: string
	): Promise<IPagination<MaterialRequest>> {
		const { query, type, maintainerIds, isPending, page, size, orderProp, orderDirection } =
			inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: App_Material_Requests_Bool_Exp = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			where._or = [
				{ requested_by: { full_name: { _ilike: query } } },
				{ requested_by: { full_name_reversed: { _ilike: query } } },
				{ requested_by: { mail: { _ilike: query } } },
			];

			if (parameters.userGroup === GroupId.MEEMOO_ADMIN) {
				where._or = [
					...where._or,
					{
						intellectualEntity: {
							schemaMaintainer: { skos_pref_label: { _ilike: query } },
						},
					},
				];
			}

			if (parameters.userGroup === GroupId.VISITOR) {
				where._or = [...where._or, { intellectualEntity: { schema_name: { _ilike: query } } }];
			}
		}

		if (parameters.isPersonal && !isEmpty(parameters.userProfileId)) {
			where.profile_id = { _eq: parameters.userProfileId };
		}

		if (!isEmpty(type)) {
			where.type = {
				_in: isArray(type) ? type : [type],
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

		const materialRequestsResponse = await this.dataService.execute<
			FindMaterialRequestsQuery,
			FindMaterialRequestsQueryVariables
		>(FindMaterialRequestsDocument, {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP.createdAt,
				orderDirection || SortDirection.desc
			),
		});
		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact(
				materialRequestsResponse.app_material_requests.map(
					(matRequest) => matRequest?.intellectualEntity?.schemaMaintainer?.org_identifier
				)
			)
		);

		return Pagination<MaterialRequest>({
			items: await Promise.all(
				materialRequestsResponse.app_material_requests.map((mr) =>
					this.adapt(mr, organisations, referer, ip)
				)
			),
			page,
			size,
			total: materialRequestsResponse.app_material_requests_aggregate.aggregate.count,
		});
	}

	public async findById(id: string, referer: string, ip: string): Promise<MaterialRequest> {
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

		return this.adapt(materialRequestResponse.app_material_requests[0], organisations, referer, ip);
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
		parameters: {
			userProfileId: string;
		},
		referer: string,
		ip: string
	): Promise<MaterialRequest> {
		const variables: InsertMaterialRequestMutationVariables = {
			newMaterialRequest: {
				ie_object_id: convertSchemaIdentifierToId(createMaterialRequestDto.objectSchemaIdentifier),
				profile_id: parameters.userProfileId,
				reason: createMaterialRequestDto.reason,
				type: createMaterialRequestDto.type,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				is_pending: true,
				organisation: createMaterialRequestDto?.organisation,
				requester_capacity:
					createMaterialRequestDto?.requesterCapacity ||
					Lookup_App_Material_Request_Requester_Capacity_Enum.Other,
			},
		};

		const { insert_app_material_requests_one: createdMaterialRequest } =
			await this.dataService.execute<
				InsertMaterialRequestMutation,
				InsertMaterialRequestMutationVariables
			>(InsertMaterialRequestDocument, variables);

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([createdMaterialRequest?.intellectualEntity?.schemaMaintainer?.org_identifier])
		);

		return this.adapt(createdMaterialRequest, organisations, referer, ip);
	}

	public async updateMaterialRequest(
		materialRequestId: string,
		userProfileId: string,
		materialRequestInfo: Pick<
			App_Material_Requests_Set_Input,
			'type' | 'reason' | 'organisation' | 'requester_capacity' | 'is_pending' | 'updated_at'
		>,
		referer: string,
		ip: string
	): Promise<MaterialRequest> {
		const { type, reason, organisation, requester_capacity, is_pending, updated_at } =
			materialRequestInfo;

		const updateMaterialRequest = {
			type,
			reason,
			organisation,
			requester_capacity,
			is_pending,
			updated_at,
		};

		const { update_app_material_requests: updatedMaterialRequest } = await this.dataService.execute<
			UpdateMaterialRequestMutation,
			UpdateMaterialRequestMutationVariables
		>(UpdateMaterialRequestDocument, {
			materialRequestId,
			userProfileId,
			updateMaterialRequest,
		});

		if (isEmpty(updatedMaterialRequest.returning[0])) {
			throw new BadRequestException(
				`Material request (${materialRequestId}) could not be updated.`
			);
		}

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([
				updatedMaterialRequest?.returning?.[0]?.intellectualEntity?.schemaMaintainer
					?.org_identifier,
			])
		);

		return this.adapt(updatedMaterialRequest.returning[0], organisations, referer, ip);
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
						firstName: userInfo.firstName,
						lastName: userInfo.lastName,
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
				firstName: userInfo.firstName,
				lastName: userInfo.lastName,
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

	/**
	 * Adapt a material request as returned by a graphQl response to our internal model
	 */
	public async adapt(
		graphQlMaterialRequest: GqlMaterialRequest,
		organisations: Organisation[],
		referer: string,
		ip: string
	): Promise<MaterialRequest | null> {
		if (!graphQlMaterialRequest) {
			return null;
		}

		const organisation = organisations.find(
			(org) =>
				org.schemaIdentifier ===
				graphQlMaterialRequest.intellectualEntity?.schemaMaintainer?.org_identifier
		);

		const objectThumbnailUrl: string | undefined =
			await this.ieObjectsService.getThumbnailUrlWithToken(
				graphQlMaterialRequest.intellectualEntity?.schemaThumbnail?.schema_thumbnail_url?.[0],
				referer,
				ip
			);

		const transformedMaterialRequest: MaterialRequest = {
			id: graphQlMaterialRequest.id,
			objectId: graphQlMaterialRequest.ie_object_id,
			objectSchemaIdentifier: graphQlMaterialRequest.intellectualEntity?.schema_identifier,
			objectSchemaName: graphQlMaterialRequest.intellectualEntity?.schema_name,
			objectDctermsFormat: graphQlMaterialRequest.intellectualEntity?.dctermsFormat?.[0]
				?.dcterms_format as IeObjectType,
			objectThumbnailUrl,
			objectPublishedOrCreatedDate:
				graphQlMaterialRequest.intellectualEntity?.schema_date_published ||
				graphQlMaterialRequest.intellectualEntity?.created_at,
			profileId: graphQlMaterialRequest.profile_id,
			reason: graphQlMaterialRequest.reason,
			createdAt: graphQlMaterialRequest.created_at,
			updatedAt: graphQlMaterialRequest.updated_at,
			type: graphQlMaterialRequest.type,
			isPending: graphQlMaterialRequest.is_pending,
			requesterId: graphQlMaterialRequest.requested_by.id,
			requesterFullName: graphQlMaterialRequest.requested_by.full_name,
			requesterMail: graphQlMaterialRequest.requested_by.mail,
			requesterCapacity: graphQlMaterialRequest.requester_capacity,
			requesterUserGroupId: graphQlMaterialRequest.requested_by.group?.id || null,
			requesterUserGroupName: graphQlMaterialRequest.requested_by.group?.name || null,
			requesterUserGroupLabel: graphQlMaterialRequest.requested_by.group?.label || null,
			requesterUserGroupDescription: graphQlMaterialRequest.requested_by.group?.description || null,
			maintainerId: organisation?.schemaIdentifier,
			maintainerName: organisation?.schemaName,
			maintainerSlug:
				graphQlMaterialRequest.intellectualEntity?.schemaMaintainer?.visitorSpace?.slug ||
				kebabCase(organisation?.schemaName),
			maintainerLogo: organisation?.logo
				// TODO remove this workaround once the INT organisations assets are available
				.replace('https://assets-int.viaa.be/images/', 'https://assets.viaa.be/images/')
				.replace('https://assets-tst.viaa.be/images/', 'https://assets.viaa.be/images/'),
			organisation: graphQlMaterialRequest.organisation || null, // Requester organisation (free input field)
			contactMail: this.spacesService.adaptEmail(
				(graphQlMaterialRequest as FindMaterialRequestsQuery['app_material_requests'][0])
					?.intellectualEntity?.schemaMaintainer?.schemaContactPoint
			),
			objectMeemooLocalId:
				(graphQlMaterialRequest as FindMaterialRequestsQuery['app_material_requests'][0])
					?.intellectualEntity?.premisIdentifier?.[0]?.value || null,
		};

		return transformedMaterialRequest;
	}

	public adaptMaintainers(
		graphQlMaterialRequestMaintainer: GqlMaterialRequestMaintainer
	): MaterialRequestMaintainer {
		return {
			id: graphQlMaterialRequestMaintainer.org_identifier,
			name: graphQlMaterialRequestMaintainer.skos_pref_label,
		};
	}
}
