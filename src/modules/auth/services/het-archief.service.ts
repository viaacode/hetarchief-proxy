import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Configuration } from '~config';

import { SamlService } from './saml.service';

@Injectable()
export class HetArchiefService extends SamlService {
	constructor(protected configService: ConfigService<Configuration>) {
		super(configService);
		this.logger = new Logger(HetArchiefService.name, { timestamp: true });
	}

	public async initialize() {
		return this.init({
			url: this.configService.get('SAML_IDP_META_DATA_ENDPOINT'),
			entityId: this.configService.get('SAML_SP_ENTITY_ID'),
			privateKey: this.configService.get('SAML_SP_PRIVATE_KEY'),
			certificate: this.configService.get('SAML_SP_CERTIFICATE'),
			assertEndpoint: `${this.configService.get('HOST')}/auth/hetarchief/login-callback`,
		});
	}
}
