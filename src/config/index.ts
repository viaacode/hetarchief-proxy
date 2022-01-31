import { UnauthorizedException } from '@nestjs/common';

import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

const WHITE_LIST_DOMAINS = ['http://localhost:3000'];

const config = (): Configuration => ({
	environment: process.env.NODE_ENV || DEFAULT_CONFIG.environment,
	host: process.env.HOST,
	port: parseInt(process.env.PORT, 10) || DEFAULT_CONFIG.port,
	graphQlUrl: process.env.GRAPHQL_URL,
	graphQlSecret: process.env.GRAPHQL_URL,
	graphQlEnableWhitelist: process.env.GRAPHQL_ENABLE_WHITELIST === 'true',
	cookieSecret: process.env.COOKIE_SECRET,
	cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE, 10),
	redisConnectionString: process.env.REDIS_CONNECTION_STRING,
	samlIdpMetaDataEndpoint: process.env.SAML_IDP_META_DATA_ENDPOINT,
	samlSpEntityId: process.env.SAML_SP_ENTITY_ID,
	samlSpPrivateKey: process.env.SAML_SP_PRIVATE_KEY,
	samlSpCertificate: process.env.SAML_SP_CERTIFICATE,
	samlMeemooIdpMetaDataEndpoint: process.env.SAML_MEEMOO_IDP_META_DATA_ENDPOINT,
	samlMeemooSpEntityId: process.env.SAML_MEEMOO_SP_ENTITY_ID,
	corsEnableWhitelist: process.env.CORS_ENABLE_WHITELIST === 'true',
	corsOptions: {
		origin: (origin: string, callback: (err: Error, allow: boolean) => void) => {
			if (process.env.CORS_ENABLE_WHITELIST !== 'true') {
				// whitelist not enabled
				callback(null, true);
			} else if (WHITE_LIST_DOMAINS.indexOf(origin) !== -1 || !origin) {
				// whitelist enabled but not permitted
				callback(null, true);
			} else {
				callback(new UnauthorizedException('Request ot allowed by CORS'), false);
			}
		},
		credentials: true,
		allowedHeaders:
			'X-Requested-With, Content-Type, authorization, Origin, Accept, cache-control',
		methods: 'GET, POST, OPTIONS, PUT, DELETE',
	},
});

export default config;

export * from './config.const';
export * from './config.types';
