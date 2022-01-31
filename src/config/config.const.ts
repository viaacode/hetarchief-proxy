import Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'test').default('local'),
	HOST: Joi.string(),
	PORT: Joi.number().default(3000),
	GRAPHQL_URL: Joi.string().required(),
	GRAPHQL_SECRET: Joi.string().allow(''),
	GRAPHQL_ENABLE_WHITELIST: Joi.boolean().default(true),
	COOKIE_SECRET: Joi.string(),
	COOKIE_MAX_AGE: Joi.number().default(86400000),
	REDIS_CONNECTION_STRING: Joi.string().allow(''),
	SAML_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_SP_ENTITY_ID: Joi.string(),
	SAML_SP_PRIVATE_KEY: Joi.string().allow(''),
	SAML_SP_CERTIFICATE: Joi.string().allow(''),
	SAML_MEEMOO_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_MEEMOO_SP_ENTITY_ID: Joi.string(),
});

export const DEFAULT_CONFIG = {
	port: 3000,
	environment: 'local',
};
