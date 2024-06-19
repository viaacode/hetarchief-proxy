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
	type CreateMaterialRequestDto,
	type MaterialRequestsQueryDto,
	type SendRequestListDto,
} from '../dto/material-requests.dto';
import { ORDER_PROP_TO_DB_PROP } from '../material-requests.consts';
import {
	type GqlMaterialRequest,
	type GqlMaterialRequestMaintainer,
	type MaterialRequest,
	type MaterialRequestFindAllExtraParameters,
	type MaterialRequestMaintainer,
	type MaterialRequestSendRequestListUserInfo,
} from '../material-requests.types';

import {
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
	type MaterialRequestEmailInfo,
	Template,
} from '~modules/campaign-monitor/campaign-monitor.types';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { type MediaFormat } from '~modules/ie-objects/ie-objects.types';
import { type Organisation } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { GroupId } from '~modules/users/types';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class MaterialRequestsService {
	private logger: Logger = new Logger(MaterialRequestsService.name, { timestamp: true });

	constructor(
		protected dataService: DataService,
		private campaignMonitorService: CampaignMonitorService,
		private organisationsService: OrganisationsService
	) {}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		parameters: MaterialRequestFindAllExtraParameters
	): Promise<IPagination<MaterialRequest>> {
		const { query, type, maintainerIds, isPending, page, size, orderProp, orderDirection } =
			inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: FindMaterialRequestsQueryVariables['where'] = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			where._or = [
				{ requested_by: { full_name: { _ilike: query } } },
				{ requested_by: { full_name_reversed: { _ilike: query } } },
				{ requested_by: { mail: { _ilike: query } } },
			];

			if (parameters.userGroup === GroupId.MEEMOO_ADMIN) {
				where._or = [
					...where._or,
					{ object: { maintainer: { schema_name: { _ilike: query } } } },
				];
			}

			if (parameters.userGroup === GroupId.VISITOR) {
				where._or = [...where._or, { object: { schema_name: { _ilike: query } } }];
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
			where.object = {
				maintainer: {
					schema_identifier: {
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
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP['createdAt'],
				orderDirection || SortDirection.desc
			),
		});
		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact(
				materialRequestsResponse.app_material_requests.map(
					(matRequest) => matRequest?.object?.maintainer?.schema_identifier
				)
			)
		);

		return Pagination<MaterialRequest>({
			items: materialRequestsResponse.app_material_requests.map((mr) =>
				this.adapt(mr, organisations)
			),
			page,
			size,
			total: materialRequestsResponse.app_material_requests_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<MaterialRequest> {
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
					(matRequest) => matRequest?.object?.maintainer?.schema_identifier
				)
			)
		);

		return this.adapt(materialRequestResponse.app_material_requests[0], organisations);
	}

	public async findMaintainers(): Promise<MaterialRequestMaintainer[] | []> {
		const response = await this.dataService.execute<
			FindMaintainersWithMaterialRequestsQuery,
			FindMaintainersWithMaterialRequestsQueryVariables
		>(FindMaintainersWithMaterialRequestsDocument, {});

		if (isNil(response) || !response.maintainer_content_partners_with_material_requests[0]) {
			return [];
		}

		const maintainers = response.maintainer_content_partners_with_material_requests;
		return maintainers.map((maintainer: GqlMaterialRequestMaintainer) =>
			this.adaptMaintainers(maintainer)
		);
	}

	public async createMaterialRequest(
		createMaterialRequestDto: CreateMaterialRequestDto,
		parameters: {
			userProfileId: string;
		}
	): Promise<MaterialRequest> {
		const newMaterialRequest = {
			object_schema_identifier: createMaterialRequestDto.objectId,
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
		};

		const { insert_app_material_requests_one: createdMaterialRequest } =
			await this.dataService.execute<
				InsertMaterialRequestMutation,
				InsertMaterialRequestMutationVariables
			>(InsertMaterialRequestDocument, {
				newMaterialRequest,
			});

		this.logger.debug(`Material request ${createdMaterialRequest.id} created.`);

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([createdMaterialRequest?.object?.maintainer?.schema_identifier])
		);

		return this.adapt(createdMaterialRequest, organisations);
	}

	public async updateMaterialRequest(
		materialRequestId: string,
		userProfileId: string,
		materialRequestInfo: Pick<
			App_Material_Requests_Set_Input,
			'type' | 'reason' | 'organisation' | 'requester_capacity' | 'is_pending' | 'updated_at'
		>
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

		const { update_app_material_requests: updatedMaterialRequest } =
			await this.dataService.execute<
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

		this.logger.debug(`Material request ${updatedMaterialRequest.returning[0]?.id} updated.`);

		const organisations = await this.organisationsService.findOrganisationsBySchemaIdentifiers(
			compact([updatedMaterialRequest?.returning?.[0]?.object?.maintainer?.schema_identifier])
		);

		return this.adapt(updatedMaterialRequest.returning[0], organisations);
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

		this.logger.debug(`Material request ${materialRequestId} deleted`);

		return response.delete_app_material_requests.affected_rows;
	}

	public async sendRequestList(
		materialRequests: MaterialRequest[],
		sendRequestListDto: SendRequestListDto,
		userInfo: MaterialRequestSendRequestListUserInfo
	): Promise<void> {
		try {
			const groupedMaterialRequests: any = groupBy(materialRequests, 'maintainerId');
			const groupedArray = [];

			Object.keys(groupedMaterialRequests).forEach((key) => {
				groupedArray.push(groupedMaterialRequests[key]);
			});

			// Send mail to each maintainer containing only material requests for objects they are the maintainer of
			await Promise.all(
				groupedArray.map(async (materialRequests: MaterialRequest[]) => {
					const emailInfo: MaterialRequestEmailInfo = {
						// Each materialRequest in this group has the same maintainer, otherwise, the maintainer will receive multiple mails
						to: materialRequests[0].contactMail,
						template: Template.MATERIAL_REQUEST_MAINTAINER,
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
				template: Template.MATERIAL_REQUEST_REQUESTER,
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
	public adapt(
		graphQlMaterialRequest: GqlMaterialRequest,
		organisations: Organisation[]
	): MaterialRequest | null {
		if (!graphQlMaterialRequest) {
			return null;
		}

		const organisation = organisations.find(
			(org) =>
				org.schemaIdentifier === graphQlMaterialRequest.object.maintainer.schema_identifier
		);
		const transformedMaterialRequest: MaterialRequest = {
			id: graphQlMaterialRequest.id,
			objectSchemaIdentifier: graphQlMaterialRequest.object_schema_identifier,
			objectSchemaName: graphQlMaterialRequest.object.schema_name,
			objectMeemooIdentifier: graphQlMaterialRequest.object.meemoo_identifier,
			objectDctermsFormat: graphQlMaterialRequest.object.dcterms_format as MediaFormat,
			objectThumbnailUrl: graphQlMaterialRequest.object.schema_thumbnail_url,
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
			requesterUserGroupDescription:
				graphQlMaterialRequest.requested_by.group?.description || null,
			maintainerId: organisation?.schemaIdentifier,
			maintainerName: organisation?.schemaName,
			maintainerSlug:
				graphQlMaterialRequest.object.maintainer.visitor_space?.slug ||
				kebabCase(organisation?.schemaName),
			maintainerLogo: organisation?.logo?.iri,
			organisation: graphQlMaterialRequest.organisation || null, // Requester organisation (free input field)
			contactMail:
				(graphQlMaterialRequest as FindMaterialRequestsQuery['app_material_requests'][0])
					?.object?.maintainer?.information?.contact_point || null,
			objectMeemooLocalId:
				(graphQlMaterialRequest as FindMaterialRequestsQuery['app_material_requests'][0])
					?.object?.meemoo_local_id || null,
		};

		return transformedMaterialRequest;
	}

	public adaptMaintainers(
		graphQlMaterialRequestMaintainer: GqlMaterialRequestMaintainer
	): MaterialRequestMaintainer {
		return {
			id: graphQlMaterialRequestMaintainer.schema_identifier,
			name: graphQlMaterialRequestMaintainer.schema_name,
		};
	}
}
