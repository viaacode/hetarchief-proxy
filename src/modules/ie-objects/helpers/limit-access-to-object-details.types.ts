import {
	type HetArchiefIeObjectAccessThrough,
	type HetArchiefIeObjectLicense,
	type HetArchiefIeObjectSector,
} from '@viaa/avo2-types';

export interface LimitAccessUserInfo {
	userId: string | null;
	isKeyUser: boolean;
	sector: HetArchiefIeObjectSector | null;
	groupId: string;
	maintainerId: string;
	// folders -> if ie object id is in here then the user has folder access to this visitor space
	accessibleObjectIdsThroughFolders: string[];
	// May only contain FULL ACCESS Visitor space ids
	// full -> if object.maintainerId is in this list than the user has full access to visitor space
	accessibleVisitorSpaceIds: string[];
}

/**
 * Intermediate values of limitAccessToObjectDetails, filled in when a trace object is passed.
 * Used by the ie-object access debug report to explain why an object/field is (not) visible.
 */
export interface LimitAccessTrace {
	userGroupLicenses?: HetArchiefIeObjectLicense[];
	originalObjectLicenses?: HetArchiefIeObjectLicense[];
	// Licenses added because a wider license implies them (eg: CONTENT implies METADATA_ALL)
	impliedObjectLicenses?: HetArchiefIeObjectLicense[];
	isKioskUserOfOtherMaintainer?: boolean;
	publicLicensesGranted?: HetArchiefIeObjectLicense[];
	sectorCheck?: {
		userGroupAllowed: boolean;
		userHasSector: boolean;
		objectHasSector: boolean;
		isKeyUser: boolean;
		objectHasIntraCpLicenses: boolean;
		applies: boolean;
		isOwnMaintainer: boolean;
		licensesBySector: HetArchiefIeObjectLicense[];
		licensesGranted: HetArchiefIeObjectLicense[];
	};
	hasFolderAccess?: boolean;
	hasFullVisitorSpaceAccess?: boolean;
	visitorSpaceLicensesGranted?: HetArchiefIeObjectLicense[];
	userAccessibleLicenses?: HetArchiefIeObjectLicense[];
	accessibleLicenses?: HetArchiefIeObjectLicense[];
	visibleProps?: string[];
	hasAccessToEssence?: boolean;
	accessThrough?: HetArchiefIeObjectAccessThrough[];
}
