import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SamlService } from './saml.service';

@Injectable()
export class HetArchiefService extends SamlService {
	constructor(protected configService: ConfigService) {
		super(configService);
	}

	public async initialize() {
		return this.init({
			url: this.configService.get('samlIdpMetaDataEndpoint'),
			entityId: this.configService.get('samlSpEntityId'),
			privateKey: this.configService.get('samlSpPrivateKey'),
			certificate: this.configService.get('samlSpCertificate'),
			assertEndpoint: `${this.configService.get('host')}/auth/hetarchief/login-callback`,
		});
	}
}
