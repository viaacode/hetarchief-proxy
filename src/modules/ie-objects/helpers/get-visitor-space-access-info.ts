import { IPagination } from '@studiohyperdrive/pagination';
import { isEmpty, union } from 'lodash';

import { Visit, VisitAccessType } from '~modules/visits/types';

export const getVisitorSpaceAccessInfo = (
	activeVisits: IPagination<Visit>
): {
	visitorSpaceIds: string[];
	objectIds: string[];
} => {
	const visitorSpaceInfo = {
		visitorSpaceIds: [],
		objectIds: [],
	};

	if (!isEmpty(activeVisits)) {
		visitorSpaceInfo.visitorSpaceIds = activeVisits.items
			.filter((activeVisit: Visit) => activeVisit.accessType === VisitAccessType.Full)
			.map((activeVisit: Visit) => activeVisit.spaceMaintainerId);

		visitorSpaceInfo.objectIds = union(
			...activeVisits.items.map((activeVisit: Visit) => activeVisit.collectionsIeSchemaIds)
		);
	}

	return visitorSpaceInfo;
};
