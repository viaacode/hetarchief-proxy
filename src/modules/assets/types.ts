export enum AssetFileType {
	SPACE_IMAGE = 'SPACE_IMAGE',
	CONTENT_PAGE_IMAGE = 'CONTENT_PAGE_IMAGE',
	SITEMAP = 'SITEMAP',
}

export interface AssetToken {
	token: string;
	owner: string;
	scope: string;
	expiration: string; // Timestamp
	creation: string; // Timestamp
	secret: string;
}
