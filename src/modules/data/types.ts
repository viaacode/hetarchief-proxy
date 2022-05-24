export interface GraphQlResponse<T = any> {
	data?: T;
	errors?: any;
}

export enum QueryOrigin {
	ADMIN_CORE = 'ADMIN_CORE',
	PROXY = 'PROXY',
}
