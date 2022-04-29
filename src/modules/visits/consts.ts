import { Visit } from '~modules/visits/types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof Visit, string>> = {
	id: 'id',
	spaceId: 'cp_space_id',
	spaceName: 'visitor_space.content_partner.schema_name',
	// spaceAddress: 'NOT-SORTABLE', // visitor_space.content_partner.information is an array and can not be sorted on
	userProfileId: 'user_profile_id',
	timeframe: 'user_timeframe',
	reason: 'user_reason',
	status: 'status_info.sort_order',
	startAt: 'start_date',
	endAt: 'end_date',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	visitorName: 'requested_by.full_name',
	visitorMail: 'requested_by.mail',
	visitorId: 'requested_by.id',
	updatedById: 'updated_by',
	updatedByName: 'last_updated_by.full_name',
};
