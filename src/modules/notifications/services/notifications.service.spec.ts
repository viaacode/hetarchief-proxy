import { Test, TestingModule } from '@nestjs/testing';
import { addMonths } from 'date-fns';

import { NotificationsService } from './notifications.service';

import {
	InsertNotificationsMutation,
	Lookup_Maintainer_Visitor_Space_Status_Enum,
	Lookup_Schema_Audience_Type_Enum,
	UpdateAllNotificationsForUserMutation,
	UpdateNotificationMutation,
} from '~generated/graphql-db-types-hetarchief';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { DataService } from '~modules/data/services/data.service';
import { mockGqlNotification } from '~modules/notifications/services/__mocks__/app_notification';
import {
	GqlCreateOrUpdateNotification,
	GqlNotification,
	Notification,
	NotificationStatus,
	NotificationType,
} from '~modules/notifications/types';
import { Space } from '~modules/spaces/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Visit, VisitStatus } from '~modules/visits/types';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockGqlNotification1: GqlNotification = {
	id: '1586f042-c61a-46b8-946b-ca2c2ea351ad',
	description: 'Bert2 Verhelst2 wil je leeszaal bezoeken',
	title: 'Er is aan aanvraag om je leeszaal te bezoeken',
	status: NotificationStatus.UNREAD,
	type: NotificationType.NEW_VISIT_REQUEST,
	recipient: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
	visit_id: 'b21e8536-9818-41e0-a1f6-e3596ac75320',
	created_at: '2022-04-08T07:29:36.186644+00:00',
	updated_at: '2022-04-08T07:29:36.186644',
	visitor_space_request: {
		cp_space_id: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		visitor_space: {
			content_partner: {
				schema_identifier: 'OR-1v5bc86',
			},
		},
	},
};

const mockGqlNotification2: GqlNotification = {
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd 00',
	status: NotificationStatus.READ,
	type: NotificationType.VISIT_REQUEST_APPROVED,
	recipient: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	visit_id: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	created_at: '2022-02-28T17:21:58.937169+00:00',
	updated_at: '2022-02-28T17:21:58.937169',
	visitor_space_request: {
		cp_space_id: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		visitor_space: {
			content_partner: {
				schema_identifier: 'OR-1v5bc86',
			},
		},
	},
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
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '2022-01-24T17:21:58.937169+00:00',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

const mockVisit: Visit = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	spaceSlug: 'or-rf5kf25',
	spaceName: 'VRT',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 7',
	status: VisitStatus.PENDING,
	startAt: '2022-03-03T16:00:00',
	endAt: '2022-03-03T17:00:00',
	createdAt: '2022-02-11T15:28:40.676',
	updatedAt: '2022-02-11T15:28:40.676',
	visitorFirstName: 'Marie',
	visitorLastName: 'Odhiambo',
	visitorName: 'Marie Odhiambo',
	visitorMail: 'marie.odhiambo@example.com',
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	note: {
		id: 'a40b8cd7-5973-41ee-8134-c0451ef7fb6a',
		note: 'test note',
		createdAt: '2022-01-24T17:21:58.937169+00:00',
		authorName: 'Test Testers',
	},
	updatedById: null,
	updatedByName: null,
};

