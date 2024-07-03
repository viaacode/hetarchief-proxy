import {
	BadRequestException,
	type CanActivate,
	type ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Request } from 'express';

import { type Configuration } from '~config';

export const APIKEY = 'apikey';

export const API_KEY_EXCEPTION = new BadRequestException(
	'You need to provide an valid api key for this endpoint under the header "apikey"'
);

@Injectable()
export class ApiKeyGuard implements CanActivate {
	private readonly apiKey: string;

	constructor(private readonly configService: ConfigService<Configuration>) {
		this.apiKey = configService.get('PROXY_API_KEY');
	}

	private static getRequest(ctxOrReq: ExecutionContext | Request): Request {
		if ((ctxOrReq as ExecutionContext).switchToHttp) {
			return (ctxOrReq as ExecutionContext).switchToHttp().getRequest();
		} else {
			return ctxOrReq as Request;
		}
	}

	private static getApiKey(ctxOrReq: ExecutionContext | Request): string | undefined {
		const request = ApiKeyGuard.getRequest(ctxOrReq);
		return request.header(APIKEY);
	}

	canActivate(ctx: ExecutionContext): boolean {
		const headerApiKey: string = ApiKeyGuard.getApiKey(ctx);

		if (headerApiKey === this.apiKey) {
			return true;
		}

		throw API_KEY_EXCEPTION;
	}
}
