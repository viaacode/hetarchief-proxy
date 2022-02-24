export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED_BY_VISITOR = 'CANCELLED_BY_VISITOR',
}

export interface Visit {
	id: string;
	spaceId: string;
	userProfileId: string;
	timeframe: string;
	reason: string;
	status: VisitStatus;
	startAt: string;
	endAt: string;
	createdAt: string;
	updatedAt: string;
	visitorName: string;
	visitorMail: string;
	visitorId: string;
}
