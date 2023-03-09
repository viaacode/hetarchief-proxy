import { DataService } from '@meemoo/admin-core-api';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { has, isArray, isEmpty, isNil, set } from 'lodash';

import { CreateMaterialRequestDto, MaterialRequestsQueryDto } from '../dto/material-requests.dto';
import { ORDER_PROP_TO_DB_PROP } from '../material-requests.consts';
import {
	GqlMaterialRequest,
	GqlMaterialRequestMaintainer,
	MaterialRequest,
	MaterialRequestMaintainer,
	MaterialRequestRequesterCapacity,
} from '../material-requests.types';

import {
	App_Material_Requests_Set_Input,
	DeleteMaterialRequestDocument,
	DeleteMaterialRequestMutation,
	DeleteMaterialRequestMutationVariables,
	FindMaintainersWithMaterialRequestsDocument,
	FindMaintainersWithMaterialRequestsQuery,
	FindMaintainersWithMaterialRequestsQueryVariables,
	FindMaterialRequestsByIdDocument,
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsByIdQueryVariables,
	FindMaterialRequestsDocument,
	FindMaterialRequestsQuery,
	FindMaterialRequestsQueryVariables,
	InsertMaterialRequestDocument,
	InsertMaterialRequestMutation,
	InsertMaterialRequestMutationVariables,
	UpdateMaterialRequestDocument,
	UpdateMaterialRequestMutation,
	UpdateMaterialRequestMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { MediaFormat } from '~modules/ie-objects/ie-objects.types';
import { Group } from '~modules/users/types';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class MaterialRequestsService {
	private logger: Logger = new Logger(MaterialRequestsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		parameters: {
			userProfileId?: string;
			userGroup?: string;
			isPersonal?: boolean;
		}
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

			if (parameters.userGroup === Group.MEEMOO_ADMIN) {
				where._or = [
					...where._or,
					{ object: { maintainer: { schema_name: { _ilike: query } } } },
				];
			}

			if (parameters.userGroup === Group.VISITOR) {
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

		if (!isEmpty(isPending)) {
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

		return Pagination<MaterialRequest>({
			items: materialRequestsResponse.app_material_requests.map((mr) => this.adapt(mr)),
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

		return this.adapt(materialRequestResponse.app_material_requests[0]);
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
				MaterialRequestRequesterCapacity.OTHER,
		};

		const { insert_app_material_requests_one: createdMaterialRequest } =
			await this.dataService.execute<
				InsertMaterialRequestMutation,
				InsertMaterialRequestMutationVariables
			>(InsertMaterialRequestDocument, {
				newMaterialRequest,
			});

		this.logger.debug(`Material request ${createdMaterialRequest.id} created.`);

		return this.adapt(createdMaterialRequest);
	}

	public async updateMaterialRequest(
		materialRequestId: string,
		userProfileId: string,
		materialRequestDto: Pick<
			App_Material_Requests_Set_Input,
			'type' | 'reason' | 'organisation' | 'requester_capacity'
		>
	): Promise<MaterialRequest> {
		const { type, reason, organisation, requester_capacity } = materialRequestDto;

		const updateMaterialRequest = {
			type,
			reason,
			organisation,
			requester_capacity,
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

		return this.adapt(updatedMaterialRequest.returning[0]);
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

	/**
	 * Adapt a material request as returned by a graphQl response to our internal model
	 */
	public adapt(grapqhQLMaterialRequest: GqlMaterialRequest): MaterialRequest | null {
		if (!grapqhQLMaterialRequest) {
			return null;
		}

		let transformedMaterialRequest: MaterialRequest = {
			id: grapqhQLMaterialRequest.id,
			objectSchemaIdentifier: grapqhQLMaterialRequest.object_schema_identifier,
			objectSchemaName: grapqhQLMaterialRequest.object.schema_name,
			objectMeemooIdentifier: grapqhQLMaterialRequest.object.meemoo_identifier,
			objectDctermsFormat: grapqhQLMaterialRequest.object.dcterms_format as MediaFormat,
			objectThumbnailUrl: grapqhQLMaterialRequest.object.schema_thumbnail_url,
			profileId: grapqhQLMaterialRequest.profile_id,
			reason: grapqhQLMaterialRequest.reason,
			createdAt: grapqhQLMaterialRequest.created_at,
			updatedAt: grapqhQLMaterialRequest.updated_at,
			type: grapqhQLMaterialRequest.type,
			isPending: grapqhQLMaterialRequest.is_pending,
			requesterId: grapqhQLMaterialRequest.requested_by.id,
			requesterFullName: grapqhQLMaterialRequest.requested_by.full_name,
			requesterMail: grapqhQLMaterialRequest.requested_by.mail,
			requesterCapacity: grapqhQLMaterialRequest.requester_capacity,
			maintainerId: grapqhQLMaterialRequest.object.maintainer.schema_identifier,
			maintainerName: grapqhQLMaterialRequest.object.maintainer.schema_name,
			maintainerSlug: grapqhQLMaterialRequest.object.maintainer.visitor_space.slug,
			organisation: grapqhQLMaterialRequest.organisation || null,
		};

		// FindMaterialRequestsByIdQuery has more detailed props than would be returned with FindMaterialRequestsQuery
		const GqlMaterialRequestById =
			grapqhQLMaterialRequest as FindMaterialRequestsByIdQuery['app_material_requests'][0];

		// Brecht - Check if GqlMaterialRequestById has a prop group
		// If so add user group information
		if (has(GqlMaterialRequestById.requested_by, 'group')) {
			transformedMaterialRequest = {
				...transformedMaterialRequest,
				requesterUserGroupId: GqlMaterialRequestById.requested_by.group?.id || null,
				requesterUserGroupName: GqlMaterialRequestById.requested_by.group?.name || null,
				requesterUserGroupLabel: GqlMaterialRequestById.requested_by.group?.label || null,
				requesterUserGroupDescription:
					GqlMaterialRequestById.requested_by.group?.description || null,
			};
		}

		// Brecht - Check if GqlMaterialRequestById.object.maintainer has a prop information
		// If so add information props
		if (has(GqlMaterialRequestById.object.maintainer, 'information')) {
			transformedMaterialRequest = {
				...transformedMaterialRequest,
				maintainerLogo: GqlMaterialRequestById.object.maintainer.information?.logo?.iri,
			};
		}

		return transformedMaterialRequest;
	}

	public adaptMaintainers(
		grapqhQLMaterialRequestMaintainer: GqlMaterialRequestMaintainer
	): MaterialRequestMaintainer {
		return {
			id: grapqhQLMaterialRequestMaintainer.schema_identifier,
			name: grapqhQLMaterialRequestMaintainer.schema_name,
		};
	}
}
