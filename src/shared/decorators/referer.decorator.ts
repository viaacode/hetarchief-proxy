import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const Referer = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): string | null => {
		const request = ctx.switchToHttp().getRequest();
		return request.headers.referer || process.env.CLIENT_HOST;
	}
);
