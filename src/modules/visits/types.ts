export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED_BY_VISITOR = 'CANCELLED_BY_VISITOR',
}

export enum VisitTimeframe {
	ACTIVE = 'ACTIVE',
	PAST = 'PAST',
	FUTURE = 'FUTURE',
}

export interface GqlProfile {
	full_name: string;
	first_name: string;
	last_name: string;
	mail: string;
	id: string;
}

export interface GqlVisit {
	id: string;
	cp_space_id: string;
	user_profile_id: string;
	user_reason: string;
	user_timeframe: string;
	status: VisitStatus;
	start_date: string;
	end_date: string;
	notes: any[];
	created_at: string;
	updated_at: string;
	user_profile: Partial<GqlProfile>;
	space: {
		schema_maintainer: {
			schema_name: string;
		};
	};
	updater: Partial<GqlProfile>;
	updated_by?: string;
}

export interface Visit {
	id: string;
	createdAt: string;
	endAt: string;
	note?: Note;
	reason: string;
	spaceAddress?: string;
	spaceId: string;
	spaceMail: string;
	spaceName: string;
	spaceSlug: string;
	startAt: string;
	status: VisitStatus;
	timeframe: string;
	updatedAt: string;
	updatedById: string | null;
	updatedByName: string | null;
	userProfileId: string;
	visitorFirstName: string;
	visitorId: string;
	visitorLastName: string;
	visitorMail: string;
	visitorName: string;
}

export interface Note {
	id: string;
	authorName?: string;
	note: string;
	createdAt: string;
	updatedAt: string;
}
