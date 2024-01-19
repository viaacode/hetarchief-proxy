import { Request } from 'express';

export function getIpFromRequest(request: Request): string | undefined {
	return (
		request.ip ||
		request.connection?.remoteAddress ||
		request.socket.remoteAddress ||
		(request.connection as any)?.socket?.remoteAddress ||
		request.headers['x-forwarded-for'] ||
		undefined
	);
}
