import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SamlService } from './saml.service';
@Injectable()
export class MeemooService extends SamlService {
	constructor(protected configService: ConfigService) {
		super(configService);
	}

	public async initialize() {
		return this.init({
			url: this.configService.get('samlMeemooIdpMetaDataEndpoint'),
			entityId: this.configService.get('samlMeemooSpEntityId'),
			privateKey: this.configService.get('samlMeemooSpPrivateKey'),
			certificate: this.configService.get('samlMeemooSpCertificate'),
			assertEndpoint: `${this.configService.get('host')}/auth/meemoo/login-callback`,
		});
	}
}
