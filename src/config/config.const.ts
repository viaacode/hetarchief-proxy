import Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'test', 'development', 'production').default('local'),
	HOST: Joi.string(),
	PORT: Joi.number().default(3000),
	PROXY_API_KEY: Joi.string().required(),
	GRAPHQL_URL: Joi.string().required(),
	GRAPHQL_SECRET: Joi.string().allow(''),
	GRAPHQL_ENABLE_WHITELIST: Joi.boolean().default(true),
	COOKIE_SECRET: Joi.string(),
	COOKIE_MAX_AGE: Joi.number().default(86400000),
	REDIS_CONNECTION_STRING: Joi.string().allow(''),
	ELASTICSEARCH_URL: Joi.string().required(),
	SAML_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_SP_ENTITY_ID: Joi.string(),
	SAML_SP_PRIVATE_KEY: Joi.string().allow(''),
	SAML_SP_CERTIFICATE: Joi.string().allow(''),
	SAML_MEEMOO_IDP_META_DATA_ENDPOINT: Joi.string(),
	SAML_MEEMOO_SP_ENTITY_ID: Joi.string(),
	TICKET_SERVICE_URL: Joi.string(),
	TICKET_SERVICE_CERT: Joi.string(),
	TICKET_SERVICE_KEY: Joi.string(),
	TICKET_SERVICE_PASSPHRASE: Joi.string(),
	TICKET_SERVICE_MAXAGE: Joi.number().default(14401),
	MEDIA_SERVICE_URL: Joi.string(),
	ENABLE_SEND_EMAIL: Joi.boolean().default(false),
	CAMPAIGN_MONITOR_API_ENDPOINT: Joi.string().allow(''),
	CAMPAIGN_MONITOR_API_KEY: Joi.string().allow(''),
	CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED: Joi.string().allow(''),
	CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED: Joi.string().allow(''),
});

export const DEFAULT_CONFIG = {
	port: 3000,
	environment: 'local',
};
