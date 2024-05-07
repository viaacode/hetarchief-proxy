import { DataService, TranslationsService } from '@meemoo/admin-core-api';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { find, set } from 'lodash';

import { CreateSpaceDto, SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { AccessType, GqlSpace, Space } from '../types';

import {
	CreateSpaceDocument,
	CreateSpaceMutation,
	CreateSpaceMutationVariables,
	FindSpaceByIdDocument,
	FindSpaceByIdQuery,
	FindSpaceByIdQueryVariables,
	FindSpaceByMaintainerIdDocument,
	FindSpaceByMaintainerIdQuery,
	FindSpaceByMaintainerIdQueryVariables,
	FindSpaceByOrganisationIdDocument,
	FindSpaceByOrganisationIdQuery,
	FindSpaceByOrganisationIdQueryVariables,
	FindSpaceBySlugDocument,
	FindSpaceBySlugQuery,
	FindSpaceBySlugQueryVariables,
	FindSpacesDocument,
	FindSpacesQuery,
	FindSpacesQueryVariables,
	GetSpaceMaintainerProfilesDocument,
	GetSpaceMaintainerProfilesQuery,
	GetSpaceMaintainerProfilesQueryVariables,
	Maintainer_Visitor_Space_Set_Input,
	UpdateSpaceDocument,
	UpdateSpaceMutation,
	UpdateSpaceMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { OrganisationInfoV2 } from '~modules/organisations/organisations.types';
import { DuplicateKeyException } from '~shared/exceptions/duplicate-key.exception';
import { PaginationHelper } from '~shared/helpers/pagination';
import { Recipient } from '~shared/types/types';

@Injectable()
export class SpacesService {
	constructor(
		protected dataService: DataService,
		protected translationsService: TranslationsService
	) {}

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
			const response = await this.dataService.execute<
				CreateSpaceMutation,
				CreateSpaceMutationVariables
			>(CreateSpaceDocument, {
				createSpace,
			});

			return this.adapt(response.insert_maintainer_visitor_space_one);
		} catch (e) {
			this.handleException(e, createSpaceDto);
		}
	}

	public async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
		const updateSpace = this.buildSpaceDatabaseObject(updateSpaceDto);
		try {
			const response = await this.dataService.execute<
				UpdateSpaceMutation,
				UpdateSpaceMutationVariables
			>(UpdateSpaceDocument, {
				id,
				updateSpace,
			});

			const updatedSpace = response.update_maintainer_visitor_space_by_pk;

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
					{ content_partner: { information: { description: { _ilike: query } } } },
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

		const queryVariables = {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				orderProp === 'status' ? 'status_info.sort_order.sort_order' : orderProp,
				orderDirection
			),
		};
		const spacesResponse = await this.dataService.execute<
			FindSpacesQuery,
			FindSpacesQueryVariables
		>(FindSpacesDocument, queryVariables);

		return Pagination<Space>({
			items: spacesResponse.maintainer_visitor_space.map((space) => this.adapt(space)),
			page,
			size,
			total: spacesResponse.maintainer_visitor_space_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<
			FindSpaceByIdQuery,
			FindSpaceByIdQueryVariables
		>(FindSpaceByIdDocument, { id });
		if (!spaceResponse.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.maintainer_visitor_space[0]);
	}

	public async findByMaintainerId(maintainerId: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<
			FindSpaceByMaintainerIdQuery,
			FindSpaceByMaintainerIdQueryVariables
		>(FindSpaceByMaintainerIdDocument, { maintainerId });
		if (!spaceResponse.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.maintainer_visitor_space[0]);
	}

	public async findBySlug(slug: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<
			FindSpaceBySlugQuery,
			FindSpaceBySlugQueryVariables
		>(FindSpaceBySlugDocument, {
			slug,
		});
		if (!spaceResponse.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.maintainer_visitor_space[0]);
	}

	public async findSpaceByOrganisationId(organisationId: string): Promise<Space | null> {
		const spaceResponse = await this.dataService.execute<
			FindSpaceByOrganisationIdQuery,
			FindSpaceByOrganisationIdQueryVariables
		>(FindSpaceByOrganisationIdDocument, {
			organisationId,
		});
		if (!spaceResponse.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.maintainer_visitor_space[0]);
	}

	public async getMaintainerProfiles(spaceId: string): Promise<Recipient[]> {
		const spaces = await this.dataService.execute<
			GetSpaceMaintainerProfilesQuery,
			GetSpaceMaintainerProfilesQueryVariables
		>(GetSpaceMaintainerProfilesDocument, {
			spaceId,
		});

		/* istanbul ignore next */
		return (spaces?.maintainer_visitor_space || []).flatMap((space) => {
			return (space.profiles || []).map((profile) => ({
				id: profile.id,
				email: profile.mail,
			}));
		});
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
					this.translationsService.tText(
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
