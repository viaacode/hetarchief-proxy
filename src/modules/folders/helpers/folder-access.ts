import { PermissionName } from '@viaa/avo2-types';
import type { Users_Folder_Bool_Exp } from '~generated/graphql-db-types-hetarchief';
import type { SessionUserEntity } from '~modules/users/classes/session-user';
import type { Folder } from '../types';

/**
 * Returns the organisation id whose organisation folders this user can see and manage,
 * or null if the user is not allowed to manage organisation folders
 */
export function getFolderOrganisationId(user: SessionUserEntity | null | undefined): string | null {
	if (!user?.has(PermissionName.MANAGE_ORGANISATION_FOLDERS)) {
		return null;
	}
	return user.getOrganisationId() || null;
}

/**
 * Checks if the user can read and write a folder:
 * - personal folders: only the owner
 * - organisation folders: all users of that organisation with the MANAGE_ORGANISATION_FOLDERS permission
 */
export function canWriteToFolder(
	folder: Pick<Folder, 'userProfileId' | 'ownerOrganisationId'> | null | undefined,
	user: SessionUserEntity | null | undefined
): boolean {
	if (!folder || !user?.getId()) {
		return false;
	}
	// Organisation folders have userProfileId === null, so both branches can never match
	if (folder.ownerOrganisationId) {
		return folder.ownerOrganisationId === getFolderOrganisationId(user);
	}
	return !!folder.userProfileId && folder.userProfileId === user.getId();
}

/**
 * Hasura filter that matches the folders the user can access
 * Built in code instead of in the graphql query, since hasura ignores conditions with a null value (_eq: null),
 * which would match all folders if the user has no organisation
 */
export function getFolderOwnerFilter(
	userProfileId: string,
	organisationId: string | null
): Users_Folder_Bool_Exp {
	if (!userProfileId) {
		throw new Error('A user profile id is required to filter folders');
	}
	const ownerFilters: Users_Folder_Bool_Exp[] = [{ user_profile_id: { _eq: userProfileId } }];
	if (organisationId) {
		ownerFilters.push({ owner_organisation_id: { _eq: organisationId } });
	}
	return { _or: ownerFilters };
}
