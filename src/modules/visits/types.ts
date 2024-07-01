import {
	type FindActiveVisitByUserAndSpaceQuery,
	type FindApprovedAlmostEndedVisitsWithoutNotificationQuery,
	type FindApprovedEndedVisitsWithoutNotificationQuery,
	type FindApprovedStartedVisitsWithoutNotificationQuery,
	type FindVisitByIdQuery,
	type FindVisitEndDatesByFolderIdQuery,
	type FindVisitsQuery,
	type InsertVisitMutation,
	type Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { type Locale } from '~shared/types/types';

export { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum as VisitAccessType } from '~generated/graphql-db-types-hetarchief';

export enum VisitStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED_BY_VISITOR = 'CANCELLED_BY_VISITOR',
}

export enum AccessStatus {
	ACCESS = 'ACCESS',
	PENDING = 'PENDING',
	NO_ACCESS = 'NO_ACCESS',
}

export enum VisitTimeframe {
	ACTIVE = 'ACTIVE',
	PAST = 'PAST',
	FUTURE = 'FUTURE',
}

export type GqlNote =
	InsertVisitMutation['insert_maintainer_visitor_space_request_one']['visitor_space_request_notes'][0];

export type GqlVisitWithNotes =
	| InsertVisitMutation['insert_maintainer_visitor_space_request_one']
	| FindVisitsQuery['maintainer_visitor_space_request'][0]
	| FindVisitByIdQuery['maintainer_visitor_space_request'][0]
	| FindActiveVisitByUserAndSpaceQuery['maintainer_visitor_space_request'][0];

export type GqlVisit =
	| GqlVisitWithNotes
	| FindApprovedStartedVisitsWithoutNotificationQuery['maintainer_visitor_space_request'][0]
	| FindApprovedAlmostEndedVisitsWithoutNotificationQuery['maintainer_visitor_space_request'][0]
	| FindApprovedEndedVisitsWithoutNotificationQuery['maintainer_visitor_space_request'][0];

export type GqlVisitByFolderId =
	FindVisitEndDatesByFolderIdQuery['maintainer_visitor_space_request_folder_access'][0];

export interface GqlUpdateVisit {
	start_date: string;
	end_date: string;
	status: VisitStatus;
	updated_by?: string;
	access_type?: string;
}

export interface VisitRequest {
	id: string;
	createdAt: string;
	endAt: string;
	note?: Note;
	reason: string;
	spaceAddress?: string;
	spaceId: string; // db uuid
	spaceMaintainerId: string; // OR id
	spaceMail: string;
	spaceTelephone: string;
	spaceName: string;
	spaceSlug: string;
	spaceColor?: string;
	spaceImage?: string;
	spaceLogo?: string;
	spaceInfo?: string;
	spaceDescriptionNl?: string;
	spaceServiceDescriptionNl?: string;
	spaceDescriptionEn?: string;
	spaceServiceDescriptionEn?: string;
	startAt: string;
	status: VisitStatus;
	accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum;
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
	visitorLanguage: Locale;
	accessibleFolderIds?: string[];
	accessibleObjectIds?: string[];
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
