import { type Request } from 'express';

export function getIpFromRequest(request: Request): string | undefined {
	if (process.env.NODE_ENV === 'test') {
		return undefined;
	}
	return (
		request.ip ||
		request.connection?.remoteAddress ||
		request.socket?.remoteAddress ||
		(request.connection as any)?.socket?.remoteAddress ||
		request.headers?.['x-forwarded-for'] ||
		undefined
	);
}
