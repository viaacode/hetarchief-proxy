import type { HetArchiefIeObject, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import { isEmpty, isNil, uniq } from 'lodash';

import {
	IE_OBJECT_INTRA_CP_LICENSES,
	IE_OBJECT_METADATA_SET_BY_LICENSE,
	IE_OBJECT_PROPS_BY_METADATA_SET,
	IE_OBJECT_PUBLIC_LICENSES,
	IE_OBJECT_VISITOR_LICENSES,
} from '../ie-objects.conts';
import { IeObjectMetadataSet } from '../ie-objects.types';

import type { LimitAccessTrace } from './limit-access-to-object-details.types';

import type { GroupName } from '~modules/users/types';

/**
 * Builds the data for the ie-object access debug page in the admin dashboard
 * (POST /ie-objects/debug). Everything that can be derived from the trace of
 * limitAccessToObjectDetails is derived here, so the client only has to explain it in plain language.
 */

export interface IeObjectAccessDebugViewer {
	// Who the report was made for: a user looked up by email, the logged-in user, or anonymous
	source: 'email' | 'session' | 'anonymous';
	fullName: string | null;
	email: string | null;
	groupName: GroupName;
	organisationId: string | null;
	organisationName: string | null;
	sector: string | null;
	isKeyUser: boolean;
	isEvaluator: boolean;
	fullAccessVisitorSpaceIds: string[];
	folderAccessObjectIds: string[];
}

export enum IeObjectAccessGrantedThrough {
	PUBLIC = 'PUBLIC',
	SECTOR = 'SECTOR',
	VISITOR_SPACE = 'VISITOR_SPACE',
}

export enum IeObjectNotVisibleReason {
	NO_LICENSES = 'NO_LICENSES',
	KIOSK_OTHER_MAINTAINER = 'KIOSK_OTHER_MAINTAINER',
	NO_PUBLIC_LICENSE = 'NO_PUBLIC_LICENSE',
	SECTOR_CONDITIONS_NOT_MET = 'SECTOR_CONDITIONS_NOT_MET',
	NO_VISITOR_SPACE_ACCESS = 'NO_VISITOR_SPACE_ACCESS',
	NO_MATCHING_LICENSE = 'NO_MATCHING_LICENSE',
}

export interface IeObjectAccessDebugLicense {
	license: HetArchiefIeObjectLicense;
	// Added automatically because a wider license on the object implies it
	isImplied: boolean;
	metadataSet: IeObjectMetadataSet;
	grantedThrough: IeObjectAccessGrantedThrough[];
	// Whether this license counts for the user: the object has it and the user may use it
	counts: boolean;
}

export interface IeObjectAccessDebugField {
	field: string;
	// Lowest metadata set that exposes this field, null if no license ever exposes it
	requiredMetadataSet: IeObjectMetadataSet | null;
	visible: boolean;
	hasValue: boolean;
}

export interface IeObjectAccessDebugReport {
	ieObject: Partial<HetArchiefIeObject>;
	limitedIeObject: Partial<HetArchiefIeObject> | null;
	isVisible: boolean;
	highestMetadataSet: IeObjectMetadataSet;
	licenses: IeObjectAccessDebugLicense[];
	notVisibleReasons: IeObjectNotVisibleReason[];
	fields: IeObjectAccessDebugField[];
	trace: LimitAccessTrace;
	// GET /ie-objects adds VISITOR_SPACE_FULL to accessThrough for meemoo admins after limiting
	meemooAdminVisitorSpaceFullAdded: boolean;
}

export enum IeObjectAccessDebugErrorCode {
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND',
}

export interface IeObjectAccessDebugResponse {
	viewer: IeObjectAccessDebugViewer | null;
	report: IeObjectAccessDebugReport | null;
	errorCode: IeObjectAccessDebugErrorCode | null;
}

const METADATA_SET_ORDER: IeObjectMetadataSet[] = [
	IeObjectMetadataSet.EMPTY,
	IeObjectMetadataSet.METADATA_LTD,
	IeObjectMetadataSet.METADATA_ALL,
	IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE,
];

// Always added by limitAccessToObjectDetails, independent of the metadata sets
const COMPUTED_PROPS = ['accessThrough', 'hasAccessToEssence'];

const getMetadataSet = (license: HetArchiefIeObjectLicense): IeObjectMetadataSet =>
	(IE_OBJECT_METADATA_SET_BY_LICENSE[license] as IeObjectMetadataSet) ?? IeObjectMetadataSet.EMPTY;

const getHighestMetadataSet = (licenses: HetArchiefIeObjectLicense[]): IeObjectMetadataSet =>
	licenses.reduce<IeObjectMetadataSet>((highest, license) => {
		const metadataSet = getMetadataSet(license);
		return METADATA_SET_ORDER.indexOf(metadataSet) > METADATA_SET_ORDER.indexOf(highest)
			? metadataSet
			: highest;
	}, IeObjectMetadataSet.EMPTY);

const hasValue = (value: unknown): boolean => {
	if (isNil(value) || value === '') {
		return false;
	}
	if (typeof value === 'object') {
		return !isEmpty(value);
	}
	return true;
};

const getLicenses = (trace: LimitAccessTrace): IeObjectAccessDebugLicense[] =>
	uniq([...(trace.originalObjectLicenses || []), ...(trace.impliedObjectLicenses || [])]).map(
		(license) => {
			const grantedThrough: IeObjectAccessGrantedThrough[] = [];
			if (trace.publicLicensesGranted?.includes(license)) {
				grantedThrough.push(IeObjectAccessGrantedThrough.PUBLIC);
			}
			if (trace.sectorCheck?.licensesGranted?.includes(license)) {
				grantedThrough.push(IeObjectAccessGrantedThrough.SECTOR);
			}
			if (trace.visitorSpaceLicensesGranted?.includes(license)) {
				grantedThrough.push(IeObjectAccessGrantedThrough.VISITOR_SPACE);
			}
			return {
				license,
				isImplied: !!trace.impliedObjectLicenses?.includes(license),
				metadataSet: getMetadataSet(license),
				grantedThrough,
				counts: !!trace.accessibleLicenses?.includes(license),
			};
		}
	);

const getNotVisibleReasons = (
	objectLicenses: HetArchiefIeObjectLicense[],
	trace: LimitAccessTrace
): IeObjectNotVisibleReason[] => {
	const reasons: IeObjectNotVisibleReason[] = [];
	if (!objectLicenses.length) {
		reasons.push(IeObjectNotVisibleReason.NO_LICENSES);
	}
	if (trace.isKioskUserOfOtherMaintainer) {
		reasons.push(IeObjectNotVisibleReason.KIOSK_OTHER_MAINTAINER);
	} else if (!objectLicenses.some((license) => IE_OBJECT_PUBLIC_LICENSES.includes(license))) {
		reasons.push(IeObjectNotVisibleReason.NO_PUBLIC_LICENSE);
	}
	if (
		objectLicenses.some((license) => IE_OBJECT_INTRA_CP_LICENSES.includes(license)) &&
		!trace.sectorCheck?.applies
	) {
		reasons.push(IeObjectNotVisibleReason.SECTOR_CONDITIONS_NOT_MET);
	}
	if (
		objectLicenses.some((license) => IE_OBJECT_VISITOR_LICENSES.includes(license)) &&
		!trace.hasFolderAccess &&
		!trace.hasFullVisitorSpaceAccess
	) {
		reasons.push(IeObjectNotVisibleReason.NO_VISITOR_SPACE_ACCESS);
	}
	if (!reasons.length) {
		reasons.push(IeObjectNotVisibleReason.NO_MATCHING_LICENSE);
	}
	return reasons;
};

const getFields = (
	ieObject: Partial<HetArchiefIeObject>,
	trace: LimitAccessTrace
): IeObjectAccessDebugField[] => {
	const visibleProps = trace.visibleProps || [];
	const fields = uniq([
		...IE_OBJECT_PROPS_BY_METADATA_SET[IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE],
		...Object.keys(ieObject),
	])
		.filter((field) => !COMPUTED_PROPS.includes(field))
		.map((field) => ({
			field,
			requiredMetadataSet:
				METADATA_SET_ORDER.find((set) => IE_OBJECT_PROPS_BY_METADATA_SET[set]?.includes(field)) ??
				null,
			visible: visibleProps.includes(field),
			hasValue: hasValue((ieObject as Record<string, unknown>)[field]),
		}));

	// Shown fields first, then allowed but empty, then hidden, then fields that are never sent
	const sortKey = (field: IeObjectAccessDebugField): number => {
		if (field.visible) {
			return field.hasValue ? 0 : 1;
		}
		return field.requiredMetadataSet ? 2 : 3;
	};
	return fields.sort((a, b) => sortKey(a) - sortKey(b));
};

export const buildIeObjectAccessReport = (
	ieObject: Partial<HetArchiefIeObject>,
	limitedIeObject: Partial<HetArchiefIeObject> | null,
	trace: LimitAccessTrace,
	meemooAdminVisitorSpaceFullAdded: boolean
): IeObjectAccessDebugReport => {
	const licenses = getLicenses(trace);
	const isVisible = !!limitedIeObject;

	return {
		ieObject,
		limitedIeObject,
		isVisible,
		highestMetadataSet: getHighestMetadataSet(trace.accessibleLicenses || []),
		licenses,
		notVisibleReasons: isVisible
			? []
			: getNotVisibleReasons(
					licenses.map((license) => license.license),
					trace
				),
		fields: getFields(ieObject, trace),
		trace,
		meemooAdminVisitorSpaceFullAdded,
	};
};
