import type {
	FindFolderByIdQuery,
	FindFolderIeObjectsByFolderIdQuery,
	FindFoldersByUserQuery,
	FindIeObjectBySchemaIdentifierQuery,
	FindIeObjectInFolderQuery,
	InsertFolderMutation,
	UpdateFolderMutation,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObject } from '~modules/ie-objects/ie-objects.types';

export interface Folder {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	isDefault: boolean;
	userProfileId: string;
	duration?: string;
	objects?: Partial<IeObject>[];
	usedForLimitedAccessUntil?: string | null;
}

export type GqlFolderWithIeObjects = FindFoldersByUserQuery['users_folder'][0];

export type GqlFolder =
	| GqlFolderWithIeObjects
	| FindFolderByIdQuery['users_folder'][0]
	| InsertFolderMutation['insert_users_folder']['returning'][0]
	| UpdateFolderMutation['update_users_folder']['returning'][0];

export type GqlCreateFolder = InsertFolderMutation['insert_users_folder']['returning'][0];

export interface GqlUpdateFolder {
	name?: string;
	is_default?: boolean;
	created_at?: string;
	updated_at?: string;
}

export type FolderObjectLink =
	| FindIeObjectInFolderQuery['users_folder_ie'][0]
	| FindFoldersByUserQuery['users_folder'][0]['intellectualEntities'][0]
	| FindFolderIeObjectsByFolderIdQuery['users_folder_ie'][0];

export type GqlObject = FindIeObjectBySchemaIdentifierQuery['graph_intellectual_entity'][0];

export interface FolderShared {
	status: FolderStatus;
	folderId: string;
	folderName: string;
}

export enum FolderStatus {
	ADDED = 'ADDED',
	ALREADY_OWNER = 'ALREADY_OWNER',
}
