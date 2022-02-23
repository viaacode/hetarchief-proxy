import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get, isEmpty, set } from 'lodash';

import { SpacesQueryDto } from '../dto/spaces.dto';
import { Space } from '../types';

import { FIND_SPACE_BY_ID, FIND_SPACES } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class SpacesService {
	private logger: Logger = new Logger(SpacesService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adapt(graphQlSpace: any): Space {
		return {
			id: get(graphQlSpace, 'id'),
			maintainerId: get(graphQlSpace, 'schema_maintainer.schema_identifier'),
			name: get(graphQlSpace, 'schema_maintainer.schema_name'),
			description: isEmpty(graphQlSpace.schema_description)
				? graphQlSpace.schema_maintainer?.information?.[0]?.description
				: graphQlSpace.schema_description,
			serviceDescription: get(graphQlSpace, 'schema_service_description'),
			image: get(graphQlSpace, 'schema_image'),
			color: get(graphQlSpace, 'schema_color'),
			logo: get(graphQlSpace, 'schema_maintainer.information[0].logo.iri'),
			audienceType: get(graphQlSpace, 'schema_audience_type'),
			publicAccess: get(graphQlSpace, 'schema_public_access'),
			contactInfo: {
				email: get(
					graphQlSpace,
					'schema_maintainer.information[0].primary_site.address.email'
				),
				telephone: get(
					graphQlSpace,
					'schema_maintainer.information[0].primary_site.address.telephone'
				),
				address: {
					street: get(
						graphQlSpace,
						'schema_maintainer.information[0].primary_site.address.street'
					),
					postalCode: get(
						graphQlSpace,
						'schema_maintainer.information[0].primary_site.address.postal_code'
					),
					locality: get(
						graphQlSpace,
						'schema_maintainer.information[0].primary_site.address.locality'
					),
					postOfficeBoxNumber: get(
						graphQlSpace,
						'schema_maintainer.information[0].primary_site.address.post_office_box_number'
					),
				},
			},
			isPublished: get(graphQlSpace, 'is_published'),
			publishedAt: get(graphQlSpace, 'published_at'),
			createdAt: get(graphQlSpace, 'created_at'),
			updatedAt: get(graphQlSpace, 'updated_at'),
		};
	}

	public async findAll(inputQuery: SpacesQueryDto): Promise<IPagination<Space>> {
		const { query, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const spacesResponse = await this.dataService.execute(FIND_SPACES, {
			query,
			offset,
			limit,
			orderBy: set({}, orderProp, orderDirection),
		});

		return Pagination<Space>({
			items: spacesResponse.data.cp_space.map((space: any) => this.adapt(space)),
			page,
			size,
			total: spacesResponse.data.cp_space_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<Space> {
		const spaceResponse = await this.dataService.execute(FIND_SPACE_BY_ID, { id });
		if (!spaceResponse.data.cp_space[0]) {
			throw new NotFoundException();
		}
		return this.adapt(spaceResponse.data.cp_space[0]);
	}
}
