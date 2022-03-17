import { Visit } from '~modules/visits/types';

export const ORDER_PROP_TO_DB_PROP: Partial<Record<keyof Visit, string>> = {
	id: 'id',
	spaceId: 'cp_space_id',
	spaceName: 'space.schema_maintainer.schema_name',
	userProfileId: 'user_profile_id',
	timeframe: 'user_timeframe',
	reason: 'user_reason',
	status: 'status',
	startAt: 'start_date',
	endAt: 'end_date',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	visitorName: 'user_profile.full_name',
	visitorMail: 'user_profile.mail',
	visitorId: 'user_profile.id',
	updatedById: 'updated_by',
	updatedByName: 'updater.full_name',
};
