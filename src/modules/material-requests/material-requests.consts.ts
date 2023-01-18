import { MaterialRequest } from '~modules/material-requests/material-requests.types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof MaterialRequest, string>> = {
	id: 'id',
	reason: 'reason',
	createdAt: 'created_at',
	type: 'lookup.app_material_request_type',
	requesterName: 'requested_by.full_name',
	requesterMail: 'requested_by.mail',
	maintainerId: 'object.maintainer.schema_identifier',
	maintainerName: 'object.maintainer.schema_name',
	maintainerSlug: 'object.maintainer.visitor_space.slug',
};
