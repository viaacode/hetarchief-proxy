import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { LogEventType } from '../types';

import { EventsService } from './events.service';

import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'GRAPHQL_URL_LOGGING') {
			return 'http://localhost/v1/graphql/';
		}
		return key;
	}),
};

const logEvents = [
	{
		id: 'c6b6b80a-94e1-4946-8a76-7dfd687b7243',
		type: LogEventType.ITEM_BOOKMARK,
		source: '/events',
		subject: '0f5e3c9d-cf2a-4213-b888-dbf69b773c8e',
		time: '2022-04-13T08:35:07.666Z',
		data: {
			folderId: '84b9cff3-9dab-423c-b8c4-37ff6da6ce4b',
		},
	},
];

describe('EventsService', () => {
	let eventsService: EventsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EventsService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		eventsService = module.get<EventsService>(EventsService);
	});

	it('services should be defined', () => {
		expect(eventsService).toBeDefined();
	});

	describe('insertEvents', () => {
		it('can insert events', async () => {
			nock('http://localhost/v1/graphql').post('/').reply(201, {});
			const events = await eventsService.insertEvents(logEvents);
			expect(events).toEqual(logEvents);
		});

		it('should catch an error and return the log events in case of error', async () => {
			nock('http://localhost/v1/graphql').post('/').reply(404, {});
			const events = await eventsService.insertEvents(logEvents);
			expect(events).toEqual(logEvents);
		});
	});
});
