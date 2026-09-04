import { compact } from 'lodash';

import { HetArchiefIeObjectLicense, type HetArchiefIeObjectSector } from '@viaa/avo2-types';
import { IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR } from '../ie-objects.conts';

export const getSectorsWithEssenceAccess = (
	userSector: HetArchiefIeObjectSector
): HetArchiefIeObjectSector[] => {
	const accessibleSectors: Readonly<
		Record<HetArchiefIeObjectSector, Readonly<HetArchiefIeObjectLicense[]>>
	> = IE_OBJECT_METADATA_SET_BY_OBJECT_AND_USER_SECTOR[userSector];

	return compact(
		Object.entries(accessibleSectors).map(
			(
				accessibleSectorPair: [HetArchiefIeObjectSector, HetArchiefIeObjectLicense[]]
			): HetArchiefIeObjectSector | null => {
				if (accessibleSectorPair[1].includes(HetArchiefIeObjectLicense.INTRA_CP_CONTENT)) {
					return accessibleSectorPair[0];
				}
				return null;
			}
		)
	);
};
