import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { find, set } from 'lodash';

import { CreateSpaceDto, SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { AccessType, GqlSpace, Space } from '../types';

import {
	CreateSpaceDocument,
	CreateSpaceMutation,
	FindSpaceByCpAdminIdDocument,
	FindSpaceByCpAdminIdQuery,
	FindSpaceByIdDocument,
	FindSpaceByIdQuery,
	FindSpaceByMaintainerIdDocument,
	FindSpaceByMaintainerIdQuery,
	FindSpaceBySlugDocument,
	FindSpaceBySlugQuery,
	FindSpacesDocument,
	FindSpacesQuery,
	FindSpacesQueryVariables,
	GetSpaceMaintainerProfilesDocument,
	GetSpaceMaintainerProfilesQuery,
	Maintainer_Visitor_Space_Set_Input,
	UpdateSpaceDocument,
	UpdateSpaceMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { OrganisationInfoV2 } from '~modules/organisations/organisations.types';
import { DuplicateKeyException } from '~shared/exceptions/duplicate-key.exception';
import { PaginationHelper } from '~shared/helpers/pagination';
import i18n from '~shared/i18n';
import { Recipient } from '~shared/types/types';

@Injectable()
export class SpacesService {
	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adapt(graphQlSpace: GqlSpace): Space {
		/* istanbul ignore next */
		const information = graphQlSpace?.content_partner?.information as OrganisationInfoV2;
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
				email: this.adaptEmail(information),
				telephone: this.adaptTelephone(information),
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

	public adaptEmail(graphQlInfo: OrganisationInfoV2 | undefined): string {
		const contactPoint = find(graphQlInfo?.contact_point, { contact_type: 'ontsluiting' });
		return contactPoint?.email || null;
	}

	public adaptTelephone(graphQlInfo: OrganisationInfoV2 | undefined): string {
		const contactPoint = find(graphQlInfo?.contact_point, { contact_type: 'ontsluiting' });
		return contactPoint?.telephone || null;
	}

	protected buildSpaceDatabaseObject(
		inputDto: Partial<CreateSpaceDto>
	): Maintainer_Visitor_Space_Set_Input {
		const inputKeys = Object.keys(inputDto);
		return {
			...(inputKeys.includes('orId') ? { schema_maintainer_id: inputDto.orId } : {}),
			...(inputKeys.includes('slug') ? { slug: inputDto.slug } : {}),
			...(inputKeys.includes('color') ? { schema_color: inputDto.color } : {}),
			...(inputKeys.includes('description')
				? { schema_description: inputDto.description }
				: {}),
			...(inputKeys.includes('serviceDescription')
				? { schema_service_description: inputDto.serviceDescription }
				: {}),
			...(inputKeys.includes('image') ? { schema_image: inputDto.image } : {}),
			...(inputKeys.includes('status') ? { status: inputDto.status } : {}),
		};
	}

	public async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
		const createSpace = this.buildSpaceDatabaseObject(createSpaceDto);
		try {
			const {
				data: { insert_maintainer_visitor_space_one: createdSpace },
			} = await this.dataService.execute<CreateSpaceMutation>(CreateSpaceDocument, {
				createSpace,
			});

			return this.adapt(createdSpace);
		} catch (e) {
			this.handleException(e, createSpaceDto);
		}
	}

	public async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
		const updateSpace = this.buildSpaceDatabaseObject(updateSpaceDto);
		try {
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
		} catch (e) {
			this.handleException(e, updateSpaceDto);
		}
	}

	public async findAll(
		inputQuery: SpacesQueryDto,
		userProfileId: string | undefined
	): Promise<IPagination<Space>> {
		const { query, accessType, status, page, size, orderProp, orderDirection } = inputQuery;
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

		if (status?.length) {
			filterArray.push({ status: { _in: status } });
		}

		const where: FindSpacesQueryVariables['where'] =
			filterArray.length > 0 ? { _and: filterArray } : {};

		const spacesResponse = await this.dataService.execute<FindSpacesQuery>(FindSpacesDocument, {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				orderProp === 'status' ? 'status_info.sort_order.sort_order' : orderProp,
				orderDirection
			),
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

	public async findByMaintainerId(maintainerId: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<FindSpaceByMaintainerIdQuery>(
			FindSpaceByMaintainerIdDocument,
			{ maintainerId }
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

	public handleException(e: Error, inputDto: Partial<CreateSpaceDto>): void {
		if (e instanceof DuplicateKeyException) {
			if (
				e.data.message ===
				'Uniqueness violation. duplicate key value violates unique constraint "space_schema_maintainer_id_key"'
			) {
				throw new InternalServerErrorException(
					`A space already exists for maintainer with id '${inputDto.orId}'`
				);
			}
			if (
				e.data.message ===
				'Foreign key violation. insert or update on table "visitor_space" violates foreign key constraint "space_schema_maintainer_id_fkey"'
			) {
				throw new InternalServerErrorException(`Unknown maintainerId '${inputDto.orId}'`);
			}
			if (
				e.data.message ===
				'Uniqueness violation. duplicate key value violates unique constraint "visitor_space_slug_key"'
			) {
				throw new InternalServerErrorException(
					i18n.t(
						'modules/spaces/services/spaces___a-space-already-exists-with-slug-slug',
						{ slug: inputDto.slug }
					)
				);
			}
		}
		if (e instanceof NotFoundException) {
			throw e;
		}
		// Unknown error
		throw new InternalServerErrorException();
	}
}
