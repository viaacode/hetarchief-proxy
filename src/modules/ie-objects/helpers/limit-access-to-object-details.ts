import { intersection, isEmpty, isNil, pick, union } from 'lodash';

import {
	IE_OBJECT_EXTRA_USER_GROUPS,
	IE_OBJECT_EXTRA_USER_SUB_GROUPS,
	IE_OBJECT_LICENSES_BY_USER_GROUP,
	IE_OBJECT_METADATA_SET_BY_LICENSE,
	IE_OBJECT_PROPS_BY_METADATA_SET,
} from '../ie-objects.conts';
import {
	IeObject,
	IeObjectExtraUserGroupSubType,
	IeObjectExtraUserGroupType,
	IeObjectSector,
} from '../ie-objects.types';

import { getAccessThrough } from './get-access-through';

// figure out what properties the user can see and which should be stripped
export const limitAccessToObjectDetails = (
	ieObject: Partial<IeObject>,
	userInfo: {
		userId: string | null;
		isKeyUser: boolean;
		sector: IeObjectSector | null;
		groupId: string;
		maintainerId: string;
		// folders -> if ie object id is in here then the user has folder access to this visitor space
		accessibleObjectIdsThroughFolders: string[];
		// May only contain FULL ACCESS Visitor space ids
		// full -> if object.maintainerId is in this list than the user has full access to visitor space
		accessibleVisitorSpaceIds: string[];
	}
): Partial<IeObject> => {
	// Step 1 - Determine Licenses
	// ---------------------------------------------------
	let userGroup = isNil(userInfo?.userId)
		? IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.ANONYMOUS]
		: userInfo.groupId;
	const hasFolderAccess = userInfo.accessibleObjectIdsThroughFolders.includes(
		ieObject?.schemaIdentifier
	);
	const hasFullAccess = userInfo.accessibleVisitorSpaceIds.includes(ieObject?.maintainerId);

	// Check if user has visitor space access (own or another)
	// maintainerId === ieObject.maintainerId => own visitor space
	// || accessibleOrIds === ieObject.maintainerId => other accessible visitor space
	if (userInfo?.maintainerId === ieObject?.maintainerId || hasFolderAccess || hasFullAccess) {
		userGroup = `${userGroup}${
			IE_OBJECT_EXTRA_USER_SUB_GROUPS[IeObjectExtraUserGroupSubType.HAS_VISITOR_SPACE]
		}`;
	}

	// Is user key user?
	if (userInfo.isKeyUser) {
		userGroup = `${userGroup}${
			IE_OBJECT_EXTRA_USER_SUB_GROUPS[IeObjectExtraUserGroupSubType.IS_KEY_USER]
		}`;
	}

	// Determine common ground between licenses
	const intersectedLicenses = intersection(
		ieObject.licenses,
		IE_OBJECT_LICENSES_BY_USER_GROUP[userGroup]
	);

	if (isEmpty(intersectedLicenses)) {
		return null;
	}

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
