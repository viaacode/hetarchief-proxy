import { DataService } from '@meemoo/admin-core-api';
import { Injectable, Logger } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { isEmpty, set } from 'lodash';

import { ORDER_PROP_TO_DB_PROP } from '../consts';
import { MaterialRequestsQueryDto } from '../dto/material-requests.dto';
import { MaterialRequest } from '../types';

import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class MaterialRequestsService {
	private logger: Logger = new Logger(MaterialRequestsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a content partner as returned by a graphQl response to our internal model
	 */
	public adapt(grapqhQLMaterialRequest: GqlMaterialRequest): MaterialRequest | null {
		return {
			id: grapqhQLMaterialRequest.id,
			objectSchemaIdentifier: grapqhQLMaterialRequest.objectSchemaIdentifier,
			profileId: grapqhQLMaterialRequest.profileId,
			reason: grapqhQLMaterialRequest.reason,
			createdAt: grapqhQLMaterialRequest.createdAt,
			updatedAt: grapqhQLMaterialRequest.updatedAt,
		};
	}

	public async findAll(
		inputQuery: MaterialRequestsQueryDto,
		parameters: {
			userProfileId?: string;
		}
	): Promise<IPagination<MaterialRequest>> {
		const { page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: FindMaterialRequestsQueryVariables['where'] = {};

		if (!isEmpty(parameters.userProfileId)) {
			where.user_profile_id = { _eq: parameters.userProfileId };
		}

		const materialRequestsResponse = await this.dataService.execute<
			FindMaterialRequestsQuery,
			FindMaterialRequestsVariables
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
}
