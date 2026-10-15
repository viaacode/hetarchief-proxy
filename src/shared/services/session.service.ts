import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import SessionFileStore from 'session-file-store';

import type { Configuration } from '~config';

const FileStore = SessionFileStore(session);

type RedisClient = ReturnType<typeof createClient>;

const REDIS_CONNECT_TIMEOUT_MS = 10_000;

@Injectable()
export class SessionService {
	private readonly logger = new Logger(SessionService.name);
	private redisClient: RedisClient | undefined;
	private redisConnectPromise: Promise<void> | undefined;

	constructor(private configService: ConfigService<Configuration>) {}

	private getRedisClient(): RedisClient {
		if (!this.redisClient) {
			const redisConnectionString = this.configService.get('REDIS_CONNECTION_STRING');
			this.redisClient = createClient({
				url: redisConnectionString,
			});
			this.redisClient.on('error', (err) => this.logger.error('Redis Client Error', err.stack));
			this.redisClient.on('connect', () => this.logger.log('Connected to redis successfully'));
		}
		return this.redisClient;
	}

	/**
	 * Connects to redis, or throws if redis cannot be reached within REDIS_CONNECT_TIMEOUT_MS
	 * This makes the app fail on startup when redis is misconfigured or down, so the issue is visible in openshift
	 * Once connected, the redis client keeps reconnecting by itself on connection loss
	 */
	private async getConnectedRedisClient(): Promise<RedisClient> {
		const client = this.getRedisClient();
		if (client.isReady) {
			return client;
		}
		if (!this.redisConnectPromise) {
			this.redisConnectPromise = this.connectRedisClient(client);
		}
		await this.redisConnectPromise;
		return client;
	}

	private async connectRedisClient(client: RedisClient): Promise<void> {
		let timeout: NodeJS.Timeout | undefined;
		try {
			await Promise.race([
				client.connect(),
				new Promise((_resolve, reject) => {
					timeout = setTimeout(
						() =>
							reject(
								new Error(
									`Could not connect to redis within ${REDIS_CONNECT_TIMEOUT_MS / 1000} seconds`
								)
							),
						REDIS_CONNECT_TIMEOUT_MS
					);
				}),
			]);
		} catch (err) {
			// Stop the client from retrying in the background
			client.destroy();
			this.redisClient = undefined;
			this.redisConnectPromise = undefined;
			throw err;
		} finally {
			clearTimeout(timeout);
		}
	}

	public async clearRedis(): Promise<void> {
		try {
			const response = await (await this.getConnectedRedisClient()).flushDb();
			this.logger.log(`Redis clear session cache response: ${response}`);
		} catch (e) {
			this.logger.error('Failed to clear redis session cache', e.stack);
			throw e;
		}
	}

	/**
	 * Returns the session config for the express session middleware
	 */
	public async getSessionConfig(): Promise<session.SessionOptions> {
		const redisConnectionString = this.configService.get('REDIS_CONNECTION_STRING');
		const cookieSecret = this.configService.get('COOKIE_SECRET');
		const cookieMaxAge = this.configService.get('COOKIE_MAX_AGE');

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

		if (redisConnectionString) {
			// Use redis as session storage when a connection string is configured (always the case on the servers)
			// We only set a session cookie
			// For cross-site usage: sameSite should be set to 'none' and secure must be true
			// In this case, session cookie, cross-site usage seems irrelevant
			// We also can't set secure cookies for some reason
			// (probably the express server runs on http and https is terminated elsewhere)

			sessionConfig.store = new RedisStore({ client: await this.getConnectedRedisClient() });
		} else if (process.platform !== 'win32') {
			// Windows doesn't handle multithreaded file access very well
			sessionConfig.store = new FileStore({});
		}
		// Otherwise express-session falls back to its in-memory store

		return sessionConfig;
	}
}
