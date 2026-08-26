import { DataService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MaterialRequestMessagesService } from './material-request-messages.service';
import { MaterialRequestPdfGeneratorService } from './material-request-pdf-generator';

import {
	type GetAllUnreadMessageOverviewQuery,
	type GetEvaluatorsForOrganisationQuery,
	type GetUnreadMessageOverviewForProfileQuery,
	type InsertMaterialRequestMessageMutation,
	Lookup_App_Material_Request_Message_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockMaterialRequestPdfGeneratorService: Partial<
	Record<keyof MaterialRequestPdfGeneratorService, MockInstance>
> = {
	generateReuseFormPdfAndUpload: vi.fn(),
	generateFinalSummaryPdfAndUpload: vi.fn(),
	generateAdditionalConditionsSummaryPdfAndUpload: vi.fn(),
};

const mockMaterialRequest: MaterialRequest = {
	id: 'mr-1',
	requesterId: 'requester-1',
	maintainerId: 'OR-abc123',
} as MaterialRequest;

const mockInsertedMessage: InsertMaterialRequestMessageMutation['insert_app_material_request_messages_and_events_one'] =
	{
		id: 'message-1',
		message_type: Lookup_App_Material_Request_Message_Type_Enum.Message,
		sender_profile_id: 'requester-1',
		body: null,
		material_request_id: 'mr-1',
		created_at: '2026-08-26T09:00:00.000Z',
		attachments: [],
	};

describe('MaterialRequestMessagesService', () => {
	let materialRequestMessagesService: MaterialRequestMessagesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MaterialRequestMessagesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: MaterialRequestPdfGeneratorService,
					useValue: mockMaterialRequestPdfGeneratorService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		materialRequestMessagesService = module.get<MaterialRequestMessagesService>(
			MaterialRequestMessagesService
		);
	});

	afterEach(() => {
		mockDataService.execute.mockReset();
	});

	it('services should be defined', () => {
		expect(materialRequestMessagesService).toBeDefined();
	});

	describe('getUnreadMessageOverviewForProfile', () => {
		it('derives both direction booleans and per-request counts from the view rows', async () => {
			const mockData: GetUnreadMessageOverviewForProfileQuery = {
				app_material_request_unread_message_overview: [
					{ material_request_id: 'mr-1', is_outgoing: true },
					{ material_request_id: 'mr-1', is_outgoing: true },
					{ material_request_id: 'mr-2', is_outgoing: false },
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const result =
				await materialRequestMessagesService.getUnreadMessageOverviewForProfile('profile-1');

			expect(result).toEqual({
				hasUnreadOutgoingMessages: true,
				hasUnreadIncomingMessages: true,
				unreadCountsByMaterialRequestId: {
					'mr-1': 2,
					'mr-2': 1,
				},
			});
		});

		it('only sets the outgoing boolean when every unread row is outgoing', async () => {
			const mockData: GetUnreadMessageOverviewForProfileQuery = {
				app_material_request_unread_message_overview: [
					{ material_request_id: 'mr-1', is_outgoing: true },
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const result =
				await materialRequestMessagesService.getUnreadMessageOverviewForProfile('profile-1');

			expect(result.hasUnreadOutgoingMessages).toBe(true);
			expect(result.hasUnreadIncomingMessages).toBe(false);
		});

		it('returns both booleans false and an empty map when there are no unread messages', async () => {
			const mockData: GetUnreadMessageOverviewForProfileQuery = {
				app_material_request_unread_message_overview: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const result =
				await materialRequestMessagesService.getUnreadMessageOverviewForProfile('profile-1');

			expect(result).toEqual({
				hasUnreadOutgoingMessages: false,
				hasUnreadIncomingMessages: false,
				unreadCountsByMaterialRequestId: {},
			});
		});
	});

	describe('getAllUnreadMessageOverview', () => {
		it('returns the full outstanding unread backlog across all users', async () => {
			const mockData: GetAllUnreadMessageOverviewQuery = {
				app_material_request_unread_message_overview: [
					{ receiver_profile_id: 'profile-1', is_outgoing: true },
					{ receiver_profile_id: 'profile-2', is_outgoing: false },
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const result = await materialRequestMessagesService.getAllUnreadMessageOverview();

			expect(result).toEqual(mockData.app_material_request_unread_message_overview);
		});

		it('returns an empty array when nobody has unread messages', async () => {
			const mockData: GetAllUnreadMessageOverviewQuery = {
				app_material_request_unread_message_overview: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const result = await materialRequestMessagesService.getAllUnreadMessageOverview();

			expect(result).toEqual([]);
		});
	});

	describe('deleteAllUnreadEntriesForMaterialRequest', () => {
		it('deletes every unread-status row for the material request and returns the affected row count', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				delete_app_material_request_message_unread_status: { affected_rows: 3 },
			});

			const result =
				await materialRequestMessagesService.deleteAllUnreadEntriesForMaterialRequest('mr-1');

			expect(result).toBe(3);
			expect(mockDataService.execute).toHaveBeenCalledWith(expect.anything(), {
				materialRequestId: 'mr-1',
			});
		});

		it('returns 0 when there was nothing to delete', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				delete_app_material_request_message_unread_status: { affected_rows: 0 },
			});

			const result =
				await materialRequestMessagesService.deleteAllUnreadEntriesForMaterialRequest('mr-1');

			expect(result).toBe(0);
		});
	});

	describe('createMessage', () => {
		it('never inserts an unread-status row for the sender, even when they are also an evaluator of their own organisation', async () => {
			// Sender is the requester, and also shows up in the evaluators list for their own org
			// (eg: a requester who is also registered as an evaluator on that same organisation).
			const otherEvaluatorId = 'evaluator-2';
			mockDataService.execute
				.mockResolvedValueOnce({
					insert_app_material_request_messages_and_events_one: mockInsertedMessage,
				})
				.mockResolvedValueOnce({
					users_profile: [{ id: mockMaterialRequest.requesterId }, { id: otherEvaluatorId }],
				} as GetEvaluatorsForOrganisationQuery)
				.mockResolvedValueOnce({});

			await materialRequestMessagesService.createMessage(
				mockMaterialRequest,
				mockMaterialRequest.requesterId,
				Lookup_App_Material_Request_Message_Type_Enum.Message,
				{ text: 'hello' } as any
			);

			// insert message + get evaluators + exactly one unread-status insert
			expect(mockDataService.execute).toHaveBeenCalledTimes(3);
			const unreadStatusCall = mockDataService.execute.mock.calls[2];
			expect(unreadStatusCall[1]).toEqual(
				expect.objectContaining({ receiver_profile_id: otherEvaluatorId })
			);
			expect(mockDataService.execute).not.toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ receiver_profile_id: mockMaterialRequest.requesterId })
			);
		});

		it('notifies the requester when an evaluator sends a message', async () => {
			mockDataService.execute
				.mockResolvedValueOnce({
					insert_app_material_request_messages_and_events_one: {
						...mockInsertedMessage,
						sender_profile_id: 'evaluator-1',
					},
				})
				.mockResolvedValueOnce({});

			await materialRequestMessagesService.createMessage(
				mockMaterialRequest,
				'evaluator-1',
				Lookup_App_Material_Request_Message_Type_Enum.Message,
				{ text: 'hello' } as any
			);

			// insert message + exactly one unread-status insert for the requester, no evaluators lookup
			expect(mockDataService.execute).toHaveBeenCalledTimes(2);
			const unreadStatusCall = mockDataService.execute.mock.calls[1];
			expect(unreadStatusCall[1]).toEqual(
				expect.objectContaining({ receiver_profile_id: mockMaterialRequest.requesterId })
			);
		});
	});
});
