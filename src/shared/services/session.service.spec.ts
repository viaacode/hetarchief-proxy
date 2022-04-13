import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { TestingLogger } from '~shared/logging/test-logger';
import { SessionService } from '~shared/services/session.service';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'environment') {
			return 'production';
		}
		if (key === 'cookieSecret') {
			return 'thecookiesecret';
		}
		if (key === 'cookieMaxAge') {
			return '86400';
		}
		if (key === 'redisConnectionString') {
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
			expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
			mockSchedulerRegistry.addCronJob.mockClear();
		});
	});

	describe('clearRedis', () => {
		it('should clear the redis cache', async () => {
			const flushdb = jest.fn((callback: (err: any, response: 'OK') => void) =>
				callback(null, 'OK')
			);
			await sessionService.clearRedis({ flushdb } as unknown as any);
			expect(flushdb).toHaveBeenCalledTimes(1);
		});

		it('should handle errors during clearing the redis cache', async () => {
			const flushdb = jest.fn((callback: (err: any, response?: 'OK') => void) =>
				callback('error during cache clear')
			);
			await sessionService.clearRedis({ flushdb } as unknown as any);
			expect(flushdb).toHaveBeenCalledTimes(1);
		});
	});
});
