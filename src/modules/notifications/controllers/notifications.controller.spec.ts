import { Test, TestingModule } from '@nestjs/testing';
import { IPagination } from '@studiohyperdrive/pagination';

import { NotificationsService } from '../services/notifications.service';

import { NotificationsController } from './notifications.controller';

import { Notification, NotificationStatus, NotificationType } from '~modules/notifications/types';
import { User } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';

const mockNotification1: Notification = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	status: NotificationStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-28T17:21:58.937169+00:00',
	updatedAt: '2022-02-28T17:21:58.937169',
	type: NotificationType.VISIT_REQUEST_APPROVED,
	showAt: '2022-02-28T17:29:53.478639',
};

const mockNotification2: Notification = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: '84056059-c9fe-409b-844e-e7ce606c6212',
	status: NotificationStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-25T17:21:58.937169+00:00',
	updatedAt: '2022-02-25T17:21:58.937169',
	type: NotificationType.VISIT_REQUEST_APPROVED,
	showAt: '2022-02-25T17:29:53.478639',
};

const mockNotificationsResponse: IPagination<Notification> = {
	items: [mockNotification1, mockNotification2],
	total: 2,
	pages: 1,
	page: 1,
	size: 20,
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
};

const mockNotificationsService: Partial<Record<keyof NotificationsService, jest.SpyInstance>> = {
	findNotificationsByUser: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
};

describe('NotificationsController', () => {
	let notificationsController: NotificationsController;
	let sessionHelperSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotificationsController],
			imports: [],
			providers: [
				{
					provide: NotificationsService,
					useValue: mockNotificationsService,
				},
			],
		}).compile();

		notificationsController = module.get<NotificationsController>(NotificationsController);

		sessionHelperSpy = jest
			.spyOn(SessionHelper, 'getArchiefUserInfo')
			.mockReturnValue(mockUser);
	});

	afterEach(async () => {
		sessionHelperSpy.mockRestore();
	});

	it('should be defined', () => {
		expect(notificationsController).toBeDefined();
	});

	describe('getNotifications', () => {
		it('should return all notifications for a specific user', async () => {
			mockNotificationsService.findNotificationsByUser.mockResolvedValueOnce(
				mockNotificationsResponse
			);
			const notifications = await notificationsController.getNotifications(
				{ page: 1, size: 20 },
				{}
			);
			expect(notifications.items.length).toEqual(2);
		});
	});

	describe('markAsRead', () => {
		it('should mark a notification as read', async () => {
			mockNotificationsService.update.mockResolvedValueOnce({
				...mockNotification1,
				status: NotificationStatus.READ,
			});
			const notification = await notificationsController.markAsRead(mockNotification1.id, {});
			expect(notification.id).toEqual(mockNotification1.id);
			expect(notification.status).toEqual(NotificationStatus.READ);
		});
	});
});
