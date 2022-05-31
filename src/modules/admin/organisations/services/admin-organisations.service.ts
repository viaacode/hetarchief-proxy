import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConfig } from '~config';

import { GetOrganisationQuery as GetOrganisationQueryAvo } from '~generated/graphql-db-types-avo';
import { GetOrganisationQuery as GetOrganisationQueryHetArchief } from '~generated/graphql-db-types-hetarchief';
import { ORGANISATION_QUERIES } from '~modules/admin/organisations/admin-organisations.consts';
import {
	GqlAvoOrganisation,
	GqlHetArchiefOrganisation,
	GqlOrganisation,
	Organisation,
	OrganisationQueries,
} from '~modules/admin/organisations/admin-organisations.types';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class AdminOrganisationsService {
	private logger: Logger = new Logger(AdminOrganisationsService.name, { timestamp: true });
	private queries: OrganisationQueries;

	constructor(
		private configService: ConfigService,
		@Inject(forwardRef(() => DataService)) protected dataService: DataService
	) {
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
			logo_url: hetArchiefOrganisation?.information?.logo?.iri || avoOrganisation?.logo_url,
		};
	}

	public async getOrganisation(id: string): Promise<Organisation> {
		const response = await this.dataService.execute<
			GetOrganisationQueryAvo | GetOrganisationQueryHetArchief
		>(this.queries.GetOrganisationDocument, {
			id,
		});

		/* istanbul ignore next */
		return this.adapt(
			(response?.data as GetOrganisationQueryHetArchief)?.maintainer_content_partner?.[0] ||
				(response?.data as GetOrganisationQueryAvo)?.shared_organisations?.[0]
		);
	}
}
