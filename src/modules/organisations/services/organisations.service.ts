import {
	Injectable,
	InternalServerErrorException,
	Logger,
	OnApplicationBootstrap,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { uniqBy } from 'lodash';
import cron from 'node-cron';

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

	constructor(private dataService: DataService) {}

	public async onApplicationBootstrap() {
		// For now you can manually trigger a refresh of the cache using /organisations/update-cache with the proxy api key
		try {
			this.logger.log('caching organizations...');

			await this.updateOrganisationsCache();

			// Register a cron job to refresh the organizations every night
			if (process.env.NODE_ENV !== 'test') {
				/* istanbul ignore next */
				cron.schedule('0 0 04 * * *', async () => {
					await this.updateOrganisationsCache();
				}).start();
			}

			this.logger.log('caching organizations... done');
		} catch (err) {
			this.logger.log('caching organizations... error');

			/* istanbul ignore next */
			this.logger.error(
				new InternalServerErrorException({
					message:
						'Failed to fill initial organizations cache or schedule cron job to renew the cache',
					innerException: err,
				})
			);
		}
	}

	public async updateOrganisationsCache() {
		let url;

		try {
			url = process.env.ORGANIZATIONS_API_V2_URL;

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
			const orgResponse: AxiosResponse<OrganisationResponse> = await axios({
				url,
				method: 'post',
				data: JSON.stringify(queryBody),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Handle response
			if (
				orgResponse.status >= 200 &&
				orgResponse.status < 400 &&
				(orgResponse?.data?.data?.contentpartners?.length || 0) > 50
			) {
				await this.emptyOrganizations();
				await this.insertOrganizations(orgResponse.data.data.contentpartners);
			} else {
				/* istanbul ignore next */
				throw new InternalServerErrorException({
					message: 'Request to organizations api was unsuccessful',
					innerException: null,
					additionalInfo: {
						url,
						method: 'get',
						status: orgResponse.status,
						statusText: orgResponse.statusText,
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
