import { Test, TestingModule } from '@nestjs/testing';
import { addHours } from 'date-fns';

import { VisitsService } from '../services/visits.service';
import { Visit, VisitStatus } from '../types';

import { VisitsController } from './visits.controller';

import { Lookup_Schema_Audience_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { Space } from '~modules/spaces/types';
import { Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import i18n from '~shared/i18n';

const mockVisit1: Visit = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	spaceName: 'VRT',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
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
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	note: {
		id: 'a40b8cd7-5973-41ee-8134-c0451ef7fb6a',
		note: 'test note',
		createdAt: '2022-01-24T17:21:58.937169+00:00',
		updatedAt: '2022-01-24T17:21:58.937169+00:00',
		authorName: 'Test Testers',
	},
	updatedById: 'ea3d92ab-0281-4ffe-9e2d-be0e687e7cd1',
	updatedByName: 'CP Admin',
};

const mockVisit2: Visit = {
	id: '40f3f893-ba4f-4bc8-a871-0d492172134d',
	spaceId: '24ddc913-3e03-42ea-9bd1-ba486401bc30',
	spaceName: 'Huis van Alijn',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 2',
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
	updatedById: null,
	updatedByName: null,
};

const mockVisitsResponse = {
	items: [mockVisit1, mockVisit2],
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: [Permission.CAN_READ_ALL_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
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
	getActiveVisitForUserAndSpace: jest.fn(),
};

const mockNotificationsService: Partial<Record<keyof NotificationsService, jest.SpyInstance>> = {
	create: jest.fn(),
	createForMultipleRecipients: jest.fn(),
	onCreateVisit: jest.fn(),
	onApproveVisitRequest: jest.fn(),
	onDenyVisitRequest: jest.fn(),
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	getMaintainerProfiles: jest.fn(),
	findById: jest.fn(),
	findSpaceByCpUserId: jest.fn(),
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

	afterEach(() => {
		mockNotificationsService.onCreateVisit.mockClear();
		mockNotificationsService.onApproveVisitRequest.mockClear();
		mockNotificationsService.onDenyVisitRequest.mockClear();
	});

	it('should be defined', () => {
		expect(visitsController).toBeDefined();
	});

	describe('getVisits', () => {
		it('should return all visits for meemoo admin', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);

			const visits = await visitsController.getVisits(null, {
				...mockUser,
				permissions: [Permission.CAN_READ_ALL_VISIT_REQUESTS],
			});

			expect(visits).toEqual(mockVisitsResponse);
		});

		it('should return all visits of a single cpSpace for cp admin', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);
			mockSpacesService.findSpaceByCpUserId.mockResolvedValueOnce(mockSpace);

			const visits = await visitsController.getVisits(null, {
				...mockUser,
				permissions: [Permission.CAN_READ_CP_VISIT_REQUESTS],
			});

			expect(visits).toEqual(mockVisitsResponse);
		});

		it('should throw a not found exception if the maintainer is not linked to any cp users', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);
			mockSpacesService.findSpaceByCpUserId.mockResolvedValueOnce(null);

			let error;
			try {
				await visitsController.getVisits(null, {
					...mockUser,
					permissions: [Permission.CAN_READ_CP_VISIT_REQUESTS],
				});
			} catch (err) {
				error = err;
			}

			expect(error.response).toEqual({
				statusCode: 404,
				message: 'The current user does not seem to be linked to a cp space.',
				error: 'Not Found',
			});
		});

		it('should throw an unauthorized error for regular visitors', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);

			let error;
			try {
				await visitsController.getVisits(null, {
					...mockUser,
					permissions: [],
				});
			} catch (err) {
				error = err;
			}

			expect(error?.response).toEqual({
				error: 'Unauthorized',
				message: 'You do not have the right permissions to call this route',
				statusCode: 401,
			});
		});
	});

	describe('getPersonalVisits', () => {
		it('should return all visits for a user', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);

			const visits = await visitsController.getPersonalVisits(null, {
				...mockUser,
				permissions: [Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS],
			});

			expect(visits).toEqual(mockVisitsResponse);
		});

		it('should throw an error if user does not have the correct permission', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce(mockVisitsResponse);

			let error;
			try {
				await visitsController.getPersonalVisits(null, {
					...mockUser,
					permissions: [],
				});
			} catch (err) {
				error = err;
			}

			expect(error.response).toEqual({
				statusCode: 401,
				message: 'You do not have the right permissions to call this route',
				error: 'Unauthorized',
			});
		});
	});

	describe('getVisitById', () => {
		it('should return a visit by id', async () => {
			mockVisitsService.findById.mockResolvedValueOnce(mockVisit1);
			const visit = await visitsController.getVisitById('1');
			expect(visit).toEqual(mockVisit1);
		});
	});

	describe('getActiveVisitForUserAndSpace', () => {
		it('should return the active visit for the current user', async () => {
			mockVisitsService.getActiveVisitForUserAndSpace.mockResolvedValueOnce(mockVisit1);
			const visit = await visitsController.getActiveVisitForUserAndSpace('space-1', {
				archiefUserInfo: { id: 'user-1' },
			});
			expect(visit).toEqual(mockVisit1);
		});
	});

	describe('createVisit', () => {
		it('should create a new visit', async () => {
			mockVisitsService.create.mockResolvedValueOnce(mockVisit1);
			mockNotificationsService.createForMultipleRecipients.mockResolvedValueOnce([]);
			mockSpacesService.getMaintainerProfiles.mockResolvedValueOnce([
				{ id: '1', email: '1@shd.be' },
				{ id: '2', email: '2@shd.be' },
			]);
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

			expect(visit).toEqual(mockVisit1);
			expect(mockSpacesService.getMaintainerProfiles).toBeCalledTimes(1);
			expect(mockNotificationsService.onCreateVisit).toHaveBeenCalledTimes(1);
			sessionHelperSpy.mockRestore();
			mockSpacesService.getMaintainerProfiles.mockClear();
		});

		it('should throw an error if you try to create a new visit without accepting tos', async () => {
			mockVisitsService.create.mockResolvedValueOnce({
				mockVisit1,
			});
			mockNotificationsService.createForMultipleRecipients.mockResolvedValueOnce([]);
			mockSpacesService.getMaintainerProfiles.mockResolvedValueOnce([
				{ id: '1', email: '1@shd.be' },
				{ id: '2', email: '2@shd.be' },
			]);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			let error: any;
			try {
				await visitsController.createVisit(
					{
						spaceId: 'space-1',
						timeframe: 'asap',
						acceptedTos: false,
					},
					{}
				);
			} catch (err) {
				error = err;
			}

			expect(error.response.message).toEqual(
				i18n.t(
					'The Terms of Service of the reading room need to be accepted to be able to request a visit.'
				)
			);
			expect(mockSpacesService.getMaintainerProfiles).toBeCalledTimes(0);
			expect(mockNotificationsService.createForMultipleRecipients).toBeCalledTimes(0);
			sessionHelperSpy.mockRestore();
			mockSpacesService.getMaintainerProfiles.mockClear();
			mockNotificationsService.createForMultipleRecipients.mockClear();
		});
	});

	describe('update', () => {
		it('should update a visit', async () => {
			mockVisitsService.update.mockResolvedValueOnce(mockVisit1);
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

			expect(visit).toEqual(mockVisit1);
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
			expect(mockNotificationsService.onApproveVisitRequest).toHaveBeenCalledTimes(1);
			expect(mockNotificationsService.onDenyVisitRequest).toHaveBeenCalledTimes(0);
			sessionHelperSpy.mockRestore();
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
			expect(mockNotificationsService.onApproveVisitRequest).toHaveBeenCalledTimes(0);
			expect(mockNotificationsService.onDenyVisitRequest).toHaveBeenCalledTimes(1);
			sessionHelperSpy.mockRestore();
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
			expect(mockNotificationsService.onApproveVisitRequest).toHaveBeenCalledTimes(0);
			expect(mockNotificationsService.onDenyVisitRequest).toHaveBeenCalledTimes(0);
			sessionHelperSpy.mockRestore();
		});
	});
});
