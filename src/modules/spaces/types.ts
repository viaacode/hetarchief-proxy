import { AudienceType, VisitorSpaceStatus } from '~generated/database-aliases';
import {
	FindSpaceByCpAdminIdQuery,
	FindSpaceByIdQuery,
	FindSpaceBySlugQuery,
	FindSpacesQuery,
} from '~generated/graphql-db-types-hetarchief';
import { ContactInfo } from '~shared/types/types';

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}

export interface Space {
	id: string;
	slug: string;
	maintainerId: string;
	name: string;
	info: string;
	description: string;
	serviceDescription: string;
	image: string;
	color: string;
	logo: string;
	audienceType: AudienceType;
	publicAccess: boolean;
	contactInfo: ContactInfo;
	status: VisitorSpaceStatus;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
}

export type GqlSpace =
	| FindSpaceByIdQuery['maintainer_visitor_space'][0]
	| FindSpacesQuery['maintainer_visitor_space'][0]
	| FindSpaceBySlugQuery['maintainer_visitor_space'][0]
	| FindSpaceByCpAdminIdQuery['maintainer_visitor_space'][0];
