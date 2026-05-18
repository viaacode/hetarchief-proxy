import {
	FindOrganisationSlugsQuery,
	FindOrganisationsBySchemaIdsQuery,
	GetOrganisationBySlugQuery,
	UpdateOrganisationSlugMutation,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

export enum OrganisationPreference {
	logoEmbedding = 'logo-embedding',
	iiifDissemination = 'iiif-dissemination',
	visitorSpacePublication = 'visitor-space-publication',
}

export enum OrganisationContactPointType {
	ontsluiting = 'ontsluiting',
	primary = 'primary',
	facturatie = 'facturatie',
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
		contact_type: string;
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

export interface OrganisationResponse {
	data: {
		meemoo: OrganisationInfoV2[];
		contentPartners: OrganisationInfoV2[];
		educationalPartner: OrganisationInfoV2[];
		serviceProviders: OrganisationInfoV2[];
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
	vatNumber: string | null;
	streetAddress: string | null;
	postalCode: string | null;
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
