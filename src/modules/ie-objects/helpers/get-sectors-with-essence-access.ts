import { compact } from 'lodash';

import { IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR } from '../ie-objects.conts';
import { IeObjectLicense, type IeObjectSector } from '../ie-objects.types';

export const getSectorsWithEssenceAccess = (userSector: IeObjectSector): IeObjectSector[] => {
	const accessibleSectors: Readonly<Record<IeObjectSector, Readonly<IeObjectLicense[]>>> =
		IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR[userSector];

	return compact(
		Object.entries(accessibleSectors).map(
			(accessibleSectorPair: [IeObjectSector, IeObjectLicense[]]): IeObjectSector | null => {
				if (accessibleSectorPair[1].includes(IeObjectLicense.INTRA_CP_CONTENT)) {
					return accessibleSectorPair[0];
				}
				return null;
			}
		)
	);
};
