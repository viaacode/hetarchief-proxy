import { intersection, isEmpty, isNil, pick, union, uniq } from 'lodash';

import {
	IE_OBJECT_EXTRA_USER_GROUPS,
	IE_OBJECT_INTRA_CP_LICENSES,
	IE_OBJECT_LICENSES_BY_USER_GROUP,
	IE_OBJECT_METADATA_SET_BY_LICENSE,
	IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR,
	IE_OBJECT_PROPS_BY_METADATA_SET,
	IE_OBJECT_PUBLIC_LICENSES,
	IE_OBJECT_VISITOR_LICENSES,
} from '../ie-objects.conts';
import {
	IeObject,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectSector,
} from '../ie-objects.types';

import { getAccessThrough } from './get-access-through';

import { Group } from '~modules/users/types';

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
	let ieObjectLicenses: IeObjectLicense[] = [...ieObject.licenses];

	const objectIntraCpLicenses = intersection(ieObjectLicenses, IE_OBJECT_INTRA_CP_LICENSES);
	const objectPublicLicenses = intersection(ieObjectLicenses, IE_OBJECT_PUBLIC_LICENSES);
	const hasFolderAccess = userInfo.accessibleObjectIdsThroughFolders.includes(
		ieObject?.schemaIdentifier
	);
	const hasFullAccess = userInfo.accessibleVisitorSpaceIds.includes(ieObject?.maintainerId);

	// Step 1a - Determine Licenses
	// ---------------------------------------------------

	// If the ie object exposes its metadata then we add an extra licenses to more easily check sector licenses
	if (
		ieObjectLicenses.includes(IeObjectLicense.INTRA_CP_METADATA_ALL) ||
		ieObjectLicenses.includes(IeObjectLicense.INTRA_CP_CONTENT)
	) {
		ieObjectLicenses.push(IeObjectLicense.INTRA_CP_METADATA_LTD);
	}

	// Check if user
	// - has visitor space access through own, full or folder
	// - maintainerId === ieObject.maintainerId => own visitor space
	// - accessibleOrIds === ieObject.maintainerId => other accessible visitor space
	if (ieObject?.maintainerId === userInfo.maintainerId || hasFolderAccess || hasFullAccess) {
		ieObjectLicenses.push(...IE_OBJECT_VISITOR_LICENSES);
	}

	// Step 1b - Sector as extra filter on INTRA_CP_CONTENT, INTRA_CP_METADATA OR BOTH
	// ---------------------------------------------------

	// If user is part of CP, MEEMOO or VISITOR user groups AND
	// user has a sector AND
	// ie object has a sector AND
	// user is key user AND
	// ie object has INTRA CP licenses AND
	if (
		[Group.CP_ADMIN, Group.MEEMOO_ADMIN, Group.VISITOR].includes(userInfo.groupId as Group) &&
		userInfo?.sector &&
		ieObject?.sector &&
		userInfo?.isKeyUser &&
		!isEmpty(objectIntraCpLicenses)
	) {
		// User from sector X can view an ieObject with sector Y
		const licensesBySector =
			IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR[userInfo.sector][ieObject.sector];

		// Check if ie object licenses includes PUBLIC METADATA ALL AND
		// Check if licenses by sector does not include PUBLIC METADATA ALL
		// Add PUBLIC METADATA ALL to licenses by sector if the above is true
		if (
			ieObjectLicenses.includes(IeObjectLicense.PUBLIEK_METADATA_ALL) &&
			!licensesBySector.includes(IeObjectLicense.PUBLIEK_METADATA_ALL)
		) {
			licensesBySector.push(IeObjectLicense.PUBLIEK_METADATA_ALL);
		}

		// Check to see of if user is checking its own content
		if (
			userInfo.sector === IeObjectSector.RURAL &&
			ieObject.sector === IeObjectSector.RURAL &&
			hasFullAccess
		) {
			licensesBySector.push(IeObjectLicense.INTRA_CP_CONTENT);
		}

		ieObjectLicenses = intersection(ieObjectLicenses, licensesBySector);
	} else {
		// Determine userGroup based on presence of userId
		const userGroup = isNil(userInfo?.userId)
			? IE_OBJECT_EXTRA_USER_GROUPS[IeObjectExtraUserGroupType.ANONYMOUS]
			: userInfo.groupId;

		// If user is part of KIOSK && does not have full or folder access -> return null = user should not see object
		if (userInfo.groupId === Group.KIOSK_VISITOR && (!hasFullAccess || !hasFolderAccess)) {
			return null;
		}

		// If user is part of VISITOR && has folder access -> add visitor metadata license to licenses
		if (userInfo.groupId === Group.VISITOR && hasFolderAccess) {
			IE_OBJECT_LICENSES_BY_USER_GROUP[userGroup].push(
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL
			);
		}

		// If user is part of VISITOR && has full access -> add visitor content license to licenses
		if (userInfo.groupId === Group.VISITOR && hasFullAccess) {
			IE_OBJECT_LICENSES_BY_USER_GROUP[userGroup].push(IeObjectLicense.BEZOEKERTOOL_CONTENT);
		}

		// Determine common ground between ie object licenses and user group licenses
		ieObjectLicenses = intersection(
			ieObjectLicenses,
			IE_OBJECT_LICENSES_BY_USER_GROUP[userGroup]
		);
	}

	// Step 2 - Determine ieObject limited props
	// ---------------------------------------------------
	if (isEmpty(ieObjectLicenses)) {
		return null;
	}

	const ieObjectLimitedProps: string[] = uniq(
		ieObjectLicenses.flatMap((license: IeObjectLicense) => {
			return IE_OBJECT_PROPS_BY_METADATA_SET[IE_OBJECT_METADATA_SET_BY_LICENSE[license]];
		})
	);

	// Step 3 - Return ie object with limited access props
	// ---------------------------------------------------
	const limitedIeObject = pick(ieObject, ieObjectLimitedProps);

	// Determine access through
	const accessThrough = getAccessThrough(
		hasFullAccess,
		hasFolderAccess,
		!isEmpty(objectIntraCpLicenses),
		!isEmpty(objectPublicLicenses)
	);

	return {
		...limitedIeObject,
		accessThrough,
	};
};
