import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import connectRedis from 'connect-redis';
import { CronJob } from 'cron';
import session from 'express-session';
import { createClient, RedisClient } from 'redis';
import SessionFileStore from 'session-file-store';

const FileStore = SessionFileStore(session);

@Injectable()
export class SessionService {
	private readonly logger = new Logger(SessionService.name);

	constructor(
		private configService: ConfigService,
		private schedulerRegistry: SchedulerRegistry
	) {}

	public async clearRedis(redisClient: RedisClient) {
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
	}

	/**
	 * Returns the session config for the express session middleware
	 */
	public async getSessionConfig(): Promise<session.SessionOptions> {
		const environment = this.configService.get('environment');
		const cookieSecret = this.configService.get('cookieSecret');
		const cookieMaxAge = this.configService.get('cookieMaxAge');
		const redisConnectionString = this.configService.get('redisConnectionString');

		const isProduction = environment !== 'local' && environment !== 'test';

		this.logger.log('Session config: ', { environment, redisConnectionString, isProduction });

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
			this.logger.log('isProduction: initializing Redis Store...');
			// We only set a session cookie
			// For cross-site usage: sameSite should be set to 'none' and secure must be true
			// In this case, session cookie, cross-site usage seems irrelevant
			// We also can't set secure cookies for some reason
			// (probably the express server runs on http and https is terminated elsewhere)

			const redisStore = connectRedis(session);
			const redisClient = createClient({
				url: redisConnectionString,
			});

			redisClient.on('error', (err) => this.logger.error('Redis Client Error', err.stack));
			redisClient.on('connect', () => this.logger.log('Connected to redis successfully'));

			const job = new CronJob(`0 0 05 * * *`, () => this.clearRedis(redisClient));

			this.schedulerRegistry.addCronJob('FlushRedis', job);
			job.start();

			sessionConfig.store = new redisStore({ client: redisClient });

			this.logger.log('isProduction: Redis Store ready');
		} else {
			sessionConfig.store = new FileStore({});
			this.logger.log('isDevelopment: File Store ready');
		}

		return sessionConfig;
	}
}
