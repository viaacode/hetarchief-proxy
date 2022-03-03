import { Test, TestingModule } from '@nestjs/testing';

import { VisitsService } from '../services/visits.service';
import { VisitStatus } from '../types';

import { VisitsController } from './visits.controller';

import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { User } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';

const mockVisitsResponse = {
	items: [
		{
			id: 'visit-1',
		},
		{
			id: 'visit-2',
		},
	],
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
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
		});
	});

	describe('update', () => {
		it('should update a visit', async () => {
			mockVisitsService.update.mockResolvedValueOnce(mockVisitsResponse.items[0]);
			const sessionHelperSpy = jest
				.spyOn(SessionHelper, 'getArchiefUserInfo')
				.mockReturnValue(mockUser);

			const visit = await visitsController.update(
				'visit-id',
				{
					status: VisitStatus.APPROVED,
				},
				{}
			);

			expect(visit).toEqual(mockVisitsResponse.items[0]);
			sessionHelperSpy.mockRestore();
		});
	});
});
