import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { EventsService } from '../services/events.service';
import { LogEventType } from '../types';

import { EventsController } from './events.controller';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockUser: User = {
	id: '0f5e3c9d-cf2a-4213-b888-dbf69b773c8e',
	firstName: 'Tom',
	lastName: 'Testerom',
	fullName: 'Test Testers',
	email: 'test@studiohyperdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

describe('EventsController', () => {
	let eventsController: EventsController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [EventsController],
			providers: [
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
			],
		}).compile();

		eventsController = module.get<EventsController>(EventsController);
	});

	it('should be defined', () => {
		expect(eventsController).toBeDefined();
	});

	describe('sendEvent', () => {
		it('should send log events', async () => {
			const result = eventsController.sendEvent(
				{ path: '/events' } as unknown as Request,
				new SessionUserEntity(mockUser),
				{ type: LogEventType.USER_AUTHENTICATE }
			);
			expect(result).toBeTruthy();
		});
	});
});
