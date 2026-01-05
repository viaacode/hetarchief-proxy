import type { PermissionName } from '@viaa/avo2-types';
import { AvoAuthIdpType } from '@viaa/avo2-types';
import type {
	GetUserByIdentityIdQuery,
	InsertUserMutation,
	UpdateUserProfileMutation,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObjectSector } from '~modules/ie-objects/ie-objects.types';
import type { Locale } from '~shared/types/types';

export type GqlUser =
	| GetUserByIdentityIdQuery['users_profile'][0]
	| InsertUserMutation['insert_users_profile_one']
	| UpdateUserProfileMutation['update_users_profile']['returning']['0'];

export interface User {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	language: Locale;
	acceptedTosAt: string;
	groupId: string;
	groupName: GroupName;
	permissions: PermissionName[];
	idp: AvoAuthIdpType;
	isKeyUser: boolean;
	visitorSpaceSlug?: string;
	sector?: IeObjectSector | null;
	organisationName?: string | null;
	organisationId?: string | null;
	lastAccessAt?: string | null;
	createdAt?: string | null;
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
}

/**
 * @deprecated At some point we would like to get rid of the GroupId enum since it contains uuids and we don't like hardcoding uuids in the code. So prefer GroupName where possible.
 */
export enum GroupId {
	KIOSK_VISITOR = '04150e6e-b779-4125-84e5-6ee6fc580757',
	MEEMOO_ADMIN = '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
	VISITOR = '0213c8d4-f459-45ef-8bbc-96268ab56d01',
	CP_ADMIN = 'c56d95aa-e918-47ca-b102-486c9449fc4a',
}

export const GroupIdToName: Record<GroupId, string> = {
	[GroupId.KIOSK_VISITOR]: 'KIOSK_VISITOR',
	[GroupId.MEEMOO_ADMIN]: 'MEEMOO_ADMIN',
	[GroupId.VISITOR]: 'VISITOR',
	[GroupId.CP_ADMIN]: 'CP_ADMIN',
};

export enum GroupName {
	KIOSK_VISITOR = 'KIOSK_VISITOR',
	MEEMOO_ADMIN = 'MEEMOO_ADMIN',
	VISITOR = 'VISITOR',
	CP_ADMIN = 'CP_ADMIN',
	ANONYMOUS = 'ANONYMOUS',
}
