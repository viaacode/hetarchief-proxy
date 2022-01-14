import { ConfigService as NestConfigService } from '@nestjs/config';

export interface Configuration {
	host: string;
	port: number;
	graphQlUrl: string;
	graphQlSecret: string;
	graphQlEnableWhitelist: boolean;
	samlIdpMetaDataEndpoint: string;
	samlSpEntityId: string;
	samlSpPrivateKey: string;
	samlSpCertificate: string;
}

export type ConfigService = NestConfigService<Configuration>;
