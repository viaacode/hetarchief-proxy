import { Test, TestingModule } from '@nestjs/testing';
import { addMonths } from 'date-fns';

import { NotificationsService } from './notifications.service';

import { DataService } from '~modules/data/services/data.service';
import { mockGqlNotification } from '~modules/notifications/services/__mocks__/app_notification';
import { NotificationStatus, NotificationType } from '~modules/notifications/types';

const mockGqlNotification1 = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	status: NotificationStatus.UNREAD,
	recipient: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	visit_id: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	created_at: '2022-02-28T17:21:58.937169+00:00',
	updated_at: '2022-02-28T17:21:58.937169',
	notification_type: NotificationType.VISIT_REQUEST_APPROVED,
	show_at: '2022-02-28T17:29:53.478639',
};

const mockGqlNotification2 = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: '84056059-c9fe-409b-844e-e7ce606c6212',
	status: NotificationStatus.UNREAD,
	recipient: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	visit_id: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	created_at: '2022-02-25T17:21:58.937169+00:00',
	updated_at: '2022-02-25T17:21:58.937169',
	notification_type: NotificationType.VISIT_REQUEST_APPROVED,
	show_at: '2022-02-25T17:29:53.478639',
};

const mockGqlNotificationsResult = {
	data: {
		app_notification: [mockGqlNotification1, mockGqlNotification2],
		app_notification_aggregate: {
			aggregate: {
				count: 2,
			},
		},
	},
};

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

describe('NotificationsService', () => {
	let notificationsService: NotificationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NotificationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		notificationsService = module.get<NotificationsService>(NotificationsService);
	});

	it('services should be defined', () => {
		expect(notificationsService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a graphql notification response to our notification interface', () => {
			const adapted = notificationsService.adaptNotification(mockGqlNotification);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlNotification.id);
			expect(adapted.showAt).toEqual(mockGqlNotification.show_at);
			expect(adapted.notificationType).toEqual(mockGqlNotification.notification_type);
		});
	});

	describe('findByUser', () => {
		it('returns a paginated response with all notifications for a user', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlNotificationsResult);
			const response = await notificationsService.findNotificationsByUser(
				mockGqlNotificationsResult.data.app_notification[0].recipient,
				addMonths(new Date(), -1).toISOString(),
				1,
				20
			);
			expect(response.items.length).toBe(2);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(2);
		});
	});

	describe('create', () => {
		it('can create a new notification', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					insert_app_notification: {
						returning: [mockGqlNotification1],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			const response = await notificationsService.create(mockNotification);
			expect(response.id).toBe(mockGqlNotification1.id);
		});
	});

	describe('createForMultipleRecipients', () => {
		it('can create multiple notifications for multiple recipients', async () => {
			mockDataService.execute.mockResolvedValue({
				data: {
					insert_app_notification: {
						returning: [mockGqlNotification1],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, recipient, ...mockNotification } =
				mockGqlNotification1;
			const response = await notificationsService.createForMultipleRecipients(
				mockNotification,
				[recipient, recipient]
			);
			expect(response).toHaveLength(2);
		});
	});

	describe('update', () => {
		it('can update a notification', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_app_notification: {
						returning: [mockGqlNotification1],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			const response = await notificationsService.update(id, mockUser.id, mockNotification);
			expect(response.id).toBe(mockGqlNotification1.id);
		});

		it('should not update a notification if you are not the recipient', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_app_notification: {
						returning: [],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			let error;
			try {
				await notificationsService.update(id, mockUser.id, mockNotification);
			} catch (err) {
				error = err;
			}
			expect(error.response).toEqual({
				statusCode: 404,
				message: 'Notification not found or you are not the notifications recipient.',
				error: 'Not Found',
			});
		});
	});
});
