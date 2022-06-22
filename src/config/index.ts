import { ForbiddenException } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions/not-implemented.exception';
import { ConfigService } from '@nestjs/config';

import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';

const WHITE_LIST_DOMAINS = ['http://localhost:3000'];
const VALID_MIME_TYPES: string[] = ['image/png', 'image/gif', 'image/jpeg', 'image/bmp'];

/**
 * Environment variables are loaded differently locally and on IBM cloud
 * dotenv handles the newlines in the certificates/keys differently
 * and are cleaned here
 * @param envVar the variable (value) to clean
 * @returns the cleaned value
 */
const cleanMultilineEnv = (envVar: string) => {
	if (!envVar) {
		return envVar; // Do not crash on empty env vars
	}
	return getEnvValue('NODE_ENV', false) === 'local' ? envVar.replace(/\\n/g, '\n') : envVar;
};

const getEnvValue = (name: string, required = true): string => {
	const value = process.env[name];
	if (!value && required && process.env.NODE_ENV !== 'test') {
		throw new NotImplementedException(
			`The environment variable ${name} is not set, but is required to run the service.`
		);
	}
	return value;
};

const config = (): Configuration => {
	const env = getEnvValue('NODE_ENV', false) || DEFAULT_CONFIG.environment;
	return {
		environment: env,
		host: getEnvValue('HOST', true),
		clientHost: getEnvValue('CLIENT_HOST', true),
		port: parseInt(getEnvValue('PORT', false), 10) || DEFAULT_CONFIG.port,
		proxyApiKey: getEnvValue('PROXY_API_KEY', true),
		graphQlUrl: getEnvValue('GRAPHQL_URL', true),
		graphQlSecret: getEnvValue('GRAPHQL_SECRET', env !== 'local'), // Not required on localhost
		graphQlEnableWhitelist: getEnvValue('GRAPHQL_ENABLE_WHITELIST', false) === 'true',
		graphqlUrlAvo: getEnvValue('GRAPHQL_URL_AVO', true),
		graphqlSecretAvo: getEnvValue('GRAPHQL_SECRET_AVO', true),
		graphQlUrlLogging: getEnvValue('GRAPHQL_URL_LOGGING', true),
		graphQlSecretLogging: getEnvValue('GRAPHQL_SECRET_LOGGING', true),
		databaseApplicationType: getEnvValue('DATABASE_APPLICATION_TYPE', true) as AvoOrHetArchief,
		cookieSecret: getEnvValue('COOKIE_SECRET', true),
		cookieMaxAge: parseInt(getEnvValue('COOKIE_MAX_AGE', true), 10),
		redisConnectionString: getEnvValue('REDIS_CONNECTION_STRING', false),
		elasticSearchUrl: getEnvValue('ELASTICSEARCH_URL', true),
		ssumRegistrationPage: getEnvValue('SSUM_REGISTRATION_PAGE', true),
		samlIdpMetaDataEndpoint: getEnvValue('SAML_IDP_META_DATA_ENDPOINT', true),
		samlSpEntityId: getEnvValue('SAML_SP_ENTITY_ID', true),
		samlSpPrivateKey: cleanMultilineEnv(getEnvValue('SAML_SP_PRIVATE_KEY', false)),
		samlSpCertificate: cleanMultilineEnv(getEnvValue('SAML_SP_CERTIFICATE', false)),
		samlMeemooIdpMetaDataEndpoint: getEnvValue('SAML_MEEMOO_IDP_META_DATA_ENDPOINT', true),
		samlMeemooSpEntityId: getEnvValue('SAML_MEEMOO_SP_ENTITY_ID', true),
		corsEnableWhitelist: getEnvValue('CORS_ENABLE_WHITELIST', false) === 'true',
		corsOptions: {
			origin: (origin: string, callback: (err: Error, allow: boolean) => void) => {
				if (getEnvValue('CORS_ENABLE_WHITELIST', false) !== 'true') {
					// whitelist not enabled
					callback(null, true);
				} else if (WHITE_LIST_DOMAINS.indexOf(origin) !== -1 || !origin) {
					// whitelist enabled but not permitted
					callback(null, true);
				} else {
					callback(new ForbiddenException('Request not allowed by CORS'), false);
				}
			},
			credentials: true,
			allowedHeaders:
				'X-Requested-With, Content-Type, authorization, Origin, Accept, cache-control',
			methods: 'GET, POST, OPTIONS, PATCH, PUT, DELETE',
		},
		ticketServiceUrl: getEnvValue('TICKET_SERVICE_URL', true),
		ticketServiceCertificate: cleanMultilineEnv(getEnvValue('TICKET_SERVICE_CERT', true)),
		ticketServiceKey: cleanMultilineEnv(getEnvValue('TICKET_SERVICE_KEY', true)),
		ticketServicePassphrase: getEnvValue('TICKET_SERVICE_PASSPHRASE', true),
		ticketServiceMaxAge: parseInt(getEnvValue('TICKET_SERVICE_MAXAGE', true), 10),
		mediaServiceUrl: getEnvValue('MEDIA_SERVICE_URL', true),
		enableSendEmail: getEnvValue('ENABLE_SEND_EMAIL', true) === 'true',
		campaignMonitorApiEndpoint: getEnvValue('CAMPAIGN_MONITOR_API_ENDPOINT', false),
		campaignMonitorApiKey: getEnvValue('CAMPAIGN_MONITOR_API_KEY', false),
		campaignMonitorTemplateVisitRequestCp: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP',
			false
		),
		campaignMonitorTemplateVisitApproved: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED',
			false
		),
		campaignMonitorTemplateVisitDenied: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED',
			false
		),
		assetServerEndpoint: getEnvValue('ASSET_SERVER_ENDPOINT', true),
		assetServerTokenEndpoint: getEnvValue('ASSET_SERVER_TOKEN_ENDPOINT', true),
		assetServerTokenSecret: getEnvValue('ASSET_SERVER_TOKEN_SECRET', true),
		assetServerTokenPassword: getEnvValue('ASSET_SERVER_TOKEN_PASSWORD', true),
		assetServerTokenUsername: getEnvValue('ASSET_SERVER_TOKEN_USERNAME', true),
		assetServerBucketName: getEnvValue('ASSET_SERVER_BUCKET_NAME', true),
		tempAssetFolder: getEnvValue('TEMP_ASSET_FOLDER', false) || '/tmp',
		multerOptions: {
			dest: getEnvValue('TEMP_ASSET_FOLDER', false) || '/tmp',
			limits: {
				fileSize: 2_000_000, // 2 MB
			},
			fileFilter: (req, file, cb) => cb(null, VALID_MIME_TYPES.includes(file.mimetype)),
		},
		meemooAdminOrganizationIds: (getEnvValue('MEEMOO_ADMIN_ORGANIZATION_IDS', true) || '')
			.split(',')
			.map((orgId) => orgId.trim()),
		rerouteEmailsTo: getEnvValue('REROUTE_EMAILS_TO', false),
		ignoreObjectLicenses: getEnvValue('IGNORE_OBJECT_LICENSES', false) === 'true',
		organizationsApiV2Url: getEnvValue('ORGANIZATIONS_API_V2_URL', true),
		elasticsearchLogQueries: getEnvValue('ELASTICSEARCH_LOG_QUERIES', false) === 'true',
		graphqlLogQueries: getEnvValue('GRAPHQL_LOG_QUERIES', false) === 'true',
		clientApiKey: getEnvValue('CLIENT_API_KEY', true),
	};
};

export function getConfig(configService: ConfigService, prop: keyof Configuration) {
	return configService.get(prop);
}

export default config;

export * from './config.const';
export * from './config.types';
