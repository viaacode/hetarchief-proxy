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

export type GqlOrganisation =
	| GetOrganisationQueryAvo['shared_organisations'][0]
	| GetOrganisationQueryHetArchief['cp_maintainer'][0];