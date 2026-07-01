export interface IeObjectInTheme {
	id: string;
	name: string | null;
	format: string | null;
	thumbnailUrl: string | null;
	maintainerId: string | null;
	maintainerName: string | null;
}

export interface IeObjectsInThemeResponse {
	id: string;
	slug: string;
	nameNl: string;
	nameEn: string;
	imageUrl: string | null;
	ieObjects: IeObjectInTheme[];
}