const mockSpace: Space = {
	id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
	maintainerId: 'OR-154dn75',
	name: 'Amsab-ISG',
	description: null,
	info: 'Amsab-ISG is het Instituut voor Sociale Geschiedenis. Het bewaart, ontsluit, onderzoekt en valoriseert het erfgoed van sociale en humanitaire bewegingen.',
	serviceDescription: null,
	image: null,
	color: null,
	logo: 'https://assets.viaa.be/images/OR-154dn75',
	audienceType: Lookup_Schema_Audience_Type_Enum.Public,
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
	status: Lookup_Maintainer_Visitor_Space_Status_Enum.Requested,
	publishedAt: null,
	createdAt: '2022-01-13T13:10:14.41978',
	updatedAt: '2022-01-13T13:10:14.41978',
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		sendForVisit: jest.fn().mockResolvedValue(true),
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
				{
					provide: CampaignMonitorService,
					useValue: mockCampaignMonitorService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

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
			const mockData: InsertNotificationsMutation = {
				insert_app_notification: {
					returning: [mockGqlNotification1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			const response = await notificationsService.create([
				mockNotification as Partial<GqlCreateOrUpdateNotification>,
			]);
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
				createNotification as Partial<GqlCreateOrUpdateNotification>,
				[recipient, recipient]
			);
			expect(response).toHaveLength(2);
			createNotificationsSpy.mockRestore();
		});
	});

	describe('onCreateVisit', () => {
		it('should send the email to the first maintainer (recipient) if there is no mail space email', async () => {
			const originalSpaceMail = mockVisit.spaceMail;
			mockVisit.spaceMail = null;

			const createForMultipleRecipientsSpy = jest
				.spyOn(notificationsService, 'createForMultipleRecipients')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onCreateVisit(
				mockVisit,
				[{ id: mockUser.id, email: 'test.testers@meemoo.be' }],
				new SessionUserEntity(mockUser)
			);

			expect(response).toHaveLength(1);
			expect(response[0].status).toEqual(NotificationStatus.UNREAD);
			expect(mockCampaignMonitorService.sendForVisit.mock.calls[0][0].to).toEqual([
				{
					id: 'space-3076ad4b-b86a-49bc-b752-2e1bf34778dc',
					email: 'test.testers@meemoo.be',
				},
			]);
			createForMultipleRecipientsSpy.mockRestore();
			mockCampaignMonitorService.sendForVisit.mockClear();

			mockVisit.spaceMail = originalSpaceMail;
		});

		it('should not send the email if there is no spaceMail and no first recipient', async () => {
			const originalSpaceMail = mockVisit.spaceMail;
			mockVisit.spaceMail = null;

			const createForMultipleRecipientsSpy = jest
				.spyOn(notificationsService, 'createForMultipleRecipients')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onCreateVisit(
				mockVisit,
				[],
				new SessionUserEntity(mockUser)
			);

			expect(response).toHaveLength(1);
			expect(response[0].status).toEqual(NotificationStatus.UNREAD);
			expect(mockCampaignMonitorService.sendForVisit.mock.calls[0][0].to).toEqual([
				{
					id: 'space-3076ad4b-b86a-49bc-b752-2e1bf34778dc',
					email: undefined,
				},
			]);
			createForMultipleRecipientsSpy.mockRestore();
			mockCampaignMonitorService.sendForVisit.mockClear();

			mockVisit.spaceMail = originalSpaceMail;
		});

		it('should send a notification about a visit request creation', async () => {
			const createForMultipleRecipientsSpy = jest
				.spyOn(notificationsService, 'createForMultipleRecipients')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onCreateVisit(
				mockVisit,
				[{ id: mockUser.id, email: 'test.testers@meemoo.be' }],
				new SessionUserEntity(mockUser)
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

			const response = await notificationsService.onApproveVisitRequest(mockVisit, mockSpace);

			expect(response.status).toEqual(NotificationStatus.UNREAD);
			createNotificationSpy.mockRestore();
		});
	});

	describe('onDenyVisitRequest', () => {
		it('should send a notification about a visit request denial', async () => {
			const createNotificationSpy = jest
				.spyOn(notificationsService, 'create')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onDenyVisitRequest(mockVisit, mockSpace);

			expect(response.status).toEqual(NotificationStatus.UNREAD);
			createNotificationSpy.mockRestore();
		});
	});

	describe('onCancelVisitRequest', () => {
		it('should send a notification about a visit request cancellation', async () => {
			const createForMultipleRecipientsSpy = jest
				.spyOn(notificationsService, 'createForMultipleRecipients')
				.mockResolvedValueOnce([mockNotification]);

			const response = await notificationsService.onCancelVisitRequest(
				mockVisit,
				[{ id: mockUser.id, email: 'test.testers@meemoo.be' }],
				new SessionUserEntity(mockUser)
			);

			expect(response).toHaveLength(1);
			expect(response[0].status).toEqual(NotificationStatus.UNREAD);
			createForMultipleRecipientsSpy.mockRestore();
		});
	});

	describe('update', () => {
		it('should update a notification', async () => {
			const mockData: UpdateNotificationMutation = {
				update_app_notification: {
					returning: [mockGqlNotification1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			const response = await notificationsService.update(
				id,
				mockUser.id,
				mockNotification as Partial<GqlCreateOrUpdateNotification>
			);
			expect(response.id).toBe(mockGqlNotification1.id);
		});

		it('should not update a notification if you are not the recipient', async () => {
			const mockData: UpdateNotificationMutation = {
				update_app_notification: {
					returning: [],
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			let error;
			try {
				await notificationsService.update(
					id,
					mockUser.id,
					mockNotification as Partial<GqlCreateOrUpdateNotification>
				);
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
			const mockData: UpdateAllNotificationsForUserMutation = {
				update_app_notification: {
					affected_rows: 5,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockNotification } = mockGqlNotification1;
			const affectedRows = await notificationsService.updateAll(
				mockUser.id,
				mockNotification as Partial<GqlCreateOrUpdateNotification>
			);
			expect(affectedRows).toBe(5);
		});
	});
});
