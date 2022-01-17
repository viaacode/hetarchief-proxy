import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

const config = (): Configuration => ({
	host: process.env.HOST,
	port: parseInt(process.env.PORT, 10) || DEFAULT_CONFIG.port,
	graphQlUrl: process.env.GRAPHQL_URL,
	graphQlSecret: process.env.GRAPHQL_URL,
	graphQlEnableWhitelist: process.env.GRAPHQL_ENABLE_WHITELIST === 'true',
	samlIdpMetaDataEndpoint: process.env.SAML_IDP_META_DATA_ENDPOINT,
	samlSpEntityId: process.env.SAML_SP_ENTITY_ID,
	samlSpPrivateKey: process.env.SAML_SP_PRIVATE_KEY,
	samlSpCertificate: process.env.SAML_SP_CERTIFICATE,
	samlMeemooIdpMetaDataEndpoint: process.env.SAML_MEEMOO_IDP_META_DATA_ENDPOINT,
	samlMeemooSpEntityId: process.env.SAML_MEEMOO_SP_ENTITY_ID,
	samlMeemooSpPrivateKey: process.env.SAML_MEEMOO_SP_PRIVATE_KEY,
	samlMeemooSpCertificate: process.env.SAML_MEEMOO_SP_CERTIFICATE,
});

export default config;

export * from './config.const';
export * from './config.types';
