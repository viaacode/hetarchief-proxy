import { DataService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { shuffle } from 'lodash';

import {
	type GqlOrganisation,
	type MaintainerGridOrganisation,
	type Organisation,
} from '../organisations.types';

import {
	FindOrganisationsBySchemaIdsDocument,
	type FindOrganisationsBySchemaIdsQuery,
	type FindOrganisationsBySchemaIdsQueryVariables,
	GetOrganisationBySlugDocument,
	type GetOrganisationBySlugQuery,
	type GetOrganisationBySlugQueryVariables,
	GetOrganisationsThatHaveObjectsDocument,
	type GetOrganisationsThatHaveObjectsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { type IeObjectSector } from '~modules/ie-objects/ie-objects.types';

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
			slug: gqlOrganisation?.skos_alt_label,
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
			slug: gqlOrganisation.skos_alt_label,
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

			return organisationsResponse.graph_organisations_with_objects.map(
				this.adaptOrganisation
			);
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
				// cache for 60 minutes
				3_600_000
			);

			return shuffle(
				allContentPartners.filter((contentPartner) => !!contentPartner.logoUrl)
			).slice(0, limit);
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
}
