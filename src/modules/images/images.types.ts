export type ImageResponse =
	| { type: 'redirect'; url: string; cacheControl: string }
	| { type: 'image'; buffer: Buffer; cacheControl: string };
