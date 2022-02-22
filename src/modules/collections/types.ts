export interface Collection {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	is_default: boolean;
	user_profile_id: string;
	ies?: CollectionObject[];
}

export interface GqlCreateCollection {
	name: string;
	is_default: boolean;
	user_profile_id: string;
	created_at?: string;
	updated_at?: string;
	id?: string;
}

export interface GqlUpdateCollection {
	name?: string;
	is_default?: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface CollectionObject {
	created_ay: string;
	intellectual_entity: IeObject;
}

export interface IeObject {
	schema_name: string;
	schema_creator: any;
	dcterms_available: string;
	schema_thumbnail_url: string;
	dcterms_format: string;
	schema_number_of_pages: any;
	schema_maintainer: {
		label: string;
	}[];
}
