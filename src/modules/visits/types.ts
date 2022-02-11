type VisitStatus = 'PENDING';

export interface Visit {
	id: string;
	spaceId: string;
	userProfileId: string;
	timeframe: string;
	reason: string;
	acceptedTos: boolean;
	status: VisitStatus;
	startAt: string;
	endAt: string;
	createdAt: string;
	updatedAt: string;
	visitorName: string;
	visitorMail: string;
	visitorId: string;
}
