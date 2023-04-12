import { IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import { Visit, VisitAccessType } from '~modules/visits/types';

export const getVisitorSpaceAccessInfoFromVisits = (
	activeVisits: Visit[]
): IeObjectsVisitorSpaceInfo => {
	return {
		visitorSpaceIds:
			activeVisits
				?.filter((activeVisit: Visit) => activeVisit.accessType === VisitAccessType.Full)
				?.map((activeVisit: Visit) => activeVisit.spaceMaintainerId) || [],
		objectIds:
			activeVisits?.flatMap((activeVisit: Visit) => activeVisit?.accessibleObjectIds) || [],
	};
};
