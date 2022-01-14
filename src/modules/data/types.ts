export interface GraphQlResponse {
	data: any;
}

export enum QueryOrigin {
	CLIENT = 'CLIENT',
	PROXY = 'PROXY',
}
