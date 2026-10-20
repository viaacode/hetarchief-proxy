import { HetArchiefIeObject } from '@viaa/avo2-types';
import type {
	FindFolderByIdQuery,
	FindFolderIeObjectsByFolderIdQuery,
	FindFoldersForUserQuery,
	FindIeObjectBySchemaIdentifierQuery,
	FindIeObjectInFolderQuery,
	InsertFolderMutation,
	UpdateFolderMutation,
} from '~generated/graphql-db-types-hetarchief';

export interface Folder {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	isDefault: boolean;
	/**
	 * Owner of a personal folder. null for organisation folders
	 */
	userProfileId: string | null;
	/**
	 * Organisation that owns an organisation folder (eg: OR-rf5kf25). null for personal folders
	 */
	ownerOrganisationId: string | null;
	duration?: string;
	objects?: Partial<HetArchiefIeObject>[];
	usedForLimitedAccessUntil?: string | null;
}

export type GqlFolderWithIeObjects = FindFoldersForUserQuery['users_folder'][0];

export type GqlFolder =
	| GqlFolderWithIeObjects
	| FindFolderByIdQuery['users_folder'][0]
	| InsertFolderMutation['insert_users_folder']['returning'][0]
	| UpdateFolderMutation['update_users_folder']['returning'][0];

export type GqlCreateFolder = InsertFolderMutation['insert_users_folder']['returning'][0];

export interface GqlUpdateFolder {
	name?: string;
	description?: string;
	is_default?: boolean;
	created_at?: string;
	updated_at?: string;
}

export type FolderObjectLink =
	| FindIeObjectInFolderQuery['users_folder_ie'][0]
	| FindFoldersForUserQuery['users_folder'][0]['intellectualEntities'][0]
	| FindFolderIeObjectsByFolderIdQuery['users_folder_ie'][0];

export type GqlObject = FindIeObjectBySchemaIdentifierQuery['graph_intellectual_entity'][0];

export interface AddObjectsToFoldersResult {
	folderIds: string[];
	/**
	 * The objects that were added (or were already in the folders)
	 */
	objectSchemaIdentifiers: string[];
	/**
	 * The objects that could not be found, these were skipped
	 */
	notFoundSchemaIdentifiers: string[];
	/**
	 * Number of (folder, object) links that did not exist yet
	 */
	addedCount: number;
}

export interface FolderShared {
	status: FolderStatus;
	folderId: string;
	folderName: string;
}

export enum FolderStatus {
	ADDED = 'ADDED',
	ALREADY_OWNER = 'ALREADY_OWNER',
}
