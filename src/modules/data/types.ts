export interface GraphQlResponse<T = any> {
	data?: T;
	errors?: any;
}

export enum QueryOrigin {
	CLIENT = 'CLIENT',
	PROXY = 'PROXY',
}
