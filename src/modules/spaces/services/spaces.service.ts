import { Injectable, Logger } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get, isEmpty, set } from 'lodash';

import { SpacesQueryDto } from '../dto/spaces.dto';
import { AccessType, Space } from '../types';

import {
	FIND_SPACE_BY_CP_ADMIN_ID,
	FIND_SPACE_BY_ID,
	FIND_SPACES,
	GET_SPACE_MAINTAINER_PROFILES,
} from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';
import { Recipient } from '~shared/types/types';

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

	public async findAll(
		inputQuery: SpacesQueryDto,
		userProfileId: string | undefined
	): Promise<IPagination<Space>> {
		const { query, accessType, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		// Build where object
		const filterArray: any[] = [];

		if (query && query !== '%') {
			filterArray.push({
				_or: [
					{ schema_description: { _ilike: query } },
					{ schema_maintainer: { schema_name: { _ilike: query } } },
				],
			});
		}

		if (accessType) {
			if (!userProfileId) {
				return Pagination<Space>({
					items: [],
					page,
					size,
					total: 0,
				});
			}
			const now = new Date().toISOString();
			if (accessType === AccessType.ACTIVE) {
				filterArray.push({
					visits: {
						start_date: { _lte: now },
						end_date: { _gte: now },
						status: { _eq: 'APPROVED' },
						user_profile_id: { _eq: userProfileId },
					},
				});
			} else {
				filterArray.push({
					_and: [
						{
							_not: {
								visits: {
									_or: [
										{ start_date: { _gt: now } },
										{ end_date: { _lt: now } },
										{ status: { _neq: 'APPROVED' } },
									],
									user_profile_id: { _eq: userProfileId },
								},
							},
						},
						{},
					],
				});
			}
		}
		const where: any = { _and: filterArray };

		const spacesResponse = await this.dataService.execute(FIND_SPACES, {
			where,
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

	public async findById(id: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute(FIND_SPACE_BY_ID, { id });
		if (!spaceResponse.data.cp_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.data.cp_space[0]);
	}

	public async findSpaceByCpUserId(cpAdminId: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute(FIND_SPACE_BY_CP_ADMIN_ID, {
			cpAdminId,
		});
		if (!spaceResponse.data.cp_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.data.cp_space[0]);
	}

	public async getMaintainerProfiles(spaceId: string): Promise<Recipient[]> {
		const profiles = await this.dataService.execute(GET_SPACE_MAINTAINER_PROFILES, {
			spaceId,
		});
		return get(profiles, 'data.cp_maintainer_users_profile', []).map((item) => ({
			id: item.users_profile_id,
			email: item.profile.mail,
		}));
	}
}
