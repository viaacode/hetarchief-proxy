import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SamlService } from './saml.service';

@Injectable()
export class MeemooService extends SamlService {
	constructor(protected configService: ConfigService) {
		super(configService);
	}

	public async initialize() {
		// Note: every environment uses the same key/certificate,
		// so it's the same for both Archief and Meemoo IDP
		return this.init({
			url: this.configService.get('samlMeemooIdpMetaDataEndpoint'),
			entityId: this.configService.get('samlMeemooSpEntityId'),
			privateKey: this.configService.get('samlSpPrivateKey'),
			certificate: this.configService.get('samlSpCertificate'),
			assertEndpoint: `${this.configService.get('host')}/auth/meemoo/login-callback`,
		});
	}
}
