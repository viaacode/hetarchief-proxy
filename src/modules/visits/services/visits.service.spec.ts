import { Test, TestingModule } from '@nestjs/testing';
import { addHours } from 'date-fns';

import { mockCpVisit } from './__mocks__/cp_visit';
import { VisitsService } from './visits.service';

import {
	FindVisitsQuery,
	GetVisitRequestForAccessQuery,
	InsertVisitMutation,
	PendingVisitCountForUserBySlugQuery,
	UpdateVisitMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { Visit, VisitStatus, VisitTimeframe } from '~modules/visits/types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const getDefaultVisitsResponse = (): { data: FindVisitsQuery } => ({
	data: {
		maintainer_visitor_space_request: [mockCpVisit as any],
		maintainer_visitor_space_request_aggregate: {
			aggregate: {
				count: 100,
			},
		},
	},
});

const getDefaultVisitAggregateResponse = (): { data: PendingVisitCountForUserBySlugQuery } => ({
	data: {
		maintainer_visitor_space_request_aggregate: {
			aggregate: {
				count: 1,
			},
			nodes: [
				{
					cp_space_id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
				},
			],
		},
	},
});

const mockVisit: Visit = {
	id: mockCpVisit.id,
	spaceId: mockCpVisit.cp_space_id,
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
	updatedById: null,
	updatedByName: null,
};

const mockUserProfileId = 'eccf3357-bc87-42e4-a91c-5a0ba8cb550a';

