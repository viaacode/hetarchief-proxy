import { ContactInfo } from '~shared/types/types';

export enum AudienceType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',
}

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
	audienceType: AudienceType;
	publicAccess: boolean;
	contactInfo: ContactInfo;
	isPublished: boolean;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
}
