import { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

export interface OrganisationInfoV2 {
	id: string;
	description: string;
	sector: string;
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
		contentpartners: OrganisationInfoV2[];
	};
}

export interface ParsedOrganisation {
	schema_identifier: string;
	contact_point: {
		contact_type: string;
		email: string;
	}[];
	description: string;
	sector: string;
	logo: {
		iri: string;
	};
	primary_site: {
		address: {
			locality: string;
			postal_code: string;
			street: string;
			telephone: string;
			post_office_box_number: string;
		};
	};
}

export interface GqlOrganisation {
	schema_identifier: string;
	contact_point: {
		contact_type: string;
		email: string;
	}[];
	logo: {
		iri: string;
	};
	primary_site: {
		address: {
			locality: string;
			postal_code: string;
			street: string;
			telephone: string;
			post_office_box_number: string;
		};
	};
	created_at?: string;
	updated_at?: string;
	schema_name?: string | null;
	description?: string;
	sector?: IeObjectSector | null;
}

export interface Organisation {
	schemaIdentifier: string;
	contactPoint: OrganisationContactPoint[];
	description: string;
	logo: {
		iri: string;
	};
	primarySite: OrganisationPrimarySite;
	schemaName: string;
	createdAt: string;
	updatedAt: string;
	sector: IeObjectSector | null;
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
