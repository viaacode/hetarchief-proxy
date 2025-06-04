// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { DataService, TranslationsService } from '@meemoo/admin-core-api';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { set } from 'lodash';

import type { CreateSpaceDto, SpacesQueryDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { AccessType, type GqlSpace, type VisitorSpace } from '../spaces.types';

import {
	CreateSpaceDocument,
	type CreateSpaceMutation,
	type CreateSpaceMutationVariables,
	FindSpaceByIdDocument,
	type FindSpaceByIdQuery,
	type FindSpaceByIdQueryVariables,
	FindSpaceByOrganisationIdDocument,
	type FindSpaceByOrganisationIdQuery,
	type FindSpaceByOrganisationIdQueryVariables,
	FindSpaceBySlugDocument,
	type FindSpaceBySlugQuery,
	type FindSpaceBySlugQueryVariables,
	FindSpacesDocument,
	type FindSpacesQuery,
	type FindSpacesQueryVariables,
	GetVisitorSpaceCpAdminProfilesDocument,
	type GetVisitorSpaceCpAdminProfilesQuery,
	type GetVisitorSpaceCpAdminProfilesQueryVariables,
	type Maintainer_Visitor_Space_Bool_Exp,
	type Maintainer_Visitor_Space_Set_Input,
	UpdateSpaceDocument,
	type UpdateSpaceMutation,
	type UpdateSpaceMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { type GqlOrganisation, OrganisationContactPointType } from '~modules/organisations/organisations.types';
import { DuplicateKeyException } from '~shared/exceptions/duplicate-key.exception';
import { PaginationHelper } from '~shared/helpers/pagination';
import type { Locale, Recipient } from '~shared/types/types';

@Injectable()
export class SpacesService {
	constructor(
		private dataService: DataService,
		protected translationsService: TranslationsService
	) {}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adapt(graphQlSpace: GqlSpace): VisitorSpace {
		/* istanbul ignore next */
		return {
			id: graphQlSpace?.id,
			slug: graphQlSpace?.slug,
			maintainerId: graphQlSpace?.organisation?.org_identifier,
			name: graphQlSpace?.organisation?.skos_pref_label,
			info: graphQlSpace?.organisation?.dcterms_description,
			descriptionNl: graphQlSpace?.schema_description_nl,
			serviceDescriptionNl: graphQlSpace?.schema_service_description_nl,
			descriptionEn: graphQlSpace?.schema_description_en,
			serviceDescriptionEn: graphQlSpace?.schema_service_description_en,
			image: graphQlSpace?.schema_image,
			color: graphQlSpace?.schema_color,
			logo: graphQlSpace?.organisation?.ha_org_has_logo,
			audienceType: graphQlSpace?.schema_audience_type,
			publicAccess: graphQlSpace?.schema_public_access,
			contactInfo: {
				email: this.adaptEmail(graphQlSpace?.organisation?.schemaContactPoint),
				telephone: this.adaptTelephone(graphQlSpace?.organisation?.schemaContactPoint),
			},
			status: graphQlSpace?.status,
			publishedAt: graphQlSpace?.published_at,
			createdAt: graphQlSpace?.created_at,
			updatedAt: graphQlSpace?.updated_at,
		};
	}

	public adaptEmail(contactPoints: GqlOrganisation['schemaContactPoint'] | undefined): string {
		const contactPoint = (contactPoints || []).find(
			(contactPoint) =>
				contactPoint.schema_contact_type === OrganisationContactPointType.ontsluiting
		);
		return contactPoint?.schema_email || null;
	}

	public adaptTelephone(contactPoints: GqlOrganisation['schemaContactPoint'] | undefined): string {
		const contactPoint = (contactPoints || []).find(
			(contactPoint) =>
				contactPoint.schema_contact_type === OrganisationContactPointType.ontsluiting
		);
		return contactPoint?.schema_telephone || null;
	}

	protected buildSpaceDatabaseObject(
		inputDto: Partial<CreateSpaceDto>
	): Maintainer_Visitor_Space_Set_Input {
		const inputKeys = Object.keys(inputDto);
		return {
			...(inputKeys.includes('orId') ? { schema_maintainer_id: inputDto.orId } : {}),
			...(inputKeys.includes('slug') ? { slug: inputDto.slug } : {}),
			...(inputKeys.includes('color') ? { schema_color: inputDto.color } : {}),
			...(inputKeys.includes('descriptionNl')
				? { schema_description_nl: inputDto.descriptionNl }
				: {}),
			...(inputKeys.includes('serviceDescriptionNl')
				? { schema_service_description_nl: inputDto.serviceDescriptionNl }
				: {}),
			...(inputKeys.includes('descriptionEn')
				? { schema_description_en: inputDto.descriptionEn }
				: {}),
			...(inputKeys.includes('serviceDescriptionEn')
				? { schema_service_description_en: inputDto.serviceDescriptionEn }
				: {}),
			...(inputKeys.includes('image') ? { schema_image: inputDto.image } : {}),
			...(inputKeys.includes('status') ? { status: inputDto.status } : {}),
		};
	}

	public async create(createSpaceDto: CreateSpaceDto, language: Locale): Promise<VisitorSpace> {
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
			this.handleException(e, createSpaceDto, language);
		}
	}

	public async update(
		id: string,
		updateSpaceDto: UpdateSpaceDto,
		language: Locale
	): Promise<VisitorSpace> {
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
			this.handleException(e, updateSpaceDto, language);
		}
	}

	public async findAll(
		inputQuery: SpacesQueryDto,
		userProfileId: string | undefined
	): Promise<IPagination<VisitorSpace>> {
		const { query, accessType, status, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		// Build where object
		const filterArray: FindSpacesQueryVariables['where'][] = [];

		if (query && query !== '%' && query !== '%%') {
			filterArray.push({
				_or: [
					{ organisation: { dcterms_description: { _ilike: query } } },
					{ organisation: { skos_pref_label: { _ilike: query } } },
				],
			});
		}

		if (accessType) {
			if (!userProfileId) {
				return Pagination<VisitorSpace>({
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

		const where: Maintainer_Visitor_Space_Bool_Exp =
			filterArray.length > 0 ? { _and: filterArray } : {};

		const queryVariables: FindSpacesQueryVariables = {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				orderProp === 'status' ? 'statusInfo.sort_order.sort_order' : orderProp,
				orderDirection
			),
		};
		const spacesResponse = await this.dataService.execute<
			FindSpacesQuery,
			FindSpacesQueryVariables
		>(FindSpacesDocument, queryVariables);

		return Pagination<VisitorSpace>({
			items: spacesResponse.maintainer_visitor_space.map((space) => this.adapt(space)),
			page,
			size,
			total: spacesResponse.maintainer_visitor_space_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<VisitorSpace | null> {
		const spaceResponse = await this.dataService.execute<
			FindSpaceByIdQuery,
			FindSpaceByIdQueryVariables
		>(FindSpaceByIdDocument, { id });
		if (!spaceResponse.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(spaceResponse.maintainer_visitor_space[0]);
	}

	public async findByMaintainerId(organisationId: string): Promise<VisitorSpace | null> {
		const visitorSpaceResponse = await this.dataService.execute<
			FindSpaceByOrganisationIdQuery,
			FindSpaceByOrganisationIdQueryVariables
		>(FindSpaceByOrganisationIdDocument, { organisationId });
		if (!visitorSpaceResponse.maintainer_visitor_space[0]) {
			return null;
		}
		return this.adapt(visitorSpaceResponse.maintainer_visitor_space[0]);
	}

	public async findBySlug(slug: string): Promise<VisitorSpace | null> {
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

	public async findSpaceByOrganisationId(organisationId: string): Promise<VisitorSpace | null> {
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
			GetVisitorSpaceCpAdminProfilesQuery,
			GetVisitorSpaceCpAdminProfilesQueryVariables
		>(GetVisitorSpaceCpAdminProfilesDocument, {
			spaceId,
		});

		/* istanbul ignore next */
		return (spaces?.maintainer_visitor_space || []).flatMap((space) => {
			return (space.profiles || []).map((profile) => {
				return {
					id: profile.id,
					email: profile.mail,
					language: profile.language,
				};
			});
		});
	}

	public handleException(e: Error, inputDto: Partial<CreateSpaceDto>, language: Locale): void {
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
						{ slug: inputDto.slug },
						language
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
