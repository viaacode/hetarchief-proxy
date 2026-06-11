import {
	FindOrganisationsBySchemaIdsQuery,
	FindOrganisationSlugsQuery,
	GetOrganisationBySlugQuery,
	UpdateOrganisationSlugMutation,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

export enum OrganisationPreference {
	logoEmbedding = 'logo-embedding',
	iiifDissemination = 'iiif-dissemination',
	visitorSpacePublication = 'visitor-space-publication',
}

/**
 * Postal address has it's source in the ldap database and is in English
 */
export enum PostalAddressType {
	delivery = 'delivery',
	invoicing = 'invoicing',
	primary = 'primary',
}

/**
 * Contact point type is stored in Teamleader and is in Dutch
 */
export enum ContactPointType {
	facturatie = 'facturatie',
	ontsluiting = 'ontsluiting',
	primary = 'primary',
}

export interface OrganisationInfoV2 {
	id: string;
	label?: string | null;
	description: string | null;
	sector: IeObjectSector | null;
	slug: string | null;
	form_url: string | null;
	homepage: string | null;
	overlay: boolean;
	logo: {
		iri: string;
	};
	contact_point: {
		contact_type: ContactPointType;
		email: string | null;
		telephone: string | null;
	}[];
	primary_site: {
		address: {
			locality: string;
			postal_code: string;
			street: string;
			telephone: string | null;
			email: string | null;
			post_office_box_number: string;
		};
	};
}

export type GqlOrganisation = GetOrganisationBySlugQuery['graph_organization'][0] &
	FindOrganisationsBySchemaIdsQuery['graph_organization'][0];

export interface Organisation {
	schemaIdentifier: string;
	contactPoint: OrganisationContactPoint[];
	description: string;
	logo: string | null;
	slug: string | null;
	// primarySite: OrganisationPrimarySite;
	schemaName: string;
	createdAt: string;
	updatedAt: string;
	sector: IeObjectSector | null;
	formUrl: string | null;
	/**
	 * VAT number eg: 'BE 0244.142.664'
	 */
	vatNumber: string | null;
	/**
	 * First address line eg: 'Auguste Reyerslaan 52'
	 */
	streetAddress: string | null;
	/**
	 * Postal code eg: '1043'
	 */
	postalCode: string | null;
	/**
	 * City/village corresponding with the postal code eg: 'Brussel'
	 */
	addressLocality: string | null;
}

export interface OrganisationContactPoint {
	contactType: string;
	email: string;
}

export interface MaintainerGridOrganisation {
	id: string;
	name: string;
	logoUrl: string;
	homepageUrl: string;
	slug: string;
}

export interface OrganisationSlug {
	org_identifier: string;
	name: string;
	slug: string;
}

export enum OrganisationSlugOrderProp {
	ORG_IDENTIFIER = 'org_identifier',
	SLUG = 'slug',
	NAME = 'name',
}

export type GqlOrganisationSlug =
	| FindOrganisationSlugsQuery['maintainer_organization_slug'][0]
	| UpdateOrganisationSlugMutation['update_maintainer_organization_slug']['returning'][0];
