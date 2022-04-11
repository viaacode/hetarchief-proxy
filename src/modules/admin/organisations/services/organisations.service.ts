import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';

import { getConfig } from '~config';

import { GetOrganisationQuery as GetOrganisationQueryHetArchief } from 'dist/generated/graphql-db-types-hetarchief';
import { GetOrganisationQuery as GetOrganisationQueryAvo } from '~generated/graphql-db-types-avo';
import { ORGANISATION_QUERIES } from '~modules/admin/organisations/organisations.consts';
import {
	GqlAvoOrganisation,
	GqlHetArchiefOrganisation,
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
		this.queries =
			ORGANISATION_QUERIES[getConfig(this.configService, 'databaseApplicationType')];
	}

	public adapt(gqlOrganisation: GqlOrganisation): Organisation {
		if (!gqlOrganisation) {
			return null;
		}
		const avoOrganisation = gqlOrganisation as GqlAvoOrganisation;
		const hetArchiefOrganisation = gqlOrganisation as GqlHetArchiefOrganisation;

		/* istanbul ignore next */
		return {
			id: hetArchiefOrganisation?.schema_identifier || avoOrganisation?.or_id,
			name: hetArchiefOrganisation?.schema_name || avoOrganisation?.name,
			logo_url:
				hetArchiefOrganisation?.information?.[0]?.logo?.iri || avoOrganisation?.logo_url,
		};
	}

	public async getOrganisation(id: string): Promise<Organisation> {
		const response = await this.dataService.execute<
			GetOrganisationQueryAvo | GetOrganisationQueryHetArchief
		>(this.queries.GetOrganisationDocument, {
			id,
		});
		return this.adapt(
			(response?.data as GetOrganisationQueryHetArchief)?.maintainer_content_partner?.[0] ||
				(response?.data as GetOrganisationQueryAvo)?.shared_organisations?.[0]
		);
	}
}
