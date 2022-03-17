import { Test, TestingModule } from '@nestjs/testing';
import { addMonths } from 'date-fns';

import { NotificationsService } from './notifications.service';

import { DataService } from '~modules/data/services/data.service';
import { mockGqlNotification } from '~modules/notifications/services/__mocks__/app_notification';
import { Notification, NotificationStatus, NotificationType } from '~modules/notifications/types';
import { AudienceType, Space } from '~modules/spaces/types';
import { User } from '~modules/users/types';
import { Visit, VisitStatus } from '~modules/visits/types';
import { Idp } from '~shared/auth/auth.types';

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
	type: NotificationType.VISIT_REQUEST_APPROVED,
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
	type: NotificationType.VISIT_REQUEST_APPROVED,
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

const mockNotification: Notification = {
	id: 'bfcae082-2370-4a2b-9f66-a55c869addfb',
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd 13',
	status: NotificationStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-25T17:21:58.937169+00:00',
	updatedAt: '2022-02-28T17:54:59.894586',
	type: NotificationType.VISIT_REQUEST_APPROVED,
	readingRoomId: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '2022-01-24T17:21:58.937169+00:00',
	permissions: ['CREATE_COLLECTION'],
	idp: Idp.HETARCHIEF,
};

const mockVisit: Visit = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	spaceName: 'VRT',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 7',
	status: VisitStatus.PENDING,
	startAt: '2022-03-03T16:00:00',
	endAt: '2022-03-03T17:00:00',
	createdAt: '2022-02-11T15:28:40.676',
	updatedAt: '2022-02-11T15:28:40.676',
	visitorName: 'Marie Odhiambo',
	visitorMail: 'marie.odhiambo@example.com',
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	note: {
		id: 'a40b8cd7-5973-41ee-8134-c0451ef7fb6a',
		note: 'test note',
		createdAt: '2022-01-24T17:21:58.937169+00:00',
		updatedAt: '2022-01-24T17:21:58.937169+00:00',
		authorName: 'Test Testers',
	},
	updatedById: null,
	updatedByName: null,
};

const mockSpace: Space = {
	id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
	maintainerId: 'OR-154dn75',
	name: 'Amsab-ISG',
	description:
		'Amsab-ISG is het Instituut voor Sociale Geschiedenis. Het bewaart, ontsluit, onderzoekt en valoriseert het erfgoed van sociale en humanitaire bewegingen.',
	serviceDescription: null,
	image: null,
	color: null,
	logo: 'https://assets.viaa.be/images/OR-154dn75',
	audienceType: AudienceType.PUBLIC,
	publicAccess: false,
	contactInfo: {
		email: null,
		telephone: null,
		address: {
			street: 'Pijndersstraat 28',
			postalCode: '9000',
			locality: 'Gent',
			postOfficeBoxNumber: null,
		},
	},
	isPublished: false,
	publishedAt: null,
	createdAt: '2022-01-13T13:10:14.41978',
	updatedAt: '2022-01-13T13:10:14.41978',
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
		it('should adapt a graphql notification response to our notification interface', () => {
			const adapted = notificationsService.adaptNotification(mockGqlNotification);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlNotification.id);
			expect(adapted.type).toEqual(mockGqlNotification.type);
			expect(adapted.visitId).toEqual(mockGqlNotification.visit_id);
		});
		it('should return undefined in the gql notification is undefined', () => {
			const adapted = notificationsService.adaptNotification(undefined);
			expect(adapted).toBeUndefined();
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
			const response = await notificationsService.create([mockNotification]);
			expect(response[0].id).toBe(mockGqlNotification1.id);
		});
	});

	describe('createForMultipleRecipients', () => {
		it('can create multiple notifications for multiple recipients', async () => {
			const createNotificationsSpy = jest
				.spyOn(notificationsService, 'create')
				.mockResolvedValueOnce([mockNotification, mockNotification]);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, recipient, ...createNotification } =
				mockGqlNotification1;
			const response = await notificationsService.createForMultipleRecipients(
				createNotification,
				[recipient, recipient]
			);
			expect(response).toHaveLength(2);
			createNotificationsSpy.mockRestore();
		});
	});

	describe('onCreateVisit', () => {
		it('should send a notification about a visit request creation', async () => {
			const createForMultipleRecipientsSpy = jest
				.spyOn(notificationsService, 'createForMultipleRecipients')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onCreateVisit(
				mockVisit,
				[mockUser.id],
				mockUser
			);

			expect(response).toHaveLength(1);
			expect(response[0].status).toEqual(NotificationStatus.UNREAD);
			createForMultipleRecipientsSpy.mockRestore();
		});
	});

	describe('onApproveVisitRequest', () => {
		it('should send a notification about a visit request approval', async () => {
			const createNotificationSpy = jest
				.spyOn(notificationsService, 'create')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onApproveVisitRequest(
				mockVisit,
				mockSpace,
				mockUser
			);

			expect(response.status).toEqual(NotificationStatus.UNREAD);
			createNotificationSpy.mockRestore();
		});
	});

	describe('onDenyVisitRequest', () => {
		it('should send a notification about a visit request denial', async () => {
			const createNotificationSpy = jest
				.spyOn(notificationsService, 'create')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onDenyVisitRequest(
				mockVisit,
				mockSpace,
				mockUser
			);

			expect(response.status).toEqual(NotificationStatus.UNREAD);
			createNotificationSpy.mockRestore();
		});
	});

	describe('update', () => {
		it('should update a notification', async () => {
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

	describe('updateAll', () => {
		it('can update all notifications of a specific user', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_app_notification: {
						affectedRows: 5,
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			const affectedRows = await notificationsService.updateAll(
				mockUser.id,
				mockNotification
			);
			expect(affectedRows).toBe(5);
		});
	});
});
