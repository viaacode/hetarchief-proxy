import { TranslationsService } from '@meemoo/admin-core-api';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { IPagination } from '@studiohyperdrive/pagination';
import { Idp } from '@viaa/avo2-types';

import { NotificationsService } from '../services/notifications.service';

import { NotificationsController } from './notifications.controller';

import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import {
	type Notification,
	NotificationStatus,
	NotificationType,
} from '~modules/notifications/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName, Permission, type User } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { type VisitRequest, VisitStatus } from '~modules/visits/types';
import { SessionHelper } from '~shared/auth/session-helper';
import { getTranslationFallback } from '~shared/helpers/translation-fallback';
import nlJson from '~shared/i18n/locales/nl.json';
import { TestingLogger } from '~shared/logging/test-logger';
import { MOCK_API_KEY, mockConfigService } from '~shared/test/mock-config-service';
import { Locale } from '~shared/types/types';

const mockNotification1: Notification = {
	description:
		'Je bezoek aanvraag aan de bezoekersruimte van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	status: NotificationStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-28T17:21:58.937169+00:00',
	updatedAt: '2022-02-28T17:21:58.937169',
	type: NotificationType.VISIT_REQUEST_APPROVED,
	visitorSpaceSlug: 'amsab',
};

const mockNotification2: Notification = {
	description:
		'Je bezoek aanvraag aan de bezoekersruimte van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: '84056059-c9fe-409b-844e-e7ce606c6212',
	status: NotificationStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-25T17:21:58.937169+00:00',
	updatedAt: '2022-02-25T17:21:58.937169',
	type: NotificationType.VISIT_REQUEST_APPROVED,
	visitorSpaceSlug: 'vrt',
};

const mockNotificationsResponse: IPagination<Notification> = {
	items: [mockNotification1, mockNotification2],
	total: 2,
	pages: 1,
	page: 1,
	size: 20,
};

const mockVisit: VisitRequest = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	spaceName: 'VRT',
	spaceSlug: 'vrt',
	spaceMaintainerId: 'or-rf5kf25',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
	spaceTelephone: '0412 34 56 78',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 7',
	status: VisitStatus.APPROVED,
	startAt: '2022-03-03T16:00:00',
	endAt: '2022-03-03T17:00:00',
	createdAt: '2022-02-11T15:28:40.676',
	updatedAt: '2022-02-11T15:28:40.676',
	visitorFirstName: 'Marie',
	visitorLastName: 'Odhiambo',
	visitorName: 'Marie Odhiambo',
	visitorMail: 'marie.odhiambo@example.com',
	visitorLanguage: Locale.Nl,
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	note: {
		id: 'a40b8cd7-5973-41ee-8134-c0451ef7fb6a',
		note: 'test note',
		createdAt: '2022-01-24T17:21:58.937169+00:00',
		authorName: 'Test Testers',
	},
	updatedById: 'ea3d92ab-0281-4ffe-9e2d-be0e687e7cd1',
	updatedByName: 'CP Admin',
	accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum.Full,
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
	isKeyUser: false,
	isEvaluator: false,
};
const mockNotificationsService: Partial<Record<keyof NotificationsService, jest.SpyInstance>> = {
	findNotificationsByUser: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	updateAll: jest.fn(),
	onCancelVisitRequest: jest.fn(),
};

