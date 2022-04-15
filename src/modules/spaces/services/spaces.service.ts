import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { set } from 'lodash';

import { SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { AccessType, GqlSpace, Space } from '../types';

import {
	FindSpaceByCpAdminIdDocument,
	FindSpaceByCpAdminIdQuery,
	FindSpaceByIdDocument,
	FindSpaceByIdQuery,
	FindSpaceBySlugDocument,
	FindSpaceBySlugQuery,
	FindSpacesDocument,
	FindSpacesQuery,
	FindSpacesQueryVariables,
	GetSpaceMaintainerProfilesDocument,
	GetSpaceMaintainerProfilesQuery,
	UpdateSpaceDocument,
	UpdateSpaceMutation,
} from '~generated/graphql-db-types-hetarchief';
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
	public adapt(graphQlSpace: GqlSpace): Space {
		/* istanbul ignore next */
		const information = graphQlSpace?.content_partner?.information?.[0];
		/* istanbul ignore next */
		return {
			id: graphQlSpace?.id,
			slug: graphQlSpace?.slug,
			maintainerId: graphQlSpace?.content_partner?.schema_identifier,
			name: graphQlSpace?.content_partner?.schema_name,
			info: information?.description,
			description: graphQlSpace?.schema_description,
			serviceDescription: graphQlSpace?.schema_service_description,
			image: graphQlSpace?.schema_image,
			color: graphQlSpace?.schema_color,
			logo: information?.logo?.iri,
			audienceType: graphQlSpace?.schema_audience_type,
			publicAccess: graphQlSpace?.schema_public_access,
			contactInfo: {
				email: information?.primary_site?.address?.email,
				telephone: information?.primary_site?.address?.telephone,
				address: {
					street: information?.primary_site?.address?.street,
					postalCode: information?.primary_site?.address?.postal_code,
					locality: information?.primary_site?.address?.locality,
					postOfficeBoxNumber: information?.primary_site?.address?.post_office_box_number,
				},
			},
			status: graphQlSpace?.status,
			publishedAt: graphQlSpace?.published_at,
			createdAt: graphQlSpace?.created_at,
			updatedAt: graphQlSpace?.updated_at,
		};
	}

	public async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
		const updateKeys = Object.keys(updateSpaceDto);
		const updateSpace = {
			...(updateKeys.includes('color') ? { schema_color: updateSpaceDto.color } : {}),
			...(updateKeys.includes('description')
				? { schema_description: updateSpaceDto.description }
				: {}),
			...(updateKeys.includes('serviceDescription')
				? { schema_service_description: updateSpaceDto.serviceDescription }
				: {}),
			...(updateKeys.includes('image') ? { schema_image: updateSpaceDto.image } : {}),
		};
		const {
			data: { update_maintainer_visitor_space_by_pk: updatedSpace },
		} = await this.dataService.execute<UpdateSpaceMutation>(UpdateSpaceDocument, {
			id,
			updateSpace,
		});

		if (!updatedSpace) {
			throw new NotFoundException(`Space with id '${id}' not found`);
		}

		return this.adapt(updatedSpace);
	}

	public async findAll(
		inputQuery: SpacesQueryDto,
		userProfileId: string | undefined
	): Promise<IPagination<Space>> {
		const { query, accessType, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		// Build where object
		const filterArray: FindSpacesQueryVariables['where'][] = [];

		if (query && query !== '%' && query !== '%%') {
			filterArray.push({
				_or: [
					{ schema_description: { _ilike: query } },
					{ content_partner: { schema_name: { _ilike: query } } },
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
					visitor_space_requests: {
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
								visitor_space_requests: {
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
		const where: FindSpacesQueryVariables['where'] =
			filterArray.length > 0 ? { _and: filterArray } : {};

		const spacesResponse = await this.dataService.execute<FindSpacesQuery>(FindSpacesDocument, {
			where,
			offset,
			limit,
			orderBy: set({}, orderProp, orderDirection),
		});

		return Pagination<Space>({
			items: spacesResponse.data.maintainer_visitor_space.map((space) => this.adapt(space)),
			page,
			size,
			total: spacesResponse.data.maintainer_visitor_space_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<FindSpaceByIdQuery>(
			FindSpaceByIdDocument,
			{ id }
		);
		if (!spaceResponse.data.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.data.maintainer_visitor_space[0]);
	}

	public async findBySlug(slug: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<FindSpaceBySlugQuery>(
			FindSpaceBySlugDocument,
			{
				slug,
			}
		);
		if (!spaceResponse.data.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.data.maintainer_visitor_space[0]);
	}

	public async findSpaceByCpUserId(cpAdminId: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<FindSpaceByCpAdminIdQuery>(
			FindSpaceByCpAdminIdDocument,
			{
				cpAdminId,
			}
		);
		if (!spaceResponse.data.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.data.maintainer_visitor_space[0]);
	}

	public async getMaintainerProfiles(spaceId: string): Promise<Recipient[]> {
		const profiles = await this.dataService.execute<GetSpaceMaintainerProfilesQuery>(
			GetSpaceMaintainerProfilesDocument,
			{
				spaceId,
			}
		);

		/* istanbul ignore next */
		return (profiles?.data?.maintainer_users_profile || []).map((item) => ({
			id: item.users_profile_id,
			email: item.profile.mail,
		}));
	}
}
