import { Logger } from '@nestjs/common';
import connectRedis from 'connect-redis';
import session from 'express-session';
import cron from 'node-cron';
import { createClient } from 'redis';

export class SessionConfig {
	private logger: Logger = new Logger('SessionConfig', { timestamp: true });

	public async get(
		environment: string,
		cookieSecret: string,
		cookieMaxAge: number,
		redisConnectionString: string = null
	): Promise<session.SessionOptions> {
		this.logger.log('SESSION config input: ', {
			environment,
			cookieSecret,
			cookieMaxAge,
			redisConnectionString,
		});

		// const isProduction = environment !== 'local' && environment !== 'test';
		const isProduction = environment === 'local';

		const sessionConfig: session.SessionOptions = {
			resave: false, // Postgres session provider doesn't need to resave the session every time
			saveUninitialized: false, // Do not create a session for users that are not logged in, neither for health checks
			cookie: {
				httpOnly: false,
				maxAge: cookieMaxAge || 24 * 60 * 60 * 1000, // 24h
				sameSite: false,
				secure: false,
			},
			secret: cookieSecret || '',
		};

		if (isProduction) {
			// Enable cross-site usage: set sameSite to 'none'
			// if samesite is set to 'none', secure must be true. This is not required for local development.
			sessionConfig.cookie = {
				...sessionConfig.cookie,
				sameSite: 'none',
				secure: true,
			};

			const redisStore = connectRedis(session);
			const redisClient = createClient({
				url: redisConnectionString,
			});

			redisClient.on('error', (err) => this.logger.error('Redis Client Error', err.stack));
			redisClient.on('connect', (err) => this.logger.log('Connected to redis successfully'));

			const clearRedis = async () => {
				try {
					redisClient.flushdb((err: Error | null, response?: 'OK') => {
						if (err) {
							this.logger.error('Failed to clear redis session cache', err.stack);
						}
						this.logger.log(`Redis clear session cache response: ${response}`);
					});
				} catch (e) {
					this.logger.error('Redis session cache could not be cleared', e.stack);
				}
			};

			// schedule cron to flush sessions
			// cron.schedule('0 0 05 * * *', clearRedis, {
			cron.schedule('* * * * *', clearRedis, {
				scheduled: true,
				timezone: 'Europe/Brussels',
			}).start();

			sessionConfig.store = new redisStore({ client: redisClient });
		}

		return sessionConfig;
	}
}
