import {
	FindCollectionByIdQuery,
	FindCollectionObjectsByCollectionIdQuery,
	FindCollectionsByUserQuery,
	FindObjectBySchemaIdentifierQuery,
	FindObjectInCollectionQuery,
	InsertCollectionsMutation,
	InsertObjectIntoCollectionMutation,
	UpdateCollectionMutation,
} from '../../generated/graphql';

export interface Collection {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	isDefault: boolean;
	userProfileId: string;
	objects?: IeObject[];
}

export type GqlCollectionWithObjects = FindCollectionsByUserQuery['users_collection'][0];

export type GqlCollection =
	| GqlCollectionWithObjects
	| FindCollectionByIdQuery['users_collection'][0]
	| InsertCollectionsMutation['insert_users_collection']['returning'][0]
	| UpdateCollectionMutation['update_users_collection']['returning'][0];

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

export type CollectionObjectLink =
	| FindObjectInCollectionQuery['users_collection_ie'][0]
	| FindCollectionsByUserQuery['users_collection'][0]['ies'][0]
	| InsertObjectIntoCollectionMutation['insert_users_collection_ie']
	| FindCollectionObjectsByCollectionIdQuery['users_collection_ie'][0];

export type GqlObject = FindObjectBySchemaIdentifierQuery['object_ie'][0];

export interface IeObject {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID: not unique per object
	collectionEntryCreatedAt?: string;
	creator: any;
	description: string;
	format: string;
	name: string;
	numberOfPages: any;
	termsAvailable: string;
	thumbnailUrl: string;
	maintainerId: string;
	maintainerName: string;
	readingRoomId: string;
	series: string[];
	programs: string[];
	datePublished?: string;
	dateCreatedLowerBound?: string;
}
