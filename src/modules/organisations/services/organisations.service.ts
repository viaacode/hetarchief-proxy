import { DataService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { isEmpty, set, shuffle } from 'lodash';

import {
	GqlOrganisation,
	GqlOrganisationSlug,
	MaintainerGridOrganisation,
	Organisation,
	OrganisationSlug,
} from '../organisations.types';

import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { hoursToSeconds } from 'date-fns';
import {
	FindOrganisationsBySchemaIdsDocument,
	type FindOrganisationsBySchemaIdsQuery,
	type FindOrganisationsBySchemaIdsQueryVariables,
	FindOrganisationSlugsDocument,
	FindOrganisationSlugsQuery,
	FindOrganisationSlugsQueryVariables,
	GetOrganisationBySlugDocument,
	type GetOrganisationBySlugQuery,
	type GetOrganisationBySlugQueryVariables,
	GetOrganisationsThatHaveObjectsDocument,
	type GetOrganisationsThatHaveObjectsQuery,
	Maintainer_Organization_Slug_Bool_Exp,
	Maintainer_Organization_Slug_Order_By,
	UpdateOrganisationSlugDocument,
	UpdateOrganisationSlugMutation,
	UpdateOrganisationSlugMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObjectSector } from '~modules/ie-objects/ie-objects.types';
import { OrganisationSlugQueryDto } from '~modules/organisations/dto/organisations.dto';
import { getOrganisationAddress } from '~modules/organisations/helpers/get-organisation-address';
import { ORDER_PROP_TO_DB_PROP } from '~modules/organisations/organisations.consts';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class OrganisationsService {
	constructor(
		private dataService: DataService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	public async findOrganisationsBySchemaIdentifiers(
		schemaIdentifiers: string[]
	): Promise<Organisation[]> {
		if (schemaIdentifiers.length === 0) {
			return [];
		}
		const organisationsResponse = await this.dataService.execute<
			FindOrganisationsBySchemaIdsQuery,
			FindOrganisationsBySchemaIdsQueryVariables
		>(FindOrganisationsBySchemaIdsDocument, { schemaIdentifiers });

		return (organisationsResponse?.graph_organization || []).map(this.adapt);
	}

	public adapt(gqlOrganisation: GqlOrganisation): Organisation {
		const orgAddress = getOrganisationAddress(gqlOrganisation.hasSite);
		return {
			schemaIdentifier: gqlOrganisation?.org_identifier,
			contactPoint: gqlOrganisation?.schemaContactPoint.map((contactPoint) => ({
				contactType: contactPoint.schema_contact_type,
				email: contactPoint.schema_email,
			})),
			description: gqlOrganisation?.dcterms_description,
			logo: gqlOrganisation?.ha_org_has_logo || null,
			schemaName: gqlOrganisation?.skos_pref_label,
			createdAt: gqlOrganisation?.created_at,
			updatedAt: gqlOrganisation?.updated_at,
			sector: gqlOrganisation?.ha_org_sector as IeObjectSector,
			formUrl: gqlOrganisation?.ha_org_request_form,
			slug: gqlOrganisation?.organizationSlug?.slug,
			vatNumber: gqlOrganisation?.schema_vat_id || null,
			streetAddress: orgAddress?.schema_street_address || null,
			postalCode: orgAddress?.schema_postal_code || null,
			addressLocality: orgAddress?.schema_address_locality || null,
		};
	}

	public adaptOrganisation(
		gqlOrganisation: GetOrganisationsThatHaveObjectsQuery['graph_organisations_with_objects'][0]
	): MaintainerGridOrganisation {
		return {
			id: gqlOrganisation.org_identifier,
			name: gqlOrganisation.skos_pref_label,
			logoUrl: gqlOrganisation.ha_org_has_logo,
			homepageUrl: gqlOrganisation.foaf_homepage,
			slug: gqlOrganisation.organization_slug,
		};
	}

	public async findOrganisationBySlug(slug: string): Promise<Organisation> {
		const organisationsResponse = await this.dataService.execute<
			GetOrganisationBySlugQuery,
			GetOrganisationBySlugQueryVariables
		>(GetOrganisationBySlugDocument, { slug });

		if (!organisationsResponse?.graph_organization[0]) {
			return null;
		}

		return this.adapt(organisationsResponse?.graph_organization[0]);
	}

	public async fetchAllContentPartnersThatHaveObjects(): Promise<MaintainerGridOrganisation[]> {
		try {
			const organisationsResponse =
				await this.dataService.execute<GetOrganisationsThatHaveObjectsQuery>(
					GetOrganisationsThatHaveObjectsDocument
				);

			return organisationsResponse.graph_organisations_with_objects.map(this.adaptOrganisation);
		} catch (err: any) {
			throw new InternalServerErrorException(
				JSON.stringify({
					message: 'Failed to get all content partners from the org api',
					innerException: err,
					additionalInfo: {
						query: 'contentpartners',
					},
				})
			);
		}
	}

	public async fetchRandomContentPartnersForMaintainerGrid(
		limit: number
	): Promise<MaintainerGridOrganisation[]> {
		try {
			const allContentPartners = await this.cacheManager.wrap(
				'CONTENT_PARTNERS_MAINTAINER_GRID',
				() => this.fetchAllContentPartnersThatHaveObjects(),
				// cache for 1 hour
				hoursToSeconds(1)
			);

			return shuffle(allContentPartners.filter((contentPartner) => !!contentPartner.logoUrl)).slice(
				0,
				limit
			);
		} catch (err: any) {
			throw new InternalServerErrorException(
				JSON.stringify({
					message: 'Failed to get organisations from the org api',
					innerException: err,
					additionalInfo: {
						query: 'contentpartners',
					},
				})
			);
		}
	}

	public async findAll(
		inputQuery: OrganisationSlugQueryDto
	): Promise<IPagination<OrganisationSlug>> {
		const { query, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: Maintainer_Organization_Slug_Bool_Exp = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			// Everyone should be able to search on the IE Objects name
			where._or = [
				{ org_identifier: { _ilike: query } },
				{ slug: { _ilike: query } },
				{ organisation: { skos_pref_label: { _ilike: query } } },
			];
		}

		const propToOrder = ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP.name;
		let orderBy: Maintainer_Organization_Slug_Order_By;

		if (propToOrder === ORDER_PROP_TO_DB_PROP.name) {
			orderBy = {
				organisation: set({}, 'skos_pref_label', orderDirection || SortDirection.desc),
			};
		} else {
			orderBy = set({}, propToOrder, orderDirection || SortDirection.desc);
		}

		const organisationSlugsResponse = await this.dataService.execute<
			FindOrganisationSlugsQuery,
			FindOrganisationSlugsQueryVariables
		>(FindOrganisationSlugsDocument, {
			where,
			offset,
			limit,
			orderBy,
		});

		return Pagination<OrganisationSlug>({
			items: organisationSlugsResponse.maintainer_organization_slug.map((organisation) =>
				this.adaptOrganisationSlug(organisation)
			),
			page,
			size,
			total: organisationSlugsResponse.maintainer_organization_slug_aggregate.aggregate.count,
		});
	}

	public async updateOrganisationSlug(
		orgIdentifier: string,
		slug: string
	): Promise<OrganisationSlug> {
		const organisationSlugsResponse = await this.dataService.execute<
			UpdateOrganisationSlugMutation,
			UpdateOrganisationSlugMutationVariables
		>(UpdateOrganisationSlugDocument, {
			org_identifier: orgIdentifier,
			slug,
		});

		if (!organisationSlugsResponse) {
			throw new CustomError('Could not update organisation slug - not found', null, {
				orgIdentifier,
				slug,
				organisationSlugsResponse,
			});
		}

		return this.adaptOrganisationSlug(
			organisationSlugsResponse.update_maintainer_organization_slug.returning?.[0]
		);
	}

	private adaptOrganisationSlug(
		graphQlOrganisationSlug: GqlOrganisationSlug
	): OrganisationSlug | null {
		if (!graphQlOrganisationSlug) {
			return null;
		}
		return {
			org_identifier: graphQlOrganisationSlug.org_identifier,
			slug: graphQlOrganisationSlug.slug,
			name: graphQlOrganisationSlug.organisation.skos_pref_label,
		};
	}
}
