import { intersection, isEmpty, pick, uniq } from 'lodash';

import { HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import {
	IE_OBJECT_INTRA_CP_LICENSES,
	IE_OBJECT_LICENSES_BY_USER_GROUP,
	IE_OBJECT_METADATA_SET_BY_LICENSE,
	IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR,
	IE_OBJECT_PROPS_BY_METADATA_SET,
	IE_OBJECT_PUBLIC_LICENSES,
} from '../ie-objects.conts';
import {
	type IeObject,
	IeObjectExtraUserGroupType,
	IeObjectMetadataSet,
} from '../ie-objects.types';

import { getAccessThrough } from './get-access-through';

import type { LimitAccessUserInfo } from '~modules/ie-objects/helpers/limit-access-to-object-details.types';
import { GroupId } from '~modules/users/types';

// figure out what properties the user can see and which should be stripped
export const limitAccessToObjectDetails = (
	ieObject: Pick<IeObject, 'licenses' | 'schemaIdentifier' | 'maintainerId' | 'sector'> &
		Partial<IeObject>,
	userInfo: LimitAccessUserInfo
): Partial<IeObject> => {
	if (process.env.IE_OBJECT_LOG_ACCESS_CHECKS === 'true') {
		console.info('limit access to ie-object with user info: ', JSON.stringify(userInfo));
	}
	if (!ieObject) {
		console.error(`Trying to limit metadata on null ie object: ${ieObject}`);
		return {};
	}
	const userGroupLicenses = [
		...(IE_OBJECT_LICENSES_BY_USER_GROUP[
			userInfo.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
		] ?? []),
	];
	const ieObjectLicenses: HetArchiefIeObjectLicense[] = [...(ieObject.licenses || [])];

	const userAccessibleLicenses: HetArchiefIeObjectLicense[] = [];

	const objectIntraCpLicenses = intersection(ieObjectLicenses, IE_OBJECT_INTRA_CP_LICENSES);
	const hasFolderAccess = userInfo.accessibleObjectIdsThroughFolders.includes(
		ieObject?.schemaIdentifier
	);
	const hasFullVisitorSpaceAccess = userInfo.accessibleVisitorSpaceIds.includes(
		ieObject?.maintainerId
	);

	// Step 1a - Determine Licenses
	// ---------------------------------------------------

	// If the ie object exposes a wider license, then we also add the stricter licences to make the checks below easier
	if (ieObjectLicenses.includes(HetArchiefIeObjectLicense.INTRA_CP_CONTENT)) {
		ieObjectLicenses.push(HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL);
	}
	if (ieObjectLicenses.includes(HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL)) {
		ieObjectLicenses.push(HetArchiefIeObjectLicense.INTRA_CP_METADATA_LTD);
	}
	if (ieObjectLicenses.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT)) {
		ieObjectLicenses.push(HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL);
	}
	if (ieObjectLicenses.includes(HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL)) {
		ieObjectLicenses.push(HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD);
	}

	// public licenses can be accessed if the object has public licenses
	// Kiosk users can only see objects from the maintainer they are linked to
	// Test case 6: https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	if (
		userInfo.groupId !== GroupId.KIOSK_VISITOR ||
		ieObject.maintainerId === userInfo.maintainerId
	) {
		userAccessibleLicenses.push(...intersection(ieObjectLicenses, IE_OBJECT_PUBLIC_LICENSES));
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
		const licensesBySector = [
			...IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR[userInfo.sector][ieObject.sector],
		];

		if (ieObject.maintainerId === userInfo.maintainerId) {
			// User linked to maintainer of the object can always see everything that the object allows
			licensesBySector.push(...IE_OBJECT_INTRA_CP_LICENSES);
		}

		// Determine common ground between ie object licenses and user group licenses
		userAccessibleLicenses.push(...licensesBySector);
	}
	// If user is part of VISITOR && has folder access -> add visitor metadata license to licenses
	// If user is part of VISITOR && has full access -> add visitor content license to licenses
	if (hasFolderAccess || hasFullVisitorSpaceAccess) {
		userGroupLicenses.push(
			HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT
		);

		// Determine common ground between ie object licenses and user group licenses
		userAccessibleLicenses.push(...userGroupLicenses);
	}

	const accessibleLicenses = uniq(intersection(ieObjectLicenses, userAccessibleLicenses));

	if (process.env.IE_OBJECT_LOG_ACCESS_CHECKS === 'true') {
		console.info('userAccessibleLicenses: ', JSON.stringify(userAccessibleLicenses));
		console.info('ieObjectLicenses: ', JSON.stringify(ieObjectLicenses));
		console.info('accessibleLicenses: ', JSON.stringify(accessibleLicenses));
	}

	// Step 2 - Determine ieObject limited props
	// ---------------------------------------------------
	if (isEmpty(accessibleLicenses)) {
		return null;
	}

	const ieObjectLimitedProps: string[] = uniq(
		accessibleLicenses.flatMap((accessibleLicense: HetArchiefIeObjectLicense) => {
			return IE_OBJECT_PROPS_BY_METADATA_SET[IE_OBJECT_METADATA_SET_BY_LICENSE[accessibleLicense]];
		})
	);

	// Whether the user may see the essence of this object: the thumbnail, pages, mentions,
	// transcript and rights info. Exactly the licenses that unlock the METADATA_ALL_WITH_ESSENCE
	// prop set, so this is a pure function of the accessible licenses -- it does not depend on
	// whether the object actually has a thumbnail file. Clients use this instead of checking
	// thumbnailUrl for truthiness.
	const hasAccessToEssence = accessibleLicenses.some(
		(accessibleLicense: HetArchiefIeObjectLicense) =>
			IE_OBJECT_METADATA_SET_BY_LICENSE[accessibleLicense] ===
			IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE
	);

	// Step 3 - Return ie object with limited access props
	// ---------------------------------------------------
	const limitedIeObject = pick(ieObject, ieObjectLimitedProps);

	// Determine access through
	const accessThrough = getAccessThrough({
		hasFullAccess: hasFullVisitorSpaceAccess,
		hasFolderAccess,
		hasIntraCPLicenses: intersection(accessibleLicenses, IE_OBJECT_INTRA_CP_LICENSES).length > 0,
		hasPublicLicenses: intersection(accessibleLicenses, IE_OBJECT_PUBLIC_LICENSES).length > 0,
	});

	return {
		...limitedIeObject,
		accessThrough,
		hasAccessToEssence,
	};
};
