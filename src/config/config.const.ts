import Joi from 'joi';

export const configValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'test').default('local'),
	PORT: Joi.number().default(3000),
});

export const DEFAULT_CONFIG = {
	port: 3000,
};
