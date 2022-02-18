import { Test, TestingModule } from '@nestjs/testing';

import cpVisit from './__mocks__/cp_visit';
import { VisitsService } from './visits.service';

import { DataService } from '~modules/data/services/data.service';
import { VisitStatus } from '~modules/visits/types';

const mockDataService = {
	execute: jest.fn(),
};

const defaultVisitsResponse = {
	data: {
		cp_visit: [cpVisit],
		cp_visit_aggregate: {
			aggregate: {
				count: 100,
			},
		},
	},
};

describe('VisitsService', () => {
	let visitsService: VisitsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				VisitsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		visitsService = module.get<VisitsService>(VisitsService);
	});

	it('services should be defined', () => {
		expect(visitsService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our visit interface', () => {
			const adapted = visitsService.adapt(cpVisit);
			// test some sample keys
			expect(adapted.id).toEqual('20be1bf7-aa5d-42a7-914b-3e530b04f371');
			expect(adapted.spaceId).toEqual('65790f8f-6365-4891-8ce2-4563f360db89');
			expect(adapted.userProfileId).toEqual('b6080152-b1e4-4094-b1ad-0f0112a00113');
			expect(adapted.status).toEqual('PENDING');
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all visits', async () => {
			mockDataService.execute.mockResolvedValueOnce(defaultVisitsResponse);
			const response = await visitsService.findAll({
				query: '%',
				status: undefined,
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with visits containing maria', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_visit: [
						{
							id: '1',
							status: 'APPROVED',
							user_profile: {
								first_name: 'Marie',
								last_name: 'Odhiambo',
							},
						},
					],
					cp_visit_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await visitsService.findAll({
				query: '%Marie%',
				status: VisitStatus.APPROVED,
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.visitorName).toContain('Marie');
			expect(response.items[0]?.status).toEqual(VisitStatus.APPROVED);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on an array of statuses', async () => {
			mockDataService.execute.mockResolvedValueOnce(defaultVisitsResponse);
			const response = await visitsService.findAll({
				status: [VisitStatus.APPROVED, VisitStatus.DENIED],
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
		});

		it('can filter on userProfileId', async () => {
			mockDataService.execute.mockResolvedValueOnce(defaultVisitsResponse);
			const response = await visitsService.findAll({
				userProfileId: 'user-1',
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on spaceId', async () => {
			mockDataService.execute.mockResolvedValueOnce(defaultVisitsResponse);
			const response = await visitsService.findAll({
				userProfileId: 'user-1',
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single visit', async () => {
			mockDataService.execute.mockResolvedValueOnce(defaultVisitsResponse);
			const response = await visitsService.findById('1');
			expect(response.id).toBe(cpVisit.id);
		});

		it('throws a notfoundexception if the visit was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_visit: [],
				},
			});
			let error;
			try {
				await visitsService.findById('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				message: 'Not Found',
				statusCode: 404,
			});
		});
	});

	describe('create', () => {
		it('can create a new visit', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					insert_cp_visit_one: {
						id: '1',
					},
				},
			});
			const response = await visitsService.create({
				spaceId: 'space-1',
				userProfileId: 'user-1',
				timeframe: 'tomorrow',
				acceptedTos: true,
			});
			expect(response.id).toBe('1');
		});
	});
});
