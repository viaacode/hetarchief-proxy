export interface Collection {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	isDefault: boolean;
	userProfileId: string;
	objects?: IeObject[];
}

export interface GqlCollection {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	is_default: boolean;
	user_profile_id: string;
	ies?: CollectionObjectLink[];
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

export interface CollectionObjectLink {
	created_at: string;
	intellectual_entity: GqlObject;
}

export interface GqlObject {
	schema_name: string;
	schema_creator: any;
	dcterms_available: string;
	schema_thumbnail_url: string;
	dcterms_format: string;
	schema_number_of_pages: any;
	schema_identifier: string;
	// TODO add maintainer once ARC-524 has been resolved
	// schema_maintainer: {
	// 	label: string;
	// }[];
}

export interface IeObject {
	collectionEntryCreatedAt: string;
	creator: any;
	description: string;
	format: string;
	id: string;
	name: string;
	numberOfPages: any;
	termsAvailable: string;
	thumbnailUrl: string;
	// TODO add maintainer once ARC-524 has been resolved
	// maintainer: {
	// 	label: string;
	// }[];
}
