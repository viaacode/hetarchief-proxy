import { HetArchiefIeObjectAccessThrough } from '@viaa/avo2-types';

export const getAccessThrough = ({
	hasFullAccess,
	hasFolderAccess,
	hasIntraCPLicenses,
	hasPublicLicenses,
}: {
	hasFullAccess: boolean;
	hasFolderAccess: boolean;
	hasIntraCPLicenses: boolean;
	hasPublicLicenses: boolean;
}): HetArchiefIeObjectAccessThrough[] => {
	const accessThrough = [];
	if (hasIntraCPLicenses) {
		accessThrough.push(HetArchiefIeObjectAccessThrough.SECTOR);
	}

	if (hasFolderAccess) {
		accessThrough.push(HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS);
	}

	if (hasFullAccess) {
		accessThrough.push(HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL);
	}

	if (hasPublicLicenses) {
		accessThrough.push(HetArchiefIeObjectAccessThrough.PUBLIC_INFO);
	}

	return accessThrough;
};
