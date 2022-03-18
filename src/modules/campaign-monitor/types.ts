import { Visit } from '~modules/visits/types';

export enum Template {
	VISIT_REQUEST_CP = 'VISIT_REQUEST_CP',
	VISIT_APPROVED = 'VISIT_APPROVED',
	VISIT_DENIED = 'VISIT_DENIED',
}

export interface VisitEmailInfo {
	template: Template;
	visit: Visit;
}
