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

export interface Visit {
	id: string;
	spaceId: string;
	spaceName: string;
	spaceMail: string;
	userProfileId: string;
	timeframe: string;
	reason: string;
	status: VisitStatus;
	startAt: string;
	endAt: string;
	note?: Note;
	createdAt: string;
	updatedAt: string;
	visitorName: string;
	visitorFirstName: string;
	visitorLastName: string;
	visitorMail: string;
	visitorId: string;
}

export interface Note {
	id: string;
	authorName?: string;
	note: string;
	createdAt: string;
	updatedAt: string;
}
