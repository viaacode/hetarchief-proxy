import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConfig } from '~config';

import { SamlService } from './saml.service';

@Injectable()
export class MeemooService extends SamlService {
	constructor(protected configService: ConfigService) {
		super(configService);
		this.logger = new Logger(MeemooService.name, { timestamp: true });
	}

	public async initialize() {
		// Note: every environment uses the same key/certificate,
		// so it's the same for both Archief and Meemoo IDP
		return this.init({
			url: getConfig(this.configService, 'samlMeemooIdpMetaDataEndpoint'),
			entityId: getConfig(this.configService, 'samlMeemooSpEntityId'),
			privateKey: getConfig(this.configService, 'samlSpPrivateKey'),
			certificate: getConfig(this.configService, 'samlSpCertificate'),
			assertEndpoint: `${getConfig(this.configService, 'host')}/auth/meemoo/login-callback`,
		});
	}
}
