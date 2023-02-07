import {
	FindActiveVisitByUserAndSpaceQuery,
	FindApprovedAlmostEndedVisitsWithoutNotificationQuery,
	FindApprovedEndedVisitsWithoutNotificationQuery,
	FindApprovedStartedVisitsWithoutNotificationQuery,
	FindVisitByIdQuery,
	FindVisitsByFolderIdQuery,
	FindVisitsQuery,
	InsertVisitMutation,
	Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum,
	UpdateVisitMutation,
} from '~generated/graphql-db-types-hetarchief';

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
	| FindActiveVisitByUserAndSpaceQuery['maintainer_visitor_space_request'][0]
	| UpdateVisitMutation['update_maintainer_visitor_space_request_by_pk'];

export type GqlVisit =
	| GqlVisitWithNotes
	| FindApprovedStartedVisitsWithoutNotificationQuery['maintainer_visitor_space_request'][0]
	| FindApprovedAlmostEndedVisitsWithoutNotificationQuery['maintainer_visitor_space_request'][0]
	| FindApprovedEndedVisitsWithoutNotificationQuery['maintainer_visitor_space_request'][0];

export type GqlVisitByFolderId =
	FindVisitsByFolderIdQuery['maintainer_visitor_space_request_folder_access'][0];

export interface GqlUpdateVisit {
	start_date: string;
	end_date: string;
	status: VisitStatus;
	updated_by?: string;
	access_type?: string;
}

export interface Visit {
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
	spaceDescription?: string;
	spaceServiceDescription?: string;
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

export interface ActiveVisitByUser {
	visitorSpaceRequest: {
		id: string;
		accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum;
	};
	visitorSpace: {
		id: string;
		sector: string;
		maintainerId: string;
	};
	collections: Array<string>;
}

export interface GqlActiveVisitByUser {
	access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum;
	id: string;
	visitor_space: {
		id: string;
		content_partner: {
			information?: {
				sector?: string;
			};
		};
		schema_maintainer_id: string;
	};
	requested_by: {
		collections: Array<{
			id: string;
		}>;
	};
}
