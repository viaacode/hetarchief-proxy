import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IPagination } from '@studiohyperdrive/pagination';
import i18n from 'i18next';

import { Configuration } from '~config';

import { ContentPagesService } from '../services/contentPages.service';

import { ContentPagesController } from './contentPages.controller';

import { ContentPage, ContentPageStatus, ContentPageType } from '~modules/contentPages/types';
import { User } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { Visit, VisitStatus } from '~modules/visits/types';
import { SessionHelper } from '~shared/auth/session-helper';

const mockContentPage1: ContentPage = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	status: ContentPageStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-28T17:21:58.937169+00:00',
	updatedAt: '2022-02-28T17:21:58.937169',
	type: ContentPageType.VISIT_REQUEST_APPROVED,
	readingRoomId: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
};

const mockContentPage2: ContentPage = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: '84056059-c9fe-409b-844e-e7ce606c6212',
	status: ContentPageStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-25T17:21:58.937169+00:00',
	updatedAt: '2022-02-25T17:21:58.937169',
	type: ContentPageType.VISIT_REQUEST_APPROVED,
	readingRoomId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
};

const mockContentPagesResponse: IPagination<ContentPage> = {
	items: [mockContentPage1, mockContentPage2],
	total: 2,
	pages: 1,
	page: 1,
	size: 20,
};

const mockVisit: Visit = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	spaceName: 'VRT',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 7',
	status: VisitStatus.APPROVED,
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
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: ['CREATE_COLLECTION'],
};

const mockContentPagesService: Partial<Record<keyof ContentPagesService, jest.SpyInstance>> = {
	findContentPagesByUser: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	updateAll: jest.fn(),
};

const mockApiKey = 'MySecretApiKey';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'proxyApiKey') {
			return mockApiKey;
		}
		return key;
	}),
};

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	getApprovedAndStartedVisitsWithoutContentPage: jest.fn(),
	getApprovedAndAlmostEndedVisitsWithoutContentPage: jest.fn(),
	getApprovedAndEndedVisitsWithoutContentPage: jest.fn(),
};

describe('ContentPagesController', () => {
	let contentPagesController: ContentPagesController;
	let sessionHelperSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ContentPagesController],
			imports: [],
			providers: [
				{
					provide: ContentPagesService,
					useValue: mockContentPagesService,
				},
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		contentPagesController = module.get<ContentPagesController>(ContentPagesController);

		sessionHelperSpy = jest
			.spyOn(SessionHelper, 'getArchiefUserInfo')
			.mockReturnValue(mockUser);
	});

	afterAll(async () => {
		sessionHelperSpy.mockRestore();
	});

	it('should be defined', () => {
		expect(contentPagesController).toBeDefined();
	});

	describe('getContentPages', () => {
		it('should return all contentPages for a specific user', async () => {
			mockContentPagesService.findContentPagesByUser.mockResolvedValueOnce(
				mockContentPagesResponse
			);

			const contentPages = await contentPagesController.getContentPages(
				{ page: 1, size: 20 },
				{}
			);

			expect(contentPages.items.length).toEqual(2);
		});
	});

	describe('markAsRead', () => {
		it('should mark a contentPage as read', async () => {
			mockContentPagesService.update.mockResolvedValueOnce({
				...mockContentPage1,
				status: ContentPageStatus.READ,
			});

			const contentPage = await contentPagesController.markAsRead(mockContentPage1.id, {});

			expect(contentPage.id).toEqual(mockContentPage1.id);
			expect(contentPage.status).toEqual(ContentPageStatus.READ);
		});
	});

	describe('markAllAsRead', () => {
		it('should mark all contentPage of a specific user as read', async () => {
			mockContentPagesService.updateAll.mockResolvedValueOnce(5);
			const response = await contentPagesController.markAllAsRead({});
			expect(response).toEqual({ status: `updated 5 contentPages`, total: 5 });
		});
	});

	describe('checkNewContentPages', () => {
		it('should create contentPages for all visits access period events', async () => {
			mockContentPagesService.update.mockResolvedValueOnce({
				...mockContentPage1,
				status: ContentPageStatus.READ,
			});
			mockVisitsService.getApprovedAndStartedVisitsWithoutContentPage.mockResolvedValueOnce([
				mockVisit,
				mockVisit,
			]);
			mockVisitsService.getApprovedAndAlmostEndedVisitsWithoutContentPage.mockResolvedValueOnce(
				[mockVisit]
			);
			mockVisitsService.getApprovedAndEndedVisitsWithoutContentPage.mockResolvedValueOnce([
				mockVisit,
				mockVisit,
				mockVisit,
			]);
			mockContentPagesService.create
				.mockResolvedValueOnce([mockVisit, mockVisit])
				.mockResolvedValueOnce([mockVisit])
				.mockResolvedValueOnce([mockVisit, mockVisit, mockVisit]);

			const response = await contentPagesController.checkNewContentPages(mockApiKey);

			expect(response.status).toEqual(i18n.t('Notificaties verzonden'));
			expect(response.contentPages).toEqual({
				ACCESS_PERIOD_READING_ROOM_STARTED: 2,
				ACCESS_PERIOD_READING_ROOM_END_WARNING: 1,
				ACCESS_PERIOD_READING_ROOM_ENDED: 3,
			});
			expect(response.total).toEqual(2 + 1 + 3);
		});

		it('should not create any contentPages if all visits already have one', async () => {
			mockContentPagesService.update.mockResolvedValueOnce({
				...mockContentPage1,
				status: ContentPageStatus.READ,
			});
			mockVisitsService.getApprovedAndStartedVisitsWithoutContentPage.mockResolvedValueOnce(
				[]
			);
			mockVisitsService.getApprovedAndAlmostEndedVisitsWithoutContentPage.mockResolvedValueOnce(
				[]
			);
			mockVisitsService.getApprovedAndEndedVisitsWithoutContentPage.mockResolvedValueOnce([]);
			mockContentPagesService.create
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([]);

			const response = await contentPagesController.checkNewContentPages(mockApiKey);

			expect(response.status).toEqual(i18n.t('No contentPages had to be sent'));
			expect(response.contentPages).toBeUndefined();
			expect(response.total).toEqual(0);
		});
	});
});