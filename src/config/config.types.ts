import { ConfigService as NestConfigService } from '@nestjs/config';

export interface Configuration {
	environment: string;
	host: string;
	port: number;
	graphQlUrl: string;
	graphQlSecret: string;
	graphQlEnableWhitelist: boolean;
	cookieSecret: string;
	cookieMaxAge: number;
	redisConnectionString: string;
	elasticSearchUrl: string;
	samlIdpMetaDataEndpoint: string;
	samlSpEntityId: string;
	samlSpPrivateKey: string;
	samlSpCertificate: string;
	samlMeemooIdpMetaDataEndpoint: string;
	samlMeemooSpEntityId: string;
	corsEnableWhitelist: boolean;
	corsOptions: any;
	ticketServiceUrl: string;
	ticketServiceCertificate: string;
	ticketServiceKey: string;
	ticketServicePassphrase: string;
	ticketServiceMaxAge: number;
	mediaServiceUrl: string;
}

export type ConfigService = NestConfigService<Configuration>;
