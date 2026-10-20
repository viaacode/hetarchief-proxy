import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const Ip = createParamDecorator((data: unknown, ctx: ExecutionContext): string | null => {
	const request = ctx.switchToHttp().getRequest();
	if (process.env.NODE_ENV === 'test') {
		return null;
	}
	const ip =
		request.ip ||
		request.connection?.remoteAddress ||
		request.socket?.remoteAddress ||
		(request.connection as any)?.socket?.remoteAddress ||
		request.headers?.['x-forwarded-for'] ||
		null;
	return ip;
});
