import { EmailTemplate } from '~modules/campaign-monitor/campaign-monitor.types';
import {
	MaterialRequest,
	MaterialRequestStatus,
} from '~modules/material-requests/material-requests.types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof MaterialRequest, string>> = {
	id: 'id',
	createdAt: 'created_at',
	requestedAt: 'requested_at',
	type: 'type',
	status: 'status_info.sort_order',
	requestName: 'name',
	requesterFullName: 'requested_by.full_name',
	requesterMail: 'requested_by.mail',
	maintainerName: 'intellectualEntity.schemaMaintainer.skos_pref_label',
	objectSchemaName: 'intellectualEntity.schema_name',
};

export const MAP_MATERIAL_REQUEST_STATUS_TO_EMAIL_TEMPLATE = {
	[MaterialRequestStatus.CANCELLED]: EmailTemplate.MATERIAL_REQUEST_REQUESTER_CANCELLED,
	[MaterialRequestStatus.APPROVED]: EmailTemplate.MATERIAL_REQUEST_MAINTAINER_APPROVED,
	[MaterialRequestStatus.DENIED]: EmailTemplate.MATERIAL_REQUEST_MAINTAINER_DENIED,
};
