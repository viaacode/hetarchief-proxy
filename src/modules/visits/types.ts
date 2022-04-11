import {
	FindActiveVisitByUserAndSpaceQuery,
	FindApprovedAlmostEndedVisitsWithoutNotificationQuery,
	FindApprovedEndedVisitsWithoutNotificationQuery,
	FindApprovedStartedVisitsWithoutNotificationQuery,
	FindVisitByIdQuery,
	FindVisitsQuery,
	InsertVisitMutation,
	UpdateVisitMutation,
} from '~generated/graphql-db-types-hetarchief';

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

export type GqlNote = InsertVisitMutation['insert_cp_visit_one']['notes'][0];

export type GqlVisitWithNotes =
	| InsertVisitMutation['insert_cp_visit_one']
	| FindVisitsQuery['cp_visit'][0]
	| FindVisitByIdQuery['cp_visit'][0]
	| FindActiveVisitByUserAndSpaceQuery['cp_visit'][0]
	| UpdateVisitMutation['update_cp_visit_by_pk'];

export type GqlVisit =
	| GqlVisitWithNotes
	| FindApprovedStartedVisitsWithoutNotificationQuery['cp_visit'][0]
	| FindApprovedAlmostEndedVisitsWithoutNotificationQuery['cp_visit'][0]
	| FindApprovedEndedVisitsWithoutNotificationQuery['cp_visit'][0];

export interface GqlUpdateVisit {
	start_date: string;
	end_date: string;
	status: VisitStatus;
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
	spaceColor?: string;
	spaceImage?: string;
	spaceLogo?: string;
	spaceInfo?: string;
	spaceDescription?: string;
	spaceServiceDescription?: string;
	startAt: string;
	status: VisitStatus;
	timeframe: string;
	updatedAt: string;
	updatedById: string | null;
	updatedByName: string | null;
	userProfileId: string;
	visitorId: string;
	visitorMail: string;
	visitorName: string;
	visitorFirstName: string;
	visitorLastName: string;
}

export interface VisitSpaceCount {
	count: number;
	id?: string;
}

export interface Note {
	id: string;
	authorName?: string;
	note: string;
	createdAt: string;
}
