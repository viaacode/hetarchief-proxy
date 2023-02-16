import { IeObjectAccessThrough } from '../ie-objects.types';

export const getAccessThrough = (
	hasFullAccess: boolean,
	hasFolderAccess: boolean,
	hasIntraCPLicenses: boolean,
	hasPublicLicenses: boolean
): IeObjectAccessThrough[] => {
	const accessThrough = [];
	if (hasIntraCPLicenses) {
		accessThrough.push(IeObjectAccessThrough.SECTOR);
	}

	if (hasFolderAccess) {
		accessThrough.push(IeObjectAccessThrough.VISITOR_SPACE_FOLDERS);
	}

	if (hasFullAccess) {
		accessThrough.push(IeObjectAccessThrough.VISITOR_SPACE_FULL);
	}

	if (hasPublicLicenses) {
		accessThrough.push(IeObjectAccessThrough.PUBLIC_INFO);
	}

	return accessThrough;
};
