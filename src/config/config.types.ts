import { ConfigService as NestConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface Configuration {
	environment: string;
	host: string;
	clientHost: string;
	port: number;
	proxyApiKey: string;
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
	enableSendEmail: boolean;
	campaignMonitorApiEndpoint: string;
	campaignMonitorApiKey: string;
	campaignMonitorTemplateVisitRequestCp: string;
	campaignMonitorTemplateVisitApproved: string;
	campaignMonitorTemplateVisitDenied: string;
	assetServerEndpoint: string;
	assetServerTokenEndpoint: string;
	assetServerTokenSecret: string;
	assetServerTokenPassword: string;
	assetServerTokenUsername: string;
	assetServerBucketName: string;
	tempAssetFolder: string;
	multerOptions: MulterOptions;
}

export type ConfigService = NestConfigService<Configuration>;
