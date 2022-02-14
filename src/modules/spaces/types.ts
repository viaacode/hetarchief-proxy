export enum AudienceType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',
}

export interface Address {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}
export interface ContactInfo {
	email: string;
	telephone: string;
	address: Address;
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
