import {
	type FindSpaceByIdQuery,
	type FindSpaceByOrganisationIdQuery,
	type FindSpaceBySlugQuery,
	type FindSpacesQuery,
} from '~generated/graphql-db-types-hetarchief';
import { type AudienceType, type ContactInfo, type VisitorSpaceStatus } from '~shared/types/types';

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}

export interface VisitorSpace {
	id: string;
	slug: string;
	maintainerId: string;
	name: string;
	info: string;
	descriptionNl: string;
	serviceDescriptionNl: string;
	descriptionEn: string;
	serviceDescriptionEn: string;
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
	| FindSpaceByOrganisationIdQuery['maintainer_visitor_space'][0];
