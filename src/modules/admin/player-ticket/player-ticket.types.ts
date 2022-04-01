export interface PlayerTicket {
	jwt: string;
	context: {
		app: string;
		name: string;
		expiration: string;
		aud: string;
		exp: number;
		sub: string;
		ip: string;
		referer: string;
		fragment: {
			start: string;
			end: string;
		};
	};
}
