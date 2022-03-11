import { Visit } from '~modules/visits/types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof Visit, string>> = {
	id: 'id',
	spaceId: 'cp_space_id',
	spaceName: 'space.schema_maintainer.schema_name',
	// spaceAddress: 'NOT-SORTABLE', // space.schema_maintainer.information is an array and can not be sorted on
	userProfileId: 'user_profile_id',
	timeframe: 'user_timeframe',
	reason: 'user_reason',
	status: 'status',
	startAt: 'start_date',
	endAt: 'end_date',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	visitorName: 'user_profile.first_name', // TODO we need to include a full name prop to sort and search on => Bart Debunne
	visitorMail: 'user_profile.mail',
	visitorId: 'user_profile.id',
};
