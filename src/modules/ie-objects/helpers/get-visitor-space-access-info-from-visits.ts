import { compact } from 'lodash';

import type { IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import { VisitAccessType, type VisitRequest } from '~modules/visits/types';

export const getVisitorSpaceAccessInfoFromVisits = (
	activeVisits: VisitRequest[]
): IeObjectsVisitorSpaceInfo => {
	return {
		visitorSpaceIds: compact(
			activeVisits
				?.filter((activeVisit: VisitRequest) => activeVisit.accessType === VisitAccessType.Full)
				?.map((activeVisit: VisitRequest) => activeVisit.spaceMaintainerId) || []
		),
		objectIds: compact(
			activeVisits?.flatMap((activeVisit: VisitRequest) => activeVisit.accessibleObjectIds) || []
		),
	};
};
