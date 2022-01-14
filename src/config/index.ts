import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

const config = (): Configuration => ({
	port: parseInt(process.env.PORT, 10) || DEFAULT_CONFIG.port,
	host: process.env.HOST,
	samlIdpMetaDataEndpoint: process.env.SAML_IDP_META_DATA_ENDPOINT,
	samlSpEntityId: process.env.SAML_SP_ENTITY_ID,
	samlSpPrivateKey: process.env.SAML_SP_PRIVATE_KEY,
	samlSpCertificate: process.env.SAML_SP_CERTIFICATE,
});

export default config;

export * from './config.const';
export * from './config.types';
