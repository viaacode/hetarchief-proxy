import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import queryString from 'query-string';

import { Idp } from '../types';

@Injectable()
export class IdpService {
	private idpsWithSpecificLogoutPage = [Idp.HETARCHIEF, Idp.MEEMOO];

	constructor(protected configService: ConfigService) {}

	public hasSpecificLogoutPage(idp: Idp): boolean {
		return this.idpsWithSpecificLogoutPage.includes(idp);
	}

	public getSpecificLogoutUrl(idp: Idp, returnToUrl: string): string {
		const host = this.configService.get('host');

		const url = `${host}/auth/${idp.toLowerCase()}/logout?${queryString.stringify({
			returnToUrl,
		})}`;
		return url;
	}
}
