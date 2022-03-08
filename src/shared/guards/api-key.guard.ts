import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';

import i18n from '~shared/i18n';

export const API_KEY_EXCEPTION = new BadRequestException(
	i18n.t('You need to provide an valid api key for this endpoint under the header: `apiKey`')
);

@Injectable()
export class ApiKeyGuard implements CanActivate {
	private readonly apiKey: string;

	constructor(private readonly configService: ConfigService) {
		this.apiKey = configService.get('proxyApiKey');
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
		return get(request, 'headers.apiKey');
	}

	canActivate(ctx: ExecutionContext): boolean {
		const headerApiKey: string = ApiKeyGuard.getApiKey(ctx);

		if (headerApiKey === this.apiKey) {
			return true;
		}

		throw API_KEY_EXCEPTION;
	}
}
