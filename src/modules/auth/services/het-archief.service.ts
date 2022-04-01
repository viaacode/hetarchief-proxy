import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConfig } from '~config';

import { SamlService } from './saml.service';

@Injectable()
export class HetArchiefService extends SamlService {
	constructor(protected configService: ConfigService) {
		super(configService);
		this.logger = new Logger(HetArchiefService.name, { timestamp: true });
	}

	public async initialize() {
		return this.init({
			url: getConfig(this.configService, 'samlIdpMetaDataEndpoint'),
			entityId: getConfig(this.configService, 'samlSpEntityId'),
			privateKey: getConfig(this.configService, 'samlSpPrivateKey'),
			certificate: getConfig(this.configService, 'samlSpCertificate'),
			assertEndpoint: `${getConfig(
				this.configService,
				'host'
			)}/auth/hetarchief/login-callback`,
		});
	}
}
