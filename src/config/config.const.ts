import Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'test').default('local'),
	PORT: Joi.number().default(3000),
	GRAPHQL_URL: Joi.string().required(),
	GRAPHQL_SECRET: Joi.string().required(),
	GRAPHQL_ENABLE_WHITELIST: Joi.boolean().default(true),
});

export const DEFAULT_CONFIG = {
	port: 3000,
};
