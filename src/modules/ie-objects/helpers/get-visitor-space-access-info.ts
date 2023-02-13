import { Visit, VisitAccessType } from '~modules/visits/types';

export const getVisitorSpaceAccessInfo = (
	activeVisits: Visit[]
): {
	visitorSpaceIds: string[];
	objectIds: string[];
} => {
	return {
		visitorSpaceIds:
			activeVisits
				?.filter((activeVisit: Visit) => activeVisit.accessType === VisitAccessType.Full)
				?.map((activeVisit: Visit) => activeVisit.spaceMaintainerId) || [],
		objectIds:
			activeVisits?.flatMap((activeVisit: Visit) => activeVisit.collectionsIeSchemaIds) || [],
	};
};
