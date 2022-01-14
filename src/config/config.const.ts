import Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'test').default('local'),
	PORT: Joi.number().default(3000),
	HOST: Joi.string(),
	SAML_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_SP_ENTITY_ID: Joi.string(),
	SAML_SP_PRIVATE_KEY: Joi.string().allow(''),
	SAML_SP_CERTIFICATE: Joi.string().allow(''),
});

export const DEFAULT_CONFIG = {
	port: 3000,
};
