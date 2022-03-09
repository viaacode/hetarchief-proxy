import { Test, TestingModule } from '@nestjs/testing';
import { addHours } from 'date-fns';

import cpVisit from './__mocks__/cp_visit';
import { VisitsService } from './visits.service';

import { DataService } from '~modules/data/services/data.service';
import { Visit, VisitStatus } from '~modules/visits/types';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const getDefaultVisitsResponse = () => ({
	data: {
		cp_visit: [cpVisit],
		cp_visit_aggregate: {
			aggregate: {
				count: 100,
			},
		},
	},
});

const mockVisit: Visit = {
	id: '20be1bf7-aa5d-42a7-914b-3e530b04f371',
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
};

const mockUserProfileId = 'eccf3357-bc87-42e4-a91c-5a0ba8cb550a';

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

	afterEach(() => {
		mockDataService.execute.mockRestore();
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
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
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
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll({
				status: [VisitStatus.APPROVED, VisitStatus.DENIED],
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
		});

		it('can filter on userProfileId', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
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
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll({
				spaceId: 'space-1',
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
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
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
				error: 'Not Found',
				message: "Visit with id 'unknown-id' not found",
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
			const response = await visitsService.create(
				{
					spaceId: 'space-1',
					timeframe: 'tomorrow',
					acceptedTos: true,
				},
				'user-1'
			);
			expect(response.id).toBe('1');
		});
	});

	describe('update', () => {
		it('throws an exception if the visit request was not found', async () => {
			const findVisitSpy = jest.spyOn(visitsService, 'findById').mockResolvedValue(null);
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_visit: [],
				},
			});

			let error;
			try {
				await visitsService.update(
					'1',
					{
						status: VisitStatus.APPROVED,
					},
					mockUserProfileId
				);
			} catch (e) {
				error = e;
			}

			expect(error.message).toBe(`Visit with id '1' not found`);
			findVisitSpy.mockRestore();
		});

		it('can update a visit with startAt, endAt and status', async () => {
			const findVisitSpy = jest.spyOn(visitsService, 'findById').mockResolvedValue(mockVisit);
			mockDataService.execute
				.mockResolvedValueOnce(getDefaultVisitsResponse())
				.mockResolvedValueOnce({
					data: {
						update_cp_visit_by_pk: {
							id: cpVisit.id,
						},
					},
				})
				.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.update(
				cpVisit.id,
				{
					startAt: new Date().toISOString(),
					endAt: addHours(new Date(), 2).toISOString(),
					status: VisitStatus.APPROVED,
				},
				mockUserProfileId
			);
			expect(response.id).toBe(cpVisit.id);
			findVisitSpy.mockRestore();
		});

		it('can update a visit with a status', async () => {
			mockDataService.execute
				.mockResolvedValueOnce(getDefaultVisitsResponse())
				.mockResolvedValueOnce({
					data: {
						update_cp_visit_by_pk: {
							id: cpVisit.id,
						},
					},
				})
				.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.update(
				cpVisit.id,
				{
					status: VisitStatus.APPROVED,
				},
				mockUserProfileId
			);
			expect(response.id).toBe(cpVisit.id);
		});

		it('throws an error when you update to an invalid status', async () => {
			const initialVisit = getDefaultVisitsResponse();
			initialVisit.data.cp_visit[0].status = VisitStatus.DENIED;
			mockDataService.execute.mockResolvedValueOnce(initialVisit);

			let error;
			try {
				await visitsService.update(
					'1',
					{
						status: VisitStatus.PENDING,
					},
					mockUserProfileId
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toBe("Status transition 'DENIED' -> 'PENDING' is not allowed");
		});

		it('throws an error when you update a visit that does not exist', async () => {
			const findVisitSpy = jest.spyOn(visitsService, 'findById').mockResolvedValueOnce(null);

			let error;
			try {
				await visitsService.update(
					'1',
					{
						status: VisitStatus.PENDING,
					},
					mockUserProfileId
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toBe(`Visit with id '1' not found`);
			findVisitSpy.mockRestore();
		});

		it('can add a note to a visit', async () => {
			mockDataService.execute
				.mockResolvedValueOnce(getDefaultVisitsResponse())
				.mockResolvedValueOnce({
					data: {
						update_cp_visit_by_pk: {
							id: cpVisit.id,
						},
					},
				})
				.mockResolvedValueOnce({
					data: {
						insert_cp_visit_note_one: {
							id: 'note-id',
						},
					},
				})
				.mockResolvedValueOnce(getDefaultVisitsResponse());
			const findVisitSpy = jest.spyOn(visitsService, 'findById').mockResolvedValue(mockVisit);

			const response = await visitsService.update(
				cpVisit.id,
				{
					note: 'Test note',
				},
				mockUserProfileId
			);

			expect(response.id).toBe(cpVisit.id);
			findVisitSpy.mockRestore();
		});
	});

	describe('validateDates', () => {
		it('throws an exception if only startAt is set', async () => {
			let error;
			try {
				visitsService.validateDates(new Date().toISOString(), null);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual(
				'Both startAt end endAt must be specified when updating any of these'
			);
		});

		it('throws an exception if only endAt is set', async () => {
			let error;
			try {
				visitsService.validateDates(null, new Date().toISOString());
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual(
				'Both startAt end endAt must be specified when updating any of these'
			);
		});

		it('throws an exception if startAt does not precede endAt', async () => {
			let error;
			try {
				visitsService.validateDates(
					addHours(new Date(), 2).toISOString(),
					new Date().toISOString()
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('startAt must precede endAt');
		});
	});

	describe('getApprovedAndStartedVisitsWithoutNotification', () => {
		it('should get all visit requests that just started', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());

			const visits = await visitsService.getApprovedAndStartedVisitsWithoutNotification();

			expect(visits).toHaveLength(1);
			expect(visits[0].id).toEqual(cpVisit.id);
		});
	});

	describe('getApprovedAndAlmostEndedVisitsWithoutNotification', () => {
		it('should get all visit requests that just started', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());

			const visits = await visitsService.getApprovedAndAlmostEndedVisitsWithoutNotification();

			expect(visits).toHaveLength(1);
			expect(visits[0].id).toEqual(cpVisit.id);
		});
	});

	describe('getApprovedAndEndedVisitsWithoutNotification', () => {
		it('should get all visit requests that just started', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());

			const visits = await visitsService.getApprovedAndEndedVisitsWithoutNotification();

			expect(visits).toHaveLength(1);
			expect(visits[0].id).toEqual(cpVisit.id);
		});
	});
});
