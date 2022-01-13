import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

const config = (): Configuration => ({
	host: process.env.HOST,
	port: parseInt(process.env.PORT, 10) || DEFAULT_CONFIG.port,
	graphQlUrl: process.env.GRAPHQL_URL,
	graphQlSecret: process.env.GRAPHQL_URL,
	graphQlEnableWhitelist: process.env.GRAPHQL_ENABLE_WHITELIST === 'true',
});

export default config;

export * from './config.const';
export * from './config.types';
