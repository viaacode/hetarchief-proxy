import { Visit } from '~modules/visits/types';

export enum Template {
	VISIT_APPROVED = 'VISIT_APPROVED',
	VISIT_DENIED = 'VISIT_DENIED',
}

export interface EmailInfo {
	template: Template;
	to: string;
	data: Visit;
}
