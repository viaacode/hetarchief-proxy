import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, type TestingModule } from '@nestjs/testing';
import type { CookieOptions } from 'express-session';
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';

import { TestingLogger } from '~shared/logging/test-logger';
import { SessionService } from '~shared/services/session.service';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockSchedulerRegistry: Partial<Record<keyof SchedulerRegistry, MockInstance>> = {
	addCronJob: vi.fn(),
};

const mockCronJob = {
	start: vi.fn(),
};

vi.mock('cron', () => ({
	CronJob: vi.fn(() => mockCronJob),
}));

const mockRedisClient = {
	isReady: false,
	on: vi.fn(),
	destroy: vi.fn(),
	connect: vi.fn().mockResolvedValue(undefined),
	flushDb: vi.fn().mockResolvedValue('OK'),
};

vi.mock('redis', () => ({
	createClient: vi.fn(() => mockRedisClient),
}));

vi.mock('connect-redis', () => ({
	RedisStore: vi.fn(),
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
			const response = await sessionService.getSessionConfig();
			expect(response.secret).toEqual('thecookiesecret');
			expect((response.cookie as CookieOptions).maxAge).toEqual('86400');
			expect(response.resave).toEqual(false);
			expect(mockRedisClient.connect).toHaveBeenCalled();
		});

		it('should not use redis when no connection string is configured', async () => {
			mockConfigService.get.mockImplementationOnce((key: string) =>
				key === 'REDIS_CONNECTION_STRING' ? '' : key
			);
			mockRedisClient.connect.mockClear();

			const response = await sessionService.getSessionConfig();
			expect(mockRedisClient.connect).not.toHaveBeenCalled();
			expect(response.store).toBeDefined(); // session-file-store
		});

		it('should throw when redis cannot be reached', async () => {
			vi.useFakeTimers();
			mockRedisClient.connect.mockReturnValueOnce(new Promise(() => {})); // never connects
			mockRedisClient.destroy.mockClear();

			const sessionConfigPromise = sessionService.getSessionConfig();
			const assertion = expect(sessionConfigPromise).rejects.toThrow('Could not connect to redis');
			await vi.advanceTimersByTimeAsync(10_000);
			await assertion;
			expect(mockRedisClient.destroy).toHaveBeenCalled();
			vi.useRealTimers();
		});
	});

	describe('clearRedis', () => {
		it('should flush the redis database', async () => {
			await sessionService.clearRedis();
			expect(mockRedisClient.flushDb).toHaveBeenCalled();
		});
	});
});
