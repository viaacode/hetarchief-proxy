import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { createClient, RedisClient } from 'redis';
import SessionFileStore from 'session-file-store';

import { Configuration } from '~config';

const FileStore = SessionFileStore(session);

@Injectable()
export class SessionService {
	private readonly logger = new Logger(SessionService.name);
	private redisClient: RedisClient;

	constructor(private configService: ConfigService<Configuration>) {}

	public async clearRedis(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				if (!this.redisClient) {
					throw new InternalServerErrorException(
						'Failed to clear redis session cache because redisClient was not initialised'
					);
				}
				this.redisClient.flushdb((err: Error | null, response?: 'OK') => {
					if (err) {
						this.logger.error('Failed to clear redis session cache', err.stack);
						reject(err);
					}
					this.logger.log(`Redis clear session cache response: ${response}`);
					resolve();
				});
			} catch (e) {
				this.logger.error('Redis session cache could not be cleared', e.stack);
				reject(e);
			}
		});
	}

	/**
	 * Returns the session config for the express session middleware
	 */
	public async getSessionConfig(): Promise<session.SessionOptions> {
		const environment = this.configService.get('ENVIRONMENT');
		const cookieSecret = this.configService.get('COOKIE_SECRET');
		const cookieMaxAge = this.configService.get('COOKIE_MAX_AGE');
		const redisConnectionString = this.configService.get('REDIS_CONNECTION_STRING');

		const isProduction = environment !== 'local' && environment !== 'test';

		this.logger.log('Session config: ', { environment, redisConnectionString, isProduction });

		const sessionConfig: session.SessionOptions = {
			resave: false, // Postgres session provider doesn't need to resave the session every time
			saveUninitialized: false, // Do not create a session for users that are not logged in, neither for health checks
			name: 'connect.sid.hetarchief', // Avoid conflicts with the avo cookie
			cookie: {
				httpOnly: false,
				maxAge: cookieMaxAge || 24 * 60 * 60 * 1000, // 24h
				sameSite: false,
				secure: false,
			},
			secret: cookieSecret || '',
		};

		if (isProduction) {
			this.logger.log('isProduction: initializing Redis Store...');
			// We only set a session cookie
			// For cross-site usage: sameSite should be set to 'none' and secure must be true
			// In this case, session cookie, cross-site usage seems irrelevant
			// We also can't set secure cookies for some reason
			// (probably the express server runs on http and https is terminated elsewhere)

			const redisStore = connectRedis(session);
			this.redisClient = createClient({
				url: redisConnectionString,
			});

			this.redisClient.on('error', (err) =>
				this.logger.error('Redis Client Error', err.stack)
			);
			this.redisClient.on('connect', () =>
				this.logger.log('Connected to redis successfully')
			);

			sessionConfig.store = new redisStore({ client: this.redisClient });

			this.logger.log('isProduction: Redis Store ready');
		} else if (process.platform !== 'win32') {
			// Windows doesn't handle multithreaded file access very well
			sessionConfig.store = new FileStore({});
			this.logger.log('isDevelopment: File Store ready');
		}

		return sessionConfig;
	}
}
