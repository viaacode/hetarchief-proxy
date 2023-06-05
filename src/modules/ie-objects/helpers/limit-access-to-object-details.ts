import { intersection, isEmpty, pick, uniq } from 'lodash';

import {
	IE_OBJECT_INTRA_CP_LICENSES,
	IE_OBJECT_LICENSES_BY_USER_GROUP,
	IE_OBJECT_METADATA_SET_BY_LICENSE,
	IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR,
	IE_OBJECT_PROPS_BY_METADATA_SET,
	IE_OBJECT_PUBLIC_LICENSES,
} from '../ie-objects.conts';
import {
	IeObject,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectSector,
} from '../ie-objects.types';

import { getAccessThrough } from './get-access-through';

import { LimitAccessUserInfo } from '~modules/ie-objects/helpers/limit-access-to-object-details.types';
import { GroupId } from '~modules/users/types';

// figure out what properties the user can see and which should be stripped
export const limitAccessToObjectDetails = (
	ieObject: Partial<IeObject>,
	userInfo: LimitAccessUserInfo
): Partial<IeObject> => {
	const licensesByUserGroup = [
		...(IE_OBJECT_LICENSES_BY_USER_GROUP[
			userInfo.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
		] ?? []),
	];
	const ieObjectLicenses: IeObjectLicense[] = [...(ieObject.licenses || [])];

	let accessibleLicenses: IeObjectLicense[] = [];

	const objectIntraCpLicenses = intersection(ieObjectLicenses, IE_OBJECT_INTRA_CP_LICENSES);
	const hasFolderAccess = userInfo.accessibleObjectIdsThroughFolders.includes(
		ieObject?.schemaIdentifier
	);
	const hasFullAccess = userInfo.accessibleVisitorSpaceIds.includes(ieObject?.maintainerId);

	// Step 1a - Determine Licenses
	// ---------------------------------------------------

	// If the ie object exposes a wider license, then we also add the stricter licences to make the checks below easier
	if (ieObjectLicenses.includes(IeObjectLicense.INTRA_CP_CONTENT)) {
		ieObjectLicenses.push(IeObjectLicense.INTRA_CP_METADATA_ALL);
	}
	if (ieObjectLicenses.includes(IeObjectLicense.INTRA_CP_METADATA_ALL)) {
		ieObjectLicenses.push(IeObjectLicense.INTRA_CP_METADATA_LTD);
	}
	if (ieObjectLicenses.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT)) {
		ieObjectLicenses.push(IeObjectLicense.BEZOEKERTOOL_METADATA_ALL);
	}
	if (ieObjectLicenses.includes(IeObjectLicense.PUBLIEK_METADATA_ALL)) {
		ieObjectLicenses.push(IeObjectLicense.PUBLIEK_METADATA_LTD);
	}

	// public licenses can be accessed if the object has public licenses
	// Kiosk users can only see objects from the maintainer they are linked to
	// Test case 6: https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	if (
		userInfo.groupId !== GroupId.KIOSK_VISITOR ||
		ieObject.maintainerId === userInfo.maintainerId
	) {
		accessibleLicenses.push(...intersection(ieObjectLicenses, IE_OBJECT_PUBLIC_LICENSES));
	}

	// Step 1b - Sector as extra filter on INTRA_CP_CONTENT, INTRA_CP_METADATA OR BOTH
	// ---------------------------------------------------

	// If user is part of CP, MEEMOO or VISITOR user groups AND
	// user has a sector AND
	// ie object has a sector AND
	// user is key user AND
	// ie object has INTRA CP licenses AND
	if (
		[GroupId.CP_ADMIN, GroupId.MEEMOO_ADMIN, GroupId.VISITOR].includes(
			userInfo.groupId as GroupId
		) &&
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

		// Determine common ground between ie object licenses and user group licenses
		accessibleLicenses.push(...licensesBySector);
	}
	// If user is part of VISITOR && has folder access -> add visitor metadata license to licenses
	// If user is part of VISITOR && has full access -> add visitor content license to licenses
	if (hasFolderAccess || hasFullAccess) {
		licensesByUserGroup.push(
			IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			IeObjectLicense.BEZOEKERTOOL_CONTENT
		);

		// Determine common ground between ie object licenses and user group licenses
		accessibleLicenses.push(...licensesByUserGroup);
	}

	accessibleLicenses = uniq(intersection(ieObjectLicenses, accessibleLicenses));

	// Step 2 - Determine ieObject limited props
	// ---------------------------------------------------
	if (isEmpty(accessibleLicenses)) {
		return null;
	}

	const ieObjectLimitedProps: string[] = uniq(
		accessibleLicenses.flatMap((accessibleLicense: IeObjectLicense) => {
			return IE_OBJECT_PROPS_BY_METADATA_SET[
				IE_OBJECT_METADATA_SET_BY_LICENSE[accessibleLicense]
			];
		})
	);

	// Step 3 - Return ie object with limited access props
	// ---------------------------------------------------
	const limitedIeObject = pick(ieObject, ieObjectLimitedProps);

	// Determine access through
	const accessThrough = getAccessThrough({
		hasFullAccess,
		hasFolderAccess,
		hasIntraCPLicenses:
			intersection(accessibleLicenses, IE_OBJECT_INTRA_CP_LICENSES).length > 0,
		hasPublicLicenses: intersection(accessibleLicenses, IE_OBJECT_PUBLIC_LICENSES).length > 0,
	});

	return {
		...limitedIeObject,
		accessThrough,
	};
};
