import { IeObjectAccessThrough } from '../ie-objects.types';

export const getAccessThrough = (
	hasFolderAccess: boolean,
	hasFullAccess: boolean,
	isSector: boolean
): IeObjectAccessThrough => {
	if (isSector) {
		return IeObjectAccessThrough.SECTOR;
	}

	if (hasFolderAccess) {
		return IeObjectAccessThrough.VISITOR_SPACE_FULL;
	}

	if (hasFullAccess) {
		return IeObjectAccessThrough.VISITOR_SPACE_FOLDERS;
	}

	return IeObjectAccessThrough.PUBLIC_INFO;
};
