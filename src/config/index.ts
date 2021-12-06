import { DEFAULT_CONFIG } from './config.const';
import { Configuration } from './config.types';

const config = (): Configuration => ({
	port: parseInt(process.env.PORT, 10) || DEFAULT_CONFIG.port,
});

export default config;

export * from './config.const';
export * from './config.types';
