import type { MaterialRequest } from '~modules/material-requests/material-requests.types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof MaterialRequest, string>> = {
	id: 'id',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	type: 'type',
	requesterFullName: 'requested_by.full_name',
	requesterMail: 'requested_by.mail',
	maintainerName: 'intellectualEntity.schemaMaintainer.skos_pref_label',
	objectSchemaName: 'intellectualEntity.schema_name',
};
