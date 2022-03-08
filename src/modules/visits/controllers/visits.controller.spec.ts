import { Test, TestingModule } from '@nestjs/testing';
import { addHours } from 'date-fns';

import { VisitsService } from '../services/visits.service';
import { VisitStatus } from '../types';

import { VisitsController } from './visits.controller';

import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { AudienceType, Space } from '~modules/spaces/types';
import { User } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';

const mockVisit1 = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 7',
	status: 'APPROVED',
	startAt: '2022-03-03T16:00:00',
	endAt: '2022-03-03T17:00:00',
	createdAt: '2022-02-11T15:28:40.676',
	updatedAt: '2022-02-11T15:28:40.676',
	visitorName: 'Marie Odhiambo',
	visitorMail: 'marie.odhiambo@example.com',
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
};

const mockVisit2 = {
	id: '40f3f893-ba4f-4bc8-a871-0d492172134d',
	spaceId: '24ddc913-3e03-42ea-9bd1-ba486401bc30',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 2',
	status: 'PENDING',
	startAt: '2022-03-03T16:00:00',
	endAt: '2022-03-03T17:00:00',
	createdAt: '2022-02-11T15:28:40.676',
	updatedAt: '2022-02-11T15:28:40.676',
	visitorName: 'Marie Odhiambo',
	visitorMail: 'marie.odhiambo@example.com',
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
};

const mockVisitsResponse = {
	items: [mockVisit1, mockVisit2],
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: ['CREATE_COLLECTION'],
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

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
};

const mockNotificationsService: Partial<Record<keyof NotificationsService, jest.SpyInstance>> = {
	create: jest.fn(),
	createForMultipleRecipients: jest.fn(),
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	getMaintainerProfileIds: jest.fn(),
	findById: jest.fn(),
};

describe('VisitsController', () => {
	let visitsController: VisitsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VisitsController],
			imports: [],
			providers: [
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
				{
					provide: NotificationsService,
					useValue: mockNotificationsService,
				},
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
			],
		}).compile();

		visitsController = module.get<VisitsController>(VisitsController);
	});

	it('should be defined', () => {
		expect(visitsController).toBeDefined();
	});

	describe('getVisits', () => {
		it('should return all visits', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);
			const visits = await visitsController.getVisits(null);
			expect(visits).toEqual(mockVisitsResponse);
		});
	});

	describe('getVisitById', () => {
		it('should return a visit by id', async () => {
			mockVisitsService.findById.mockResolvedValueOnce(mockVisitsResponse.items[0]);
			const visit = await visitsController.getVisitById('1');
			expect(visit).toEqual(mockVisitsResponse.items[0]);
		});
	});

	describe('createVisit', () => {
		it('should create a new visit', async () => {
			mockVisitsService.create.mockResolvedValueOnce(mockVisitsResponse.items[0]);
			mockNotificationsService.createForMultipleRecipients.mockResolvedValueOnce([]);
			mockSpacesService.getMaintainerProfileIds.mockResolvedValueOnce(['1', '2']);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			const visit = await visitsController.createVisit(
				{
					spaceId: 'space-1',
					timeframe: 'asap',
					acceptedTos: true,
				},
				{}
			);

			expect(visit).toEqual(mockVisitsResponse.items[0]);
			expect(mockSpacesService.getMaintainerProfileIds).toBeCalledTimes(1);
			expect(mockNotificationsService.createForMultipleRecipients).toBeCalledTimes(1);
			sessionHelperSpy.mockRestore();
			mockSpacesService.getMaintainerProfileIds.mockClear();
			mockNotificationsService.createForMultipleRecipients.mockClear();
		});
	});

	describe('update', () => {
		it('should update a visit', async () => {
			mockVisitsService.update.mockResolvedValueOnce(mockVisitsResponse.items[0]);
			mockSpacesService.findById.mockResolvedValueOnce(mockSpace);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			const visit = await visitsController.update(
				'visit-id',
				{
					startAt: new Date().toISOString(),
					endAt: addHours(new Date(), 2).toISOString(),
					status: VisitStatus.APPROVED,
				},
				{}
			);

			expect(visit).toEqual(mockVisitsResponse.items[0]);
			sessionHelperSpy.mockRestore();
			mockNotificationsService.create.mockClear();
		});

		it('should update a visit status: approved', async () => {
			mockVisitsService.update.mockResolvedValueOnce(mockVisit1);
			mockSpacesService.findById.mockResolvedValueOnce(mockSpace);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			const visit = await visitsController.update(
				mockVisit1.id,
				{
					status: VisitStatus.APPROVED,
				},
				{}
			);
			expect(visit).toEqual(mockVisit1);
			expect(mockNotificationsService.create).toHaveBeenCalledTimes(1);
			sessionHelperSpy.mockRestore();
			mockNotificationsService.create.mockClear();
		});

		it('should update a visit status: denied', async () => {
			mockVisitsService.update.mockResolvedValueOnce(mockVisit1);
			mockSpacesService.findById.mockResolvedValueOnce(mockSpace);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			const visit = await visitsController.update(
				mockVisit1.id,
				{
					status: VisitStatus.DENIED,
				},
				{}
			);
			expect(visit).toEqual(mockVisit1);
			expect(mockNotificationsService.create).toHaveBeenCalledTimes(1);
			sessionHelperSpy.mockRestore();
			mockNotificationsService.create.mockClear();
		});

		it('should update a visit status: cancelled', async () => {
			mockVisitsService.update.mockResolvedValueOnce(mockVisit1);
			mockSpacesService.findById.mockResolvedValueOnce(mockSpace);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			const visit = await visitsController.update(
				mockVisit1.id,
				{
					status: VisitStatus.CANCELLED_BY_VISITOR,
				},
				{}
			);

			expect(visit).toEqual(mockVisit1);
			expect(mockNotificationsService.create).toHaveBeenCalledTimes(0);
			sessionHelperSpy.mockRestore();
			mockNotificationsService.create.mockClear();
		});
	});
});
