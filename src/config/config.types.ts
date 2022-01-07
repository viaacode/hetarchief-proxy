import { ConfigService as NestConfigService } from '@nestjs/config';

export interface Configuration {
	host: string;
	port: number;
	samlIdpMetaDataEndpoint: string;
	samlSpEntityId: string;
	samlSpPrivateKey: string;
	samlSpCertificate: string;
}

export type ConfigService = NestConfigService<Configuration>;
