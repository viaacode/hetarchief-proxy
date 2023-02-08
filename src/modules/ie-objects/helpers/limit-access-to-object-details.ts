import { difference, intersection, isEmpty, isNil, pick, union } from 'lodash';

import { Group } from '../../users/types';
import {
	IE_OBJECT_EXTRA_USER_GROUPS,
	IE_OBJECT_LICENSES_BY_USER_GROUP,
	IE_OBJECT_METADATA_SET_BY_LICENSE,
	IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR,
	IE_OBJECT_PROPS_BY_METADATA_SET,
} from '../ie-objects.conts';
import {
	IeObject,
	IeObjectAccessThrough,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectSector,
} from '../ie-objects.types';

import { getAccessThrough } from './get-access-through';

import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum as AccessType } from '~generated/graphql-db-types-hetarchief';

// figure out what properties the user can see and which should be stripped
export const limitAccessToObjectDetails = (
	ieObject: Partial<IeObject>,
	userInfo: {
		userId: string | null;
		isKeyUser: boolean;
		sector: IeObjectSector | null; // sector
		groupId: string;
		maintainerId: string;
		accessibleObjectIdsThroughFolders: string[]; // folders -> als het ie object id hierin voorkomt dan is het visitor space folders
		// MAG enkel full access bevatten
		accessibleVisitorSpaceIds: string[]; // full -> als object.maintainerId in deze lijst voorkomt dan is het viistor space full
	}
): Partial<IeObject> => {
	// Step 1 - Determine Licenses
	// ---------------------------------------------------
	let userGroup = isNil(userInfo?.userId)
		? IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.ANONYMOUS]
		: userInfo.groupId;

	// Check if user has visitor space access (own or another)
	// maintainerId === ieObject.maintainerId => own visitor space
	// || accessibleOrIds === ieObject.maintainerId => other accessible visitor space
	const hasFolderAccess = userInfo.accessibleObjectIdsThroughFolders.includes(
		ieObject?.schemaIdentifier
	);
	const hasFullAccess = userInfo.accessibleVisitorSpaceIds.includes(ieObject?.maintainerId);
	if (userInfo?.maintainerId === ieObject?.maintainerId || hasFolderAccess || hasFullAccess) {
		userGroup = `${userGroup}${
			IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.HAS_VISITOR_SPACE]
		}`;
	}

	// Is user key user?
	if (userInfo.isKeyUser) {
		userGroup = `${userGroup}${
			IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.IS_KEY_USER]
		}`;
	}

	// Determine common ground between licenses
	const intersectedLicenses = intersection(
		ieObject.licenses,
		IE_OBJECT_LICENSES_BY_USER_GROUP[userGroup]
	);

	// TODO: (ARC-1361) - Sector as extra filter on INTRA_CP_CONTENT
	// ---------------------------------------------------
	// if (intersectedLicenses.includes(IeObjectLicense.INTRA_CP_CONTENT)) {
	// 	const licensesBySector = (IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR.get(ieObject.sector)).get(userInfo.sector);

	// 	if (isEmpty(licensesBySector)) {
	// 		intersectedLicenses = difference(
	// 			intersectedLicenses,
	// 			[IeObjectLicense.INTRA_CP_CONTENT, IeObjectLicense.INTRA_CP_METADATA_ALL]
	// 		);
	// 	}
	// }

	// Step 2 - Determine ieObject limited props
	// ---------------------------------------------------
	let ieObjectLimitedProps = [];
	for (const license of intersectedLicenses) {
		ieObjectLimitedProps.push(
			IE_OBJECT_PROPS_BY_METADATA_SET[IE_OBJECT_METADATA_SET_BY_LICENSE[license]]
		);
	}
	ieObjectLimitedProps = union(...ieObjectLimitedProps);

	// Step 3 - Return ie object with limited access props
	// ---------------------------------------------------
	const limitedIeObject = pick(ieObject, ieObjectLimitedProps);

	// Determine access through
	const accessThrough = getAccessThrough(hasFolderAccess, hasFullAccess, !isNil(userInfo.sector));

	return {
		...limitedIeObject,
		accessThrough,
	};
};
