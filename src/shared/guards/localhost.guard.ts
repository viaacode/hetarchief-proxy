import { BadRequestException, type CanActivate, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import type { Configuration } from '~config';

@Injectable()
export class LocalhostGuard implements CanActivate {
	private host: string;

	constructor(private readonly configService: ConfigService<Configuration>) {
		this.host = configService.get('HOST');
	}

	canActivate(): boolean {
		if (this.host.startsWith('http://localhost:')) {
			return true;
		}

		throw new BadRequestException('This endpoint is only for debugging on localhost');
	}
}
