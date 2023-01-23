import { DataService } from '@meemoo/admin-core-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { has, isArray, isEmpty, isNil, set } from 'lodash';

import { MaterialRequestsQueryDto } from '../dto/material-requests.dto';
import { ORDER_PROP_TO_DB_PROP } from '../material-requests.consts';
import {
	GqlMaterialRequest,
	MaterialRequest,
	MaterialRequestType,
} from '../material-requests.types';

import {
	FindMaterialRequestsByIdDocument,
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsByIdQueryVariables,
	FindMaterialRequestsDocument,
	FindMaterialRequestsQuery,
	FindMaterialRequestsQueryVariables,
} from '~generated/graphql-db-types-hetarchief';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class MaterialRequestsService {
	private logger: Logger = new Logger(MaterialRequestsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

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
			profileId: grapqhQLMaterialRequest.profile_id,
			reason: grapqhQLMaterialRequest.reason,
			createdAt: grapqhQLMaterialRequest.created_at,
			updatedAt: grapqhQLMaterialRequest.updated_at,
			type: grapqhQLMaterialRequest.type,
			requesterId: grapqhQLMaterialRequest.requested_by.id,
			requesterFullName: grapqhQLMaterialRequest.requested_by.full_name,
			requesterMail: grapqhQLMaterialRequest.requested_by.mail,
			maintainerId: grapqhQLMaterialRequest.object.maintainer.schema_identifier,
			maintainerName: grapqhQLMaterialRequest.object.maintainer.schema_name,
			maintainerSlug: grapqhQLMaterialRequest.object.maintainer.visitor_space.slug,
		};

		// Brecht - FindMaterialRequestsByIdQuery has more detailed props than would be returned with FindMaterialRequestsQuery
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
		// If so add user group information
		if (has(GqlMaterialRequestById.object.maintainer, 'information')) {
			transformedMaterialRequest = {
				...transformedMaterialRequest,
				maintainerLogo: GqlMaterialRequestById.object.maintainer.information?.logo?.iri,
			};
		}

		// Brecht - Check if GqlMaterialRequestById has a prop object
		// If so add object information
		if (has(GqlMaterialRequestById, 'object')) {
			transformedMaterialRequest = {
				...transformedMaterialRequest,
				objectName: GqlMaterialRequestById.object?.schema_name,
				objectPid: GqlMaterialRequestById.object?.meemoo_identifier,
			};
		}

		return transformedMaterialRequest;
	}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		parameters: {
			userProfileId?: string;
		}
	): Promise<IPagination<MaterialRequest>> {
		const { query, type, maintainerIds, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: FindMaterialRequestsQueryVariables['where'] = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			where._or = [
				{ requested_by: { full_name: { _ilike: query } } },
				{ requested_by: { mail: { _ilike: query } } },
			];
		}

		if (!isEmpty(parameters.userProfileId)) {
			where.profile_id = { _eq: parameters.userProfileId };
		}

		if (!isEmpty(type)) {
			where.type = {
				_eq: MaterialRequestType[type],
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

		return this.adapt(materialRequestResponse.app_material_requests[0] as GqlMaterialRequest);
	}
}
