import { GetOrganisationDocument as GetOrganisationDocumentAvo } from '~generated/graphql-db-types-avo';
import { GetOrganisationDocument as GetOrganisationDocumentHetArchief } from '~generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';
import { OrganisationQueries } from '~modules/admin/organisations/admin-organisations.types';

export const ORGANISATION_QUERIES: Record<AvoOrHetArchief, OrganisationQueries> = {
	[AvoOrHetArchief.avo]: {
		GetOrganisationDocument: GetOrganisationDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetOrganisationDocument: GetOrganisationDocumentHetArchief,
	},
};
