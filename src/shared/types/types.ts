import { type Locale } from '~shared/types/types';

export enum SpecialPermissionGroups {
	loggedOutUsers = '-1',
	loggedInUsers = '-2',
}

export interface ContactInfo {
	email?: string | null;
	telephone?: string | null;
}

export interface Recipient {
	id: string;
	email: string;
	language: Locale;
}

export interface UpdateResponse {
	affectedRows: number;
}

export {
	Lookup_Languages_Enum as Locale,
	Lookup_Schema_Audience_Type_Enum as AudienceType,
	Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus,
} from '~generated/graphql-db-types-hetarchief';
