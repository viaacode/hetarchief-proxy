export interface GraphQlResponse {
	data?: any;
	errors?: any;
}

export enum QueryOrigin {
	CLIENT = 'CLIENT',
	PROXY = 'PROXY',
}
