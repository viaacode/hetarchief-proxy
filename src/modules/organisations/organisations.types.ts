import {
	type FindOrganisationsBySchemaIdsQuery,
	type GetOrganisationBySlugQuery,
} from '~generated/graphql-db-types-hetarchief';
import { type IeObjectSector } from '~modules/ie-objects/ie-objects.types';

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

export interface ParsedOrganisation {
	schema_identifier: string;
	contact_point: {
		contact_type?: string;
		email?: string;
	}[];
	schema_name: string;
	description: string;
	// Remark here organization is with Z
	haorg_organization_type: string;
	form_url: string | null;
	homepage_url: string | null;
	slug: string | null;
	overlay: boolean;
	logo: {
		iri?: string;
	};
	primary_site: {
		address?: {
			locality: string;
			postal_code: string;
			street: string;
			telephone: string;
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
}

export interface OrganisationContactPoint {
	contactType: string;
	email: string;
}

export interface OrganisationPrimarySite {
	address: OrganisationPrimarySiteAddress;
}

export interface OrganisationPrimarySiteAddress {
	locality: string;
	postal_code: string;
	street: string;
	telephone: string;
	post_office_box_number: string;
}

export interface MaintainerGridOrganisation {
	id: string;
	name: string;
	logoUrl: string;
	homepageUrl: string;
	slug: string;
}
