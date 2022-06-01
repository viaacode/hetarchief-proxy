export interface DeleteResponse {
	affectedRows: number;
}

export enum SpecialPermissionGroups {
	loggedOutUsers = '-1',
	loggedInUsers = '-2',
}

export interface Address {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}

export interface ContactInfo {
	email?: string | null;
	telephone?: string | null;
	address: Address;
}

export interface Recipient {
	id: string;
	email: string;
}

export interface UpdateResponse {
	affectedRows: number;
}
