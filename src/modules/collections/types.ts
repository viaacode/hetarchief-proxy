export interface Collection {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	is_default: boolean;
	ies?: CollectionObject[];
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
