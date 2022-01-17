import Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'test').default('local'),
	HOST: Joi.string(),
	PORT: Joi.number().default(3000),
	GRAPHQL_URL: Joi.string().required(),
	GRAPHQL_SECRET: Joi.string().required(),
	GRAPHQL_ENABLE_WHITELIST: Joi.boolean().default(true),
	SAML_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_SP_ENTITY_ID: Joi.string(),
	SAML_SP_PRIVATE_KEY: Joi.string().allow(''),
	SAML_SP_CERTIFICATE: Joi.string().allow(''),
	SAML_MEEMOO_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_MEEMOO_SP_ENTITY_ID: Joi.string(),
	SAML_MEEMOO_SP_PRIVATE_KEY: Joi.string().allow(''),
	SAML_MEEMOO_SP_CERTIFICATE: Joi.string().allow(''),
});

export const DEFAULT_CONFIG = {
	port: 3000,
};