const mockTranslationsService: Partial<Record<keyof TranslationsService, jest.SpyInstance>> = {
	getTranslations: jest.fn(),
	tText: jest.fn((translationKey: string) => nlJson[translationKey]),
	refreshBackendTranslations: jest.fn(),
	onApplicationBootstrap: jest.fn(),
};

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	getApprovedAndStartedVisitsWithoutNotification: jest.fn(),
	getApprovedAndAlmostEndedVisitsWithoutNotification: jest.fn(),
	getApprovedAndEndedVisitsWithoutNotification: jest.fn(),
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
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		notificationsController = module.get<NotificationsController>(NotificationsController);

		sessionHelperSpy = jest.spyOn(SessionHelper, 'getArchiefUserInfo').mockReturnValue(mockUser);
	});

	afterAll(async () => {
		sessionHelperSpy?.mockRestore();
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
				new SessionUserEntity(mockUser)
			);

			expect(notifications.items.length).toEqual(2);
		});

		it('should throw an error if the user is not logged in', async () => {
			let error: any;
			try {
				await notificationsController.getNotifications(
					{ page: 1, size: 20 },
					new SessionUserEntity({
						...mockUser,
						id: undefined,
					})
				);
			} catch (err) {
				error = err;
			}

			expect(error.response.message).toEqual('You need to be logged in to get your notifications');
		});
	});

	describe('markAsRead', () => {
		it('should mark a notification as read', async () => {
			mockNotificationsService.update.mockResolvedValueOnce({
				...mockNotification1,
				status: NotificationStatus.READ,
			});

			const notification = await notificationsController.markAsRead(
				mockNotification1.id,
				new SessionUserEntity(mockUser)
			);

			expect(notification.id).toEqual(mockNotification1.id);
			expect(notification.status).toEqual(NotificationStatus.READ);
		});
	});

	describe('markAllAsRead', () => {
		it('should mark all notification of a specific user as read', async () => {
			mockNotificationsService.updateAll.mockResolvedValueOnce(5);
			const response = await notificationsController.markAllAsRead(new SessionUserEntity(mockUser));
			expect(response).toEqual({ status: 'updated 5 notifications', total: 5 });
		});
	});

	describe('checkNewNotifications', () => {
		it('should create notifications for all visits access period events', async () => {
			mockNotificationsService.update.mockResolvedValueOnce({
				...mockNotification1,
				status: NotificationStatus.READ,
			});
			mockVisitsService.getApprovedAndStartedVisitsWithoutNotification.mockResolvedValueOnce([
				mockVisit,
				mockVisit,
			]);
			mockVisitsService.getApprovedAndAlmostEndedVisitsWithoutNotification.mockResolvedValueOnce([
				mockVisit,
			]);
			mockVisitsService.getApprovedAndEndedVisitsWithoutNotification.mockResolvedValueOnce([
				mockVisit,
				mockVisit,
				mockVisit,
			]);
			mockNotificationsService.create
				.mockResolvedValueOnce([mockVisit, mockVisit])
				.mockResolvedValueOnce([mockVisit])
				.mockResolvedValueOnce([mockVisit, mockVisit, mockVisit]);

			const response = await notificationsController.checkNewNotifications(MOCK_API_KEY);

			expect(response.status).toEqual(
				getTranslationFallback(
					'modules/notifications/controllers/notifications___notificaties-verzonden'
				)
			);
			expect(response.notifications).toEqual({
				ACCESS_PERIOD_VISITOR_SPACE_STARTED: 2,
				ACCESS_PERIOD_VISITOR_SPACE_END_WARNING: 1,
				ACCESS_PERIOD_VISITOR_SPACE_ENDED: 3,
			});
			expect(response.total).toEqual(2 + 1 + 3);
		});

		it('should not create any notifications if all visits already have one', async () => {
			mockNotificationsService.update.mockResolvedValueOnce({
				...mockNotification1,
				status: NotificationStatus.READ,
			});
			mockVisitsService.getApprovedAndStartedVisitsWithoutNotification.mockResolvedValueOnce([]);
			mockVisitsService.getApprovedAndAlmostEndedVisitsWithoutNotification.mockResolvedValueOnce(
				[]
			);
			mockVisitsService.getApprovedAndEndedVisitsWithoutNotification.mockResolvedValueOnce([]);
			mockNotificationsService.create
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([]);

			const response = await notificationsController.checkNewNotifications(MOCK_API_KEY);

			expect(response.status).toEqual(
				getTranslationFallback(
					'modules/notifications/controllers/notifications___no-notifications-had-to-be-sent'
				)
			);
			expect(response.notifications).toBeUndefined();
			expect(response.total).toEqual(0);
		});
	});
});
