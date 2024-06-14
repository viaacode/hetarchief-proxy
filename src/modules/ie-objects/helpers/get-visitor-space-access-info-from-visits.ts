import { IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import { VisitAccessType, VisitRequest } from '~modules/visits/types';

export const getVisitorSpaceAccessInfoFromVisits = (
	activeVisits: VisitRequest[]
): IeObjectsVisitorSpaceInfo => {
	return {
		visitorSpaceIds:
			activeVisits
				?.filter(
					(activeVisit: VisitRequest) => activeVisit.accessType === VisitAccessType.Full
				)
				?.map((activeVisit: VisitRequest) => activeVisit.spaceMaintainerId) || [],
		objectIds:
			activeVisits?.flatMap((activeVisit: VisitRequest) => activeVisit.accessibleObjectIds) ||
			[],
	};
};
