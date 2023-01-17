import { MaterialRequest } from '~modules/material-requests/types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof MaterialRequest, string>> = {
	id: 'id',
	objectSchemaIdentifier: 'object_schema_identifier',
	profileId: 'profile_id',
	reason: 'reason',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
};
