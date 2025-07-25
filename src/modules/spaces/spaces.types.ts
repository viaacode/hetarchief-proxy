import type {
	FindSpaceByIdQuery,
	FindSpaceByOrganisationIdQuery,
	FindSpaceBySlugQuery,
	FindSpacesQuery,
} from '~generated/graphql-db-types-hetarchief';
import type { AudienceType, ContactInfo, VisitorSpaceStatus } from '~shared/types/types';

export enum AccessType {
	ACTIVE = 'ACTIVE',
	NO_ACCESS = 'NO_ACCESS',
}

export enum VisitorSpaceOrderProps {
	Id = 'id',
	Image = 'schema_image',
	Color = 'schema_color',
	Audience = 'schema_audience_type',
	Description = 'schema_description',
	PublicAccess = 'schema_public_access',
	ServiceDescription = 'schema_service_description',
	Status = 'status', // Converted to 'statusInfo.sort_order.sort_order'
	PublishedAt = 'published_at',
	CreatedAt = 'created_at',
	UpdatedAt = 'updated_at',
	OrganisationName = 'organisation.skos_pref_label',
	OrganisationOrgId = 'organisation.org_identifier',
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
