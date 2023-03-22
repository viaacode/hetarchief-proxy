import { ForbiddenException } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common/exceptions/not-implemented.exception';
import { DatabaseType } from '@viaa/avo2-types';

import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

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
		ENVIRONMENT: env,
		HOST: getEnvValue('HOST', true),
		CLIENT_HOST: getEnvValue('CLIENT_HOST', true),
		PORT: parseInt(getEnvValue('PORT', false), 10) || DEFAULT_CONFIG.port,
		PROXY_API_KEY: getEnvValue('PROXY_API_KEY', true),
		GRAPHQL_URL_HET_ARCHIEF: getEnvValue('GRAPHQL_URL_HET_ARCHIEF', true),
		GRAPHQL_SECRET_HET_ARCHIEF: getEnvValue('GRAPHQL_SECRET_HET_ARCHIEF', env !== 'local'), // Not required on localhost
		GRAPHQL_ENABLE_WHITELIST: getEnvValue('GRAPHQL_ENABLE_WHITELIST', false) === 'true',
		GRAPHQL_URL_LOGGING: getEnvValue('GRAPHQL_URL_LOGGING', true),
		GRAPHQL_SECRET_LOGGING: getEnvValue('GRAPHQL_SECRET_LOGGING', true),
		DATABASE_APPLICATION_TYPE: getEnvValue('DATABASE_APPLICATION_TYPE', true) as DatabaseType,
		COOKIE_SECRET: getEnvValue('COOKIE_SECRET', true),
		COOKIE_MAX_AGE: parseInt(getEnvValue('COOKIE_MAX_AGE', true), 10),
		REDIS_CONNECTION_STRING: getEnvValue('REDIS_CONNECTION_STRING', false),
		ELASTIC_SEARCH_URL: getEnvValue('ELASTICSEARCH_URL', true),
		SSUM_REGISTRATION_PAGE: getEnvValue('SSUM_REGISTRATION_PAGE', true),
		SAML_IDP_META_DATA_ENDPOINT: getEnvValue('SAML_IDP_META_DATA_ENDPOINT', true),
		SAML_SP_ENTITY_ID: getEnvValue('SAML_SP_ENTITY_ID', true),
		SAML_SP_PRIVATE_KEY: cleanMultilineEnv(getEnvValue('SAML_SP_PRIVATE_KEY', false)),
		SAML_SP_CERTIFICATE: cleanMultilineEnv(getEnvValue('SAML_SP_CERTIFICATE', false)),
		SAML_MEEMOO_IDP_META_DATA_ENDPOINT: getEnvValue('SAML_MEEMOO_IDP_META_DATA_ENDPOINT', true),
		SAML_MEEMOO_SP_ENTITY_ID: getEnvValue('SAML_MEEMOO_SP_ENTITY_ID', true),
		CORS_ENABLE_WHITELIST: getEnvValue('CORS_ENABLE_WHITELIST', false) === 'true',
		CORS_OPTIONS: {
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
		TICKET_SERVICE_URL: getEnvValue('TICKET_SERVICE_URL', true),
		TICKET_SERVICE_CERTIFICATE: cleanMultilineEnv(getEnvValue('TICKET_SERVICE_CERT', true)),
		TICKET_SERVICE_KEY: cleanMultilineEnv(getEnvValue('TICKET_SERVICE_KEY', true)),
		TICKET_SERVICE_PASSPHRASE: getEnvValue('TICKET_SERVICE_PASSPHRASE', true),
		TICKET_SERVICE_MAXAGE: parseInt(getEnvValue('TICKET_SERVICE_MAXAGE', true), 10),
		MEDIA_SERVICE_URL: getEnvValue('MEDIA_SERVICE_URL', true),
		ENABLE_SEND_EMAIL: getEnvValue('ENABLE_SEND_EMAIL', true) === 'true',
		CAMPAIGN_MONITOR_API_ENDPOINT: getEnvValue('CAMPAIGN_MONITOR_API_ENDPOINT', false),
		CAMPAIGN_MONITOR_API_KEY: getEnvValue('CAMPAIGN_MONITOR_API_KEY', false),
		CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION: getEnvValue(
			'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION',
			false
		),
		CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT: getEnvValue(
			'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT',
			false
		),
		CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP',
			false
		),
		CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED',
			false
		),
		CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED',
			false
		),
		CAMPAIGN_MONITOR_TEMPLATE_SHARE_FOLDER: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_SHARE_FOLDER',
			false
		),
		CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER',
			false
		),
		CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER: getEnvValue(
			'CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER',
			false
		),
		ASSET_SERVER_ENDPOINT: getEnvValue('ASSET_SERVER_ENDPOINT', true),
		ASSET_SERVER_TOKEN_ENDPOINT: getEnvValue('ASSET_SERVER_TOKEN_ENDPOINT', true),
		ASSET_SERVER_TOKEN_SECRET: getEnvValue('ASSET_SERVER_TOKEN_SECRET', true),
		ASSET_SERVER_TOKEN_PASSWORD: getEnvValue('ASSET_SERVER_TOKEN_PASSWORD', true),
		ASSET_SERVER_TOKEN_USERNAME: getEnvValue('ASSET_SERVER_TOKEN_USERNAME', true),
		ASSET_SERVER_BUCKET_NAME: getEnvValue('ASSET_SERVER_BUCKET_NAME', true),
		TEMP_ASSET_FOLDER: getEnvValue('TEMP_ASSET_FOLDER', false) || '/tmp',
		MULTER_OPTIONS: {
			dest: getEnvValue('TEMP_ASSET_FOLDER', false) || '/tmp',
			limits: {
				fileSize: 2_000_000, // 2 MB
			},
			fileFilter: (req, file, cb) => cb(null, VALID_MIME_TYPES.includes(file.mimetype)),
		},
		MEEMOO_ADMIN_ORGANIZATION_IDS: getEnvValue('MEEMOO_ADMIN_ORGANIZATION_IDS', true) || '',
		REROUTE_EMAILS_TO: getEnvValue('REROUTE_EMAILS_TO', false),
		IGNORE_OBJECT_LICENSES: getEnvValue('IGNORE_OBJECT_LICENSES', false) === 'true',
		ORGANIZATIONS_API_V2_URL: getEnvValue('ORGANIZATIONS_API_V2_URL', true),
		ELASTICSEARCH_LOG_QUERIES: getEnvValue('ELASTICSEARCH_LOG_QUERIES', false) === 'true',
		GRAPHQL_LOG_QUERIES: getEnvValue('GRAPHQL_LOG_QUERIES', false) === 'true',
		CLIENT_API_KEY: getEnvValue('CLIENT_API_KEY', true),
		ZENDESK_ENDPOINT: getEnvValue('ZENDESK_ENDPOINT', true),
		ZENDESK_USERNAME: getEnvValue('ZENDESK_USERNAME', true),
		ZENDESK_TOKEN: getEnvValue('ZENDESK_TOKEN', true),
	};
};

export default config;

export * from './config.const';
export * from './config.types';
