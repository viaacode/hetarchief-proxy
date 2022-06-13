import {
	Injectable,
	InternalServerErrorException,
	Logger,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { uniqBy } from 'lodash';

import { getConfig } from '~config';

import {
	OrganisationInfoV2,
	OrganisationResponse,
	ParsedOrganisation,
} from '../organisations.types';

import {
	DeleteOrganisationsDocument,
	InsertOrganisationsDocument,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export default class OrganisationsService implements OnApplicationBootstrap {
	private logger: Logger = new Logger(OrganisationsService.name, { timestamp: true });

	constructor(private dataService: DataService, private configService: ConfigService) {}

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

	public async updateOrganisationsCache() {
		let url;

		try {
			url = getConfig(this.configService, 'organizationsApiV2Url');

			const queryBody = {
				query: `query contentpartners {
  contentpartners {
    id
    description
    logo {
      iri
    }
    contact_point {
      contact_type
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
				description: organization.description,
				logo: organization?.logo,
				contact_point: organization.contact_point,
				primary_site: organization.primary_site,
			})
		);

		try {
			await this.dataService.execute(InsertOrganisationsDocument, {
				organizations: uniqBy(parsedOrganizations, 'schema_identifier'),
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
