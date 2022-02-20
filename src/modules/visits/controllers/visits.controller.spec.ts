import { Test, TestingModule } from '@nestjs/testing';

import { VisitsService } from '../services/visits.service';

import { VisitsController } from './visits.controller';

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

const mockVisitsService = {
	findAll: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
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
		it('should create a visit by id', async () => {
			mockVisitsService.create.mockResolvedValueOnce(mockVisitsResponse.items[0]);
			const visit = await visitsController.createVisit({
				spaceId: 'space-1',
				userProfileId: 'user-1',
				timeframe: 'asap',
				acceptedTosAt: '2022-02-18T12:13:22.726Z',
			});
			expect(visit).toEqual(mockVisitsResponse.items[0]);
		});
	});
});
