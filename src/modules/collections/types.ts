import {
	FindCollectionByIdQuery,
	FindCollectionObjectsByCollectionIdQuery,
	FindCollectionsByUserQuery,
	FindObjectBySchemaIdentifierQuery,
	FindObjectInCollectionQuery,
	InsertCollectionsMutation,
	InsertObjectIntoCollectionMutation,
	UpdateCollectionMutation,
} from '~generated/graphql-db-types-hetarchief';
import { IeObject } from '~modules/ie-objects/ie-objects.types';

export interface Collection {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	isDefault: boolean;
	userProfileId: string;
	duration?: string;
	objects?: Partial<IeObject>[];
	usedForLimitedAccessUntil?: string | null;
}

export type GqlCollectionWithObjects = FindCollectionsByUserQuery['users_folder'][0];

export type GqlCollection =
	| GqlCollectionWithObjects
	| FindCollectionByIdQuery['users_folder'][0]
	| InsertCollectionsMutation['insert_users_folder']['returning'][0]
	| UpdateCollectionMutation['update_users_folder']['returning'][0];

export type GqlCreateCollection = InsertCollectionsMutation['insert_users_folder']['returning'][0];

export interface GqlUpdateCollection {
	name?: string;
	is_default?: boolean;
	created_at?: string;
	updated_at?: string;
}

export type CollectionObjectLink =
	| FindObjectInCollectionQuery['users_folder_ie'][0]
	| FindCollectionsByUserQuery['users_folder'][0]['ies'][0]
	| InsertObjectIntoCollectionMutation['insert_users_folder_ie']['returning'][0]
	| FindCollectionObjectsByCollectionIdQuery['users_folder_ie'][0];

export type GqlObject = FindObjectBySchemaIdentifierQuery['object_ie'][0];

export enum CollectionStatus {
	ADDED = 'ADDED',
	ALREADY_OWNED = 'ALREADY_OWNED',
}
