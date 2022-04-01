import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';

import { ORGANISATION_QUERIES } from '~modules/admin/organisations/organisations.consts';
import {
	GqlOrganisation,
	Organisation,
	OrganisationQueries,
} from '~modules/admin/organisations/organisations.types';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class OrganisationsService {
	private logger: Logger = new Logger(OrganisationsService.name, { timestamp: true });
	private queries: OrganisationQueries;

	constructor(private configService: ConfigService, protected dataService: DataService) {
		this.queries = ORGANISATION_QUERIES[this.configService.get('avoOrHetArchief')];
	}

	public adapt(gqlOrganisation: GqlOrganisation): Organisation {
		if (!gqlOrganisation) {
			return null;
		}
		return {
			id: get(gqlOrganisation, 'schema_identifier') || get(gqlOrganisation, 'or_id'),
			name: get(gqlOrganisation, 'schema_name') || get(gqlOrganisation, 'name'),
			logo_url:
				get(gqlOrganisation, 'information.logo.iri') || get(gqlOrganisation, 'logo_url'),
		};
	}

	public async getOrganisation(id: string): Promise<Organisation> {
		const response = await this.dataService.execute(this.queries.GetOrganisationDocument, {
			id,
		});
		return this.adapt(
			get(response, 'data.cp_maintainer[0]') || get(response, 'data.shared_organisations[0]')
		);
	}
}
