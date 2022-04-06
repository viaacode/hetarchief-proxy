import {
	FindSpaceByCpAdminIdQuery,
	FindSpaceByIdQuery,
	FindSpaceByMaintainerIdentifierQuery,
	FindSpacesQuery,
	Lookup_Cp_Space_Status_Enum,
	Lookup_Schema_Audience_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { ContactInfo } from '~shared/types/types';

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}

export interface Space {
	id: string;
	maintainerId: string;
	name: string;
	description: string;
	serviceDescription: string;
	image: string;
	color: string;
	logo: string;
	audienceType: Lookup_Schema_Audience_Type_Enum;
	publicAccess: boolean;
	contactInfo: ContactInfo;
	status: Lookup_Cp_Space_Status_Enum;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
}

export type GqlSpace =
	| FindSpaceByIdQuery['cp_space'][0]
	| FindSpacesQuery['cp_space'][0]
	| FindSpaceByMaintainerIdentifierQuery['cp_space'][0]
	| FindSpaceByCpAdminIdQuery['cp_space'][0];
