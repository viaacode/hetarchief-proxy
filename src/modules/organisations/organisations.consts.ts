import { OrganisationSlug } from '~modules/organisations/organisations.types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof OrganisationSlug, string>> = {
	org_identifier: 'org_identifier',
	name: 'organisation.skos_pref_label',
	slug: 'slug',
};
