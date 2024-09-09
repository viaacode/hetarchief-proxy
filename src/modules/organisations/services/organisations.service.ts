import { DataService } from '@meemoo/admin-core-api';
import {
	Injectable,
	InternalServerErrorException,
	Logger,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { compact, uniqBy } from 'lodash';

import { Configuration } from '~config';

import {
	GqlOrganisation,
	Organisation,
	OrganisationInfoV2,
	OrganisationResponse,
	ParsedOrganisation,
} from '../organisations.types';

import {
	DeleteOrganisationsDocument,
	FindOrganisationsBySchemaIdsDocument,
	FindOrganisationsBySchemaIdsQuery,
	FindOrganisationsBySchemaIdsQueryVariables,
	GetOrganisationBySlugDocument,
	GetOrganisationBySlugQuery,
	GetOrganisationBySlugQueryVariables,
	InsertOrganisationsDocument,
} from '~generated/graphql-db-types-hetarchief';
import { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

@Injectable()
export class OrganisationsService implements OnApplicationBootstrap {
	private logger: Logger = new Logger(OrganisationsService.name, { timestamp: true });

	constructor(
		private dataService: DataService,
		private configService: ConfigService<Configuration>
	) {}

	public async onApplicationBootstrap() {
		// For now you can manually trigger a refresh of the cache using /organisations/update-cache with the proxy api key
		try {
			this.logger.log('caching organizations...');

			await this.updateOrganisationsCache();

			this.logger.log('caching organizations... done');
		} catch (err) {
			this.logger.log('caching organizations... error');

			/* istanbul ignore next */
			this.logger.error(
				new InternalServerErrorException({
					message: 'Failed to fill initial organizations cache',
					innerException: err,
				})
			);
		}
	}

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

		return ((organisationsResponse?.maintainer_organisation || []) as GqlOrganisation[]).map(
			this.adapt
		);
	}

	public adapt(gqlOrganisation: GqlOrganisation): Organisation {
		return {
			schemaIdentifier: gqlOrganisation?.schema_identifier,
			contactPoint: gqlOrganisation?.contact_point.map((contactPoint) => ({
				contactType: contactPoint.contact_type,
				email: contactPoint.email,
			})),
			description: gqlOrganisation?.description,
			logo: gqlOrganisation?.logo,
			primarySite: gqlOrganisation?.primary_site,
			schemaName: gqlOrganisation?.schema_name,
			createdAt: gqlOrganisation?.created_at,
			updatedAt: gqlOrganisation?.updated_at,
			sector: gqlOrganisation?.haorg_organization_type as IeObjectSector,
			formUrl: gqlOrganisation?.form_url,
			slug: gqlOrganisation?.slug,
		};
	}

	public async updateOrganisationsCache() {
		let url;

		try {
			url = this.configService.get('ORGANIZATIONS_API_V2_URL');

			const queryBody = {
				query: `
query getAllOrganisations {
	meemoo: organizations(label: "meemoo") {
		id
		label
		description
		sector
		slug
		form_url
		homepage
		overlay
		logo {
			iri
		}
		contact_point {
			contact_type
			telephone
			email
		}
		primary_site {
			address {
				locality
				postal_code
				street
				telephone
				post_office_box_number
			}
		}
	}
	contentPartners: organizations(type: ContentPartner) {
		id
		label
		description
		sector
		slug
		form_url
		homepage
		overlay
		logo {
			iri
		}
		contact_point {
			contact_type
			telephone
			email
		}
		primary_site {
			address {
				locality
				postal_code
				street
				telephone
				post_office_box_number
			}
		}
	}
	educationalPartners: organizations(type: EducationalPartner) {
		id
		label
		description
		sector
		slug
		form_url
		homepage
		overlay
		logo {
			iri
		}
		contact_point {
			contact_type
			telephone
			email
		}
		primary_site {
			address {
				locality
				postal_code
				street
				telephone
				post_office_box_number
			}
		}
	}
	serviceProviders: organizations(type: ServiceProvider ) {
		id
		label
		description
		sector
		slug
		form_url
		homepage
		overlay
		logo {
			iri
		}
		contact_point {
			contact_type
			telephone
			email
		}
		primary_site {
			address {
				locality
				postal_code
				street
				telephone
				post_office_box_number
			}
		}
	}
}`,
			};
			const orgResponse: OrganisationResponse = await got({
				url,
				method: 'post',
				throwHttpErrors: true,
				json: queryBody,
			}).json<OrganisationResponse>();

			// Handle response
			if ((orgResponse?.data?.contentPartners?.length || 0) > 50) {
				await this.emptyOrganizations();
				await this.insertOrganizations([
					...compact(orgResponse?.data.meemoo || []),
					...compact(orgResponse?.data.contentPartners || []),
					...compact(orgResponse?.data.educationalPartner || []),
					...compact(orgResponse?.data.serviceProviders || []),
				]);
			} else {
				/* istanbul ignore next */
				throw new InternalServerErrorException({
					message: 'Request to organizations api was unsuccessful',
					innerException: null,
					additionalInfo: {
						url,
						method: 'get',
						response: orgResponse,
					},
				});
			}
		} catch (err) {
			/* istanbul ignore next */
			throw new InternalServerErrorException({
				message: 'Failed to make update organization cache',
				innerException: err,
				additionalInfo: {
					url,
					method: 'get',
				},
			});
		}
	}

	private async insertOrganizations(organizations: OrganisationInfoV2[]): Promise<void> {
		const parsedOrganizations: ParsedOrganisation[] = uniqBy(
			compact(organizations).map(
				(organization: OrganisationInfoV2): ParsedOrganisation => ({
					schema_identifier: organization?.id,
					schema_name: organization?.label,
					description: organization.description,
					logo: organization?.logo || {}, // Hasura v2.6.0 complains about null jsonb values
					slug: organization?.slug,
					overlay: organization?.overlay ?? true,
					contact_point: organization.contact_point || [], // Hasura v2.6.0 complains about null jsonb values
					primary_site: organization.primary_site || {}, // Hasura v2.6.0 complains about null jsonb values
					// Remark here organization is with Z
					haorg_organization_type: organization?.sector || null,
					form_url: organization?.form_url || null,
					homepage_url: organization?.homepage || null,
				})
			),
			(org) => org.schema_identifier
		);

		const uniqueOrganisations = uniqBy(parsedOrganizations, 'schema_identifier');

		try {
			await this.dataService.execute(InsertOrganisationsDocument, {
				organizations: uniqueOrganisations,
			});
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to insert organizations',
				innerException: err,
			});
		}
	}

	private async emptyOrganizations(): Promise<void> {
		try {
			await this.dataService.execute(DeleteOrganisationsDocument);
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to empty organizations',
				innerException: err,
			});
		}
	}

	public async findOrganisationBySlug(slug: string): Promise<Organisation> {
		const organisationsResponse = await this.dataService.execute<
			GetOrganisationBySlugQuery,
			GetOrganisationBySlugQueryVariables
		>(GetOrganisationBySlugDocument, { slug });

		if (!organisationsResponse?.maintainer_organisation[0]) {
			return null;
		}

		return this.adapt(organisationsResponse?.maintainer_organisation[0]);
	}
}
