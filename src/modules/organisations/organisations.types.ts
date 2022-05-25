export interface OrganisationInfoV2 {
	id: string;
	description: string;
	logo: {
		iri: string;
	};
	contact_point: {
		contact_type: string;
		email: string;
	}[];
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

export interface OrganisationResponse {
	status: string;
	description: string;
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
