import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import queryString from 'query-string';

import { getConfig } from '~config';

import { Idp } from '~shared/auth/auth.types';

@Injectable()
export class IdpService {
	private idpsWithSpecificLogoutPage = [Idp.HETARCHIEF, Idp.MEEMOO];

	constructor(protected configService: ConfigService) {}

	public hasSpecificLogoutPage(idp: Idp): boolean {
		return this.idpsWithSpecificLogoutPage.includes(idp);
	}

	public getSpecificLogoutUrl(idp: Idp, returnToUrl: string): string {
		const host = getConfig(this.configService, 'host');

		const url = `${host}/auth/${idp.toLowerCase()}/logout?${queryString.stringify({
			returnToUrl,
		})}`;
		return url;
	}
}