const mockVisitorSpaceRequestResponse: FindVisitsQuery = {
	maintainer_visitor_space_request: [
		{
			id: '1',
			status: 'APPROVED',
			requested_by: {
				full_name: 'Marie Odhiambo',
			},
			cp_space_id: '1',
		},
	] as FindVisitsQuery['maintainer_visitor_space_request'],
	maintainer_visitor_space_request_aggregate: {
		aggregate: {
			count: 100,
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
		})
			.setLogger(new TestingLogger())
			.compile();

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
			const adapted = visitsService.adapt(mockCpVisit);
			// test some sample keys
			expect(adapted.id).toEqual(mockCpVisit.id);
			expect(adapted.spaceId).toEqual(mockCpVisit.cp_space_id);
			expect(adapted.userProfileId).toEqual(mockCpVisit.user_profile_id);
			expect(adapted.status).toEqual(mockCpVisit.status);
		});

		it('should return null when the visit does not exist', () => {
			const adapted = visitsService.adapt(undefined);
			// test some sample keys
			expect(adapted).toBeNull();
		});

		it('returns null on invalid input', () => {
			const adapted = visitsService.adapt(null);
			expect(adapted).toBeNull();
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all visits', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					query: '%',
					status: undefined,
					page: 1,
					size: 10,
				},
				{}
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with visits containing maria across all cpSpaces', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: mockVisitorSpaceRequestResponse,
			});
			const response = await visitsService.findAll(
				{
					query: '%Marie%',
					status: VisitStatus.APPROVED,
					page: 1,
					size: 10,
				},
				{}
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.visitorName).toContain('Marie');
			expect(response.items[0]?.status).toEqual(VisitStatus.APPROVED);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with visits containing maria within one cpSpace', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: mockVisitorSpaceRequestResponse,
			});
			const response = await visitsService.findAll(
				{
					query: '%Marie%',
					status: VisitStatus.APPROVED,
					page: 1,
					size: 10,
				},
				{ cpSpaceId: 'space-1' }
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.visitorName).toContain('Marie');
			expect(response.items[0]?.status).toEqual(VisitStatus.APPROVED);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on an array of statuses', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					status: [VisitStatus.APPROVED, VisitStatus.DENIED],
					page: 1,
					size: 10,
				},
				{}
			);
			expect(response.items.length).toBe(1);
		});

		it('can filter on spaceId', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					page: 1,
					size: 10,
				},
				{ cpSpaceId: 'space-1' }
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on userProfileId', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					page: 1,
					size: 10,
				},
				{ userProfileId: mockUserProfileId }
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on timeframe ACTIVE', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					timeframe: VisitTimeframe.ACTIVE,
					page: 1,
					size: 10,
				},
				{}
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on timeframe FUTURE', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					timeframe: VisitTimeframe.FUTURE,
					page: 1,
					size: 10,
				},
				{}
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on timeframe PAST', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.findAll(
				{
					timeframe: VisitTimeframe.PAST,
					page: 1,
					size: 10,
				},
				{}
			);
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
			expect(response.id).toBe(mockCpVisit.id);
		});

		it('throws a notfoundexception if the visit was not found', async () => {
			const mockData: FindVisitsQuery = {
				maintainer_visitor_space_request: [],
				maintainer_visitor_space_request_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
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

	describe('getActiveVisitForUserAndSpace', () => {
		it('returns the active visit for the given user and space', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.getActiveVisitForUserAndSpace('user-1', 'space-1');
			expect(response.id).toBe(mockCpVisit.id);
		});

		it('throws a notfoundexception if the visit was not found', async () => {
			const mockData: FindVisitsQuery = {
				maintainer_visitor_space_request: [],
				maintainer_visitor_space_request_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			let error;

			try {
				await visitsService.getActiveVisitForUserAndSpace('user-1', 'space-1');
			} catch (e) {
				error = e;
			}

			expect(error.response).toEqual({
				error: 'Not Found',
				message:
					"No active visits for user with id 'user-1' and space with visitor space with slug 'space-1' found",
				statusCode: 404,
			});
		});
	});

	describe('getPendingVisitCountForUserBySlug', () => {
		it('returns the count of the pending visits for the current user in a given space', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitAggregateResponse());
			const response = await visitsService.getPendingVisitCountForUserBySlug(
				'user-1',
				'space-1'
			);
			expect(response.count).toBe(1);
		});
	});

	describe('create', () => {
		it('can create a new visit', async () => {
			const mockData: InsertVisitMutation = {
				insert_maintainer_visitor_space_request_one: {
					id: '1',
				} as InsertVisitMutation['insert_maintainer_visitor_space_request_one'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await visitsService.create(
				{
					visitorSpaceSlug: 'space-slug-1',
					visitorSpaceId: 'space-1',
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
			const mockData: UpdateVisitMutation = {
				update_maintainer_visitor_space_request_by_pk: null,
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

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
							id: mockCpVisit.id,
						},
					},
				})
				.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.update(
				mockCpVisit.id,
				{
					startAt: new Date().toISOString(),
					endAt: addHours(new Date(), 2).toISOString(),
					status: VisitStatus.APPROVED,
				},
				mockUserProfileId
			);
			expect(response.id).toBe(mockCpVisit.id);
			findVisitSpy.mockRestore();
		});

		it('can update a visit with a status', async () => {
			mockDataService.execute
				.mockResolvedValueOnce(getDefaultVisitsResponse())
				.mockResolvedValueOnce({
					data: {
						update_cp_visit_by_pk: {
							id: mockCpVisit.id,
						},
					},
				})
				.mockResolvedValueOnce(getDefaultVisitsResponse());
			const response = await visitsService.update(
				mockCpVisit.id,
				{
					status: VisitStatus.APPROVED,
				},
				mockUserProfileId
			);
			expect(response.id).toBe(mockCpVisit.id);
		});

		it('throws an error when you update to an invalid status', async () => {
			const initialVisit = getDefaultVisitsResponse();
			initialVisit.data.maintainer_visitor_space_request[0].status = VisitStatus.DENIED;
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
							id: mockCpVisit.id,
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
				mockCpVisit.id,
				{
					note: 'Test note',
				},
				mockUserProfileId
			);

			expect(response.id).toBe(mockCpVisit.id);
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
			expect(visits[0].id).toEqual(mockCpVisit.id);
		});
	});

	describe('getApprovedAndAlmostEndedVisitsWithoutNotification', () => {
		it('should get all visit requests that just started', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());

			const visits = await visitsService.getApprovedAndAlmostEndedVisitsWithoutNotification();

			expect(visits).toHaveLength(1);
			expect(visits[0].id).toEqual(mockCpVisit.id);
		});
	});

	describe('getApprovedAndEndedVisitsWithoutNotification', () => {
		it('should get all visit requests that just started', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultVisitsResponse());

			const visits = await visitsService.getApprovedAndEndedVisitsWithoutNotification();

			expect(visits).toHaveLength(1);
			expect(visits[0].id).toEqual(mockCpVisit.id);
		});
	});

	describe('hasAccess', () => {
		it('should allow access if approved visit request exists', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					maintainer_visitor_space_request: [{ id: '1' }],
				} as GetVisitRequestForAccessQuery,
			});

			const hasAccess: boolean = await visitsService.hasAccess(
				mockUserProfileId,
				'maintainer-1'
			);

			expect(hasAccess).toEqual(true);
		});

		it('should deny access if no approved visit request exists', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					maintainer_visitor_space_request: [],
				} as GetVisitRequestForAccessQuery,
			});

			const hasAccess: boolean = await visitsService.hasAccess(
				mockUserProfileId,
				'maintainer-1'
			);

			expect(hasAccess).toEqual(false);
		});
	});
});
