import { Injectable, Logger } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get } from 'lodash';

import { SpacesQueryDto } from '../dto/spaces.dto';
import { Space } from '../types';

import { GET_SPACES } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class SpacesService {
	private logger: Logger = new Logger(SpacesService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Convert page and size to offset and limit
	 */
	public convertPagination(page: number, size: number): { offset: number; limit: number } {
		const offset = page > 0 ? (page - 1) * size : 0;
		return {
			offset,
			limit: size,
		};
	}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adapt(graphQlSpace: any): Space {
		return {
			id: get(graphQlSpace, 'id'),
			maintainerId: get(graphQlSpace, 'schema_maintainer.schema_identifier'),
			name: get(graphQlSpace, 'schema_maintainer.schema_name'),
			description: get(graphQlSpace, 'schema_description'),
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
				},
			},
			isPublished: get(graphQlSpace, 'is_published'),
			publishedAt: get(graphQlSpace, 'published_at'),
			createdAt: get(graphQlSpace, 'created_at'),
			updatedAt: get(graphQlSpace, 'updated_at'),
		};
	}

	public async findAll(inputQuery: SpacesQueryDto): Promise<IPagination<Space>> {
		const { query, page, size } = inputQuery;
		const { offset, limit } = this.convertPagination(page, size);
		const spacesResponse = await this.dataService.execute(GET_SPACES, { query, offset, limit });

		return Pagination<Space>({
			items: spacesResponse.data.cp_space.map((space: any) => this.adapt(space)),
			page,
			size,
			total: spacesResponse.data.cp_space_aggregate.aggregate.count,
		});
	}
}
