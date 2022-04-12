import { DocumentNode } from 'graphql';

import { GetOrganisationQuery as GetOrganisationQueryAvo } from '~generated/graphql-db-types-avo';
import { GetOrganisationQuery as GetOrganisationQueryHetArchief } from '~generated/graphql-db-types-hetarchief';

export interface Organisation {
	id: string;
	name: string;
	logo_url?: string;
}

export type OrganisationQueries = {
	GetOrganisationDocument: DocumentNode;
};

export type GqlAvoOrganisation = GetOrganisationQueryAvo['shared_organisations'][0];
export type GqlHetArchiefOrganisation =
	GetOrganisationQueryHetArchief['maintainer_content_partner'][0];
export type GqlOrganisation = GqlAvoOrganisation | GqlHetArchiefOrganisation;
