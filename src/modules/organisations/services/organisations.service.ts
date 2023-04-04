import { DataService } from '@meemoo/admin-core-api';
import {
	Injectable,
	InternalServerErrorException,
	Logger,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { isNil, uniqBy } from 'lodash';

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
	FindOrganisationBySchemaIdDocument,
	FindOrganisationBySchemaIdQuery,
	FindOrganisationBySchemaIdQueryVariables,
	InsertOrganisationsDocument,
} from '~generated/graphql-db-types-hetarchief';

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

	public async findOrganisationBySchemaIdentifier(
		schemaIdentifier: string
	): Promise<Organisation | null> {
		const organisationResponse = await this.dataService.execute<
			FindOrganisationBySchemaIdQuery,
			FindOrganisationBySchemaIdQueryVariables
		>(FindOrganisationBySchemaIdDocument, { schemaIdentifier });

		if (isNil(organisationResponse) || !organisationResponse.maintainer_organisation[0]) {
			return null;
		}

		return this.adapt(organisationResponse.maintainer_organisation[0] as GqlOrganisation);
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
			sector: gqlOrganisation?.haorg_organization_type,
			formUrl: gqlOrganisation?.form_url,
		};
	}

	public async updateOrganisationsCache() {
		let url;

		try {
			url = this.configService.get('ORGANIZATIONS_API_V2_URL');

			const queryBody = {
				query: `query contentpartners {
  contentpartners {
    id
    label
    description
    sector
    form_url
    homepage
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
			if ((orgResponse?.data?.contentpartners?.length || 0) > 50) {
				await this.emptyOrganizations();
				await this.insertOrganizations(orgResponse?.data.contentpartners);
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
		const parsedOrganizations: ParsedOrganisation[] = organizations.map(
			(organization: OrganisationInfoV2) => ({
				schema_identifier: organization?.id,
				schema_name: organization?.label,
				description: organization.description,
				logo: organization?.logo,
				contact_point: organization.contact_point,
				primary_site: organization.primary_site,
				// Remark here organization is with Z
				haorg_organization_type: organization?.sector || null,
				form_url: organization?.form_url || null,
				homepage_url: organization?.homepage || null,
			})
		);

		const uniqueOrganisations = uniqBy(parsedOrganizations, 'schema_identifier');
		const fillLogoOrganisations = uniqueOrganisations.map((org) => {
			return {
				...org,
				logo: org.logo || {}, // Hasura v2.6.0 complains about null jsonb values
			};
		});

		try {
			await this.dataService.execute(InsertOrganisationsDocument, {
				organizations: fillLogoOrganisations,
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
}
