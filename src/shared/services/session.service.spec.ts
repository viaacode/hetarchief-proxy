import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, type TestingModule } from '@nestjs/testing';

import { type Configuration } from '~config';

import { TestingLogger } from '~shared/logging/test-logger';
import { SessionService } from '~shared/services/session.service';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'ENVIRONMENT') {
			return 'production';
		}
		if (key === 'COOKIE_SECRET') {
			return 'thecookiesecret';
		}
		if (key === 'COOKIE_MAX_AGE') {
			return '86400';
		}
		if (key === 'REDIS_CONNECTION_STRING') {
			return 'redis connection string';
		}
		return key;
	}),
};

const mockSchedulerRegistry: Partial<Record<keyof SchedulerRegistry, jest.SpyInstance>> = {
	addCronJob: jest.fn(),
};

const mockCronJob = {
	start: jest.fn(),
};

jest.mock('cron', () => ({
	CronJob: jest.fn(() => mockCronJob),
}));

describe('SessionService', () => {
	let sessionService: SessionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SessionService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: SchedulerRegistry,
					useValue: mockSchedulerRegistry,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		sessionService = module.get<SessionService>(SessionService);
	});

	it('services should be defined', () => {
		expect(sessionService).toBeDefined();
	});

	describe('getSessionConfig', () => {
		it('should return the session config', async () => {
			jest.mock('connect-redis', () => {
				return {
					default: jest.fn(() => {
						return jest.fn(); // RedisStore
					}),
				};
			});

			const response = await sessionService.getSessionConfig();
			expect(response.secret).toEqual('thecookiesecret');
			expect(response.cookie.maxAge).toEqual('86400');
			expect(response.resave).toEqual(false);
		});
	});

	describe('clearRedis', () => {
		it('should throw an error when the redis client is not set', async () => {
			let error: any;
			try {
				await sessionService.clearRedis();
			} catch (err) {
				error = err;
			}
			expect(error?.response).toEqual({
				statusCode: 500,
				message:
					'Failed to clear redis session cache because redisClient was not initialised',
				error: 'Internal Server Error',
			});
		});
	});
});
