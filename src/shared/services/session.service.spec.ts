import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, type TestingModule } from '@nestjs/testing';

import { TestingLogger } from '~shared/logging/test-logger';
import { SessionService } from '~shared/services/session.service';
import { mockConfigService } from '~shared/test/mock-config-service';

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
});
