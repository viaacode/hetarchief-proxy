import { IeObjectAccessThrough } from '../ie-objects.types';

import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum as AccessType } from '~generated/graphql-db-types-hetarchief';

export const getAccessThrough = (
	hasFolderAccess: AccessType | null = null,
	isSector = false
): IeObjectAccessThrough => {
	if (isSector) {
		return IeObjectAccessThrough.SECTOR;
	}

	if (hasFolderAccess === AccessType.Full) {
		return IeObjectAccessThrough.VISITOR_SPACE_FULL;
	}

	if (hasFolderAccess === AccessType.Folders) {
		return IeObjectAccessThrough.VISITOR_SPACE_FOLDERS;
	}

	return IeObjectAccessThrough.PUBLIC_INFO;
};
