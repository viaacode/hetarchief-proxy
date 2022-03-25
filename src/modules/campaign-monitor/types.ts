import { Visit } from '~modules/visits/types';
import { Recipient } from '~shared/types/types';

export enum Template {
	VISIT_REQUEST_CP = 'VISIT_REQUEST_CP',
	VISIT_APPROVED = 'VISIT_APPROVED',
	VISIT_DENIED = 'VISIT_DENIED',
}

export interface VisitEmailInfo {
	to: Recipient[];
	template: Template;
	visit: Visit;
}
