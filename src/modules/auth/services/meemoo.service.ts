import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Configuration } from '~config';

import { SamlService } from './saml.service';

@Injectable()
export class MeemooService extends SamlService {
	constructor(protected configService: ConfigService<Configuration>) {
		super(configService);
		this.logger = new Logger(MeemooService.name, { timestamp: true });
	}

	public async initialize() {
		// Note: every environment uses the same key/certificate,
		// so it's the same for both Archief and Meemoo IDP
		return this.init({
			url: this.configService.get('SAML_MEEMOO_IDP_META_DATA_ENDPOINT'),
			entityId: this.configService.get('SAML_MEEMOO_SP_ENTITY_ID'),
			privateKey: this.configService.get('SAML_SP_PRIVATE_KEY'),
			certificate: this.configService.get('SAML_SP_CERTIFICATE'),
			assertEndpoint: `${this.configService.get('HOST')}/auth/meemoo/login-callback`,
		});
	}
}
