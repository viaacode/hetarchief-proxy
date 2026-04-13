import { DataService, MediahavenService } from '@meemoo/admin-core-api';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	MamJobStatus,
	type MediahavenJobInfo,
} from '~modules/mediahaven-jobs-watcher/mediahaven-jobs-watcher.types';
import { MediahavenJobsWatcherService } from './mediahaven-jobs-watcher.service';

import { Lookup_App_Material_Request_Download_Status_Enum } from '~generated/graphql-db-types-hetarchief';
import { EventsService } from '~modules/events/services/events.service';
import type { MaterialRequestForDownload } from '~modules/material-requests/material-requests.types';
import { MaterialRequestsService } from '~modules/material-requests/services/material-requests.service';
import { UsersService } from '~modules/users/services/users.service';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockMediahavenService: Partial<Record<keyof MediahavenService, MockInstance>> = {
	getAccessToken: vi.fn(() =>
		Promise.resolve({
			token: { access_token: 'mock-access-token' },
			createdAt: new Date(),
		})
	),
};

const mockMaterialRequestsService: Partial<Record<keyof MaterialRequestsService, MockInstance>> = {
	findAllWithUnresolvedDownload: vi.fn(),
	updateMaterialRequest: vi.fn(),
	sentStatusUpdateEmail: vi.fn(() => Promise.resolve()),
};

const mockUsersService: Partial<Record<keyof UsersService, MockInstance>> = {
	getById: vi.fn(() =>
		Promise.resolve({
			id: 'test-user-id',
			email: 'test@example.com',
			firstName: 'Test',
			lastName: 'User',
		})
	),
};

const mockEventsService: Partial<Record<keyof EventsService, MockInstance>> = {
	insertEvents: vi.fn(() => Promise.resolve()),
};

// Helper to create a mock material request for download
const createMockMaterialRequest = (
	overrides: Partial<MaterialRequestForDownload> = {}
): MaterialRequestForDownload => ({
	id: 'material-request-1',
	type: 'REUSE' as any,
	status: 'APPROVED' as any,
	downloadJobId: 'export-job-1',
	downloadRetries: 0,
	downloadStatus: Lookup_App_Material_Request_Download_Status_Enum.New,
	objectId: 'ie-object-1',
	objectRepresentationId: 'representation-1',
	requesterId: 'requester-1',
	updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
	downloadUrl: '',
	reuseForm: { downloadQuality: 'HIGH' } as any,
	maintainerId: '',
	...overrides,
});

// Helper to create a mock mediahaven job
const createMockMediahavenJob = (
	overrides: Partial<MediahavenJobInfo> = {}
): MediahavenJobInfo => ({
	ExportJobId: 'export-job-1',
	Name: 'test-file.mp4',
	RecordId: 'record-1',
	Status: MamJobStatus.Waiting,
	Progress: 0,
	DownloadUrl: '',
	RemoteUrl: '',
	CreationDate: new Date().toISOString(),
	StartDate: new Date().toISOString(),
	FinishDate: new Date().toISOString(),
	ExpiryDate: new Date().toISOString(),
	Tag: 'uitwisseling',
	...overrides,
});

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MediahavenJobsWatcherService', () => {
	let service: MediahavenJobsWatcherService;

	beforeEach(async () => {
		vi.clearAllMocks();

		// Default fetch mock for getJobsFromMediahaven
		mockFetch.mockResolvedValue({
			status: 200,
			json: () => Promise.resolve({ Results: [] }),
		});

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MediahavenJobsWatcherService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: MaterialRequestsService,
					useValue: mockMaterialRequestsService,
				},
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: MediahavenService,
					useValue: mockMediahavenService,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		service = module.get<MediahavenJobsWatcherService>(MediahavenJobsWatcherService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('checkUnresolvedJobs', () => {
		// describe('when no jobs exist in Mediahaven for a material request', () => {
		// 	it('should retry creating export job when updatedAt is more than 1 hour ago and retries < 3', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadJobId: 'non-existent-job',
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [] }), // No jobs found
		// 		});
		//
		// 		// Mock createExportJob
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(createExportJobSpy).toHaveBeenCalledWith(materialRequest);
		// 	});
		//
		// 	it('should delay retry when updatedAt is less than 1 hour ago', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadJobId: 'non-existent-job',
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(createExportJobSpy).not.toHaveBeenCalled();
		// 		expect(mockMaterialRequestsService.updateMaterialRequest).not.toHaveBeenCalled();
		// 	});
		//
		// 	it('should mark as failed when max retries (3) reached', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadJobId: 'non-existent-job',
		// 			downloadRetries: 3,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(materialRequest);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [] }),
		// 		});
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
		// 			materialRequest.id,
		// 			expect.objectContaining({
		// 				download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
		// 			})
		// 		);
		// 	});
		// });

		describe('MamJobStatus.Waiting', () => {
			it('should set download status to PENDING when job is Waiting', async () => {
				const materialRequest = createMockMaterialRequest();
				const job = createMockMediahavenJob({
					ExportJobId: materialRequest.downloadJobId,
					Status: MamJobStatus.Waiting,
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					materialRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(materialRequest);
				mockFetch.mockResolvedValue({
					status: 200,
					json: () => Promise.resolve({ Results: [job] }),
				});

				await service.checkUnresolvedJobs();

				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					materialRequest.id,
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Pending,
					})
				);
			});
		});

		describe('MamJobStatus.InProgress', () => {
			it('should set download status to PENDING when job is InProgress', async () => {
				const materialRequest = createMockMaterialRequest();
				const job = createMockMediahavenJob({
					ExportJobId: materialRequest.downloadJobId,
					Status: MamJobStatus.InProgress,
					Progress: 0.5,
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					materialRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(materialRequest);
				mockFetch.mockResolvedValue({
					status: 200,
					json: () => Promise.resolve({ Results: [job] }),
				});

				await service.checkUnresolvedJobs();

				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					materialRequest.id,
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Pending,
					})
				);
			});
		});

		describe('MamJobStatus.Completed', () => {
			it('should set download status to SUCCEEDED and update download URL when job is Completed', async () => {
				const materialRequest = createMockMaterialRequest();
				const job = createMockMediahavenJob({
					ExportJobId: materialRequest.downloadJobId,
					Status: MamJobStatus.Completed,
					Progress: 1.0,
					Name: 'completed-file.mp4',
					FinishDate: '2026-03-05T08:47:34.006000Z',
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					materialRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue({
					...materialRequest,
					downloadStatus: Lookup_App_Material_Request_Download_Status_Enum.Succeeded,
				});
				mockFetch.mockResolvedValue({
					status: 200,
					json: () => Promise.resolve({ Results: [job] }),
				});

				await service.checkUnresolvedJobs();

				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					materialRequest.id,
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Succeeded,
						download_url: `${materialRequest.requesterId}/${materialRequest.id}/${job.Name}`,
						download_available_at: job.FinishDate,
					})
				);

				// Should trigger download available event
				expect(mockEventsService.insertEvents).toHaveBeenCalled();
			});

			it('should send emails to requester and maintainer when job is Completed', async () => {
				const materialRequest = createMockMaterialRequest();
				const job = createMockMediahavenJob({
					ExportJobId: materialRequest.downloadJobId,
					Status: MamJobStatus.Completed,
					Progress: 1.0,
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					materialRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue({
					...materialRequest,
					downloadStatus: Lookup_App_Material_Request_Download_Status_Enum.Succeeded,
				});
				mockFetch.mockResolvedValue({
					status: 200,
					json: () => Promise.resolve({ Results: [job] }),
				});

				await service.checkUnresolvedJobs();

				// Wait for async email sending
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(mockMaterialRequestsService.sentStatusUpdateEmail).toHaveBeenCalledTimes(2);
			});
		});

		// https://meemoo.atlassian.net/browse/ARC-3573
		// describe('MamJobStatus.Failed', () => {
		// 	it('should retry creating export job when job is Failed and retries < 3', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Failed,
		// 			Progress: 0,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(createExportJobSpy).toHaveBeenCalledWith(materialRequest);
		// 	});
		//
		// 	it('should delay retry when job is Failed but updatedAt is less than 1 hour ago', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Failed,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(createExportJobSpy).not.toHaveBeenCalled();
		// 		expect(mockMaterialRequestsService.updateMaterialRequest).not.toHaveBeenCalled();
		// 	});
		//
		// 	it('should mark as failed when job is Failed and max retries (3) reached', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 3,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Failed,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(materialRequest);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
		// 			materialRequest.id,
		// 			expect.objectContaining({
		// 				download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
		// 			})
		// 		);
		// 	});
		// });

		// https://meemoo.atlassian.net/browse/ARC-3573
		// describe('MamJobStatus.Cancelled', () => {
		// 	it('should retry creating export job when job is Cancelled and retries < 3', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 1,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Cancelled,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(createExportJobSpy).toHaveBeenCalledWith(materialRequest);
		// 	});
		//
		// 	it('should mark as failed when job is Cancelled and max retries reached', async () => {
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 3,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Cancelled,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(materialRequest);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
		// 			materialRequest.id,
		// 			expect.objectContaining({
		// 				download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
		// 			})
		// 		);
		// 	});
		// });

		describe('MamJobStatus.AlreadyExists', () => {
			it('should mark as failed when job status is AlreadyExists', async () => {
				const materialRequest = createMockMaterialRequest();
				const job = createMockMediahavenJob({
					ExportJobId: materialRequest.downloadJobId,
					Status: MamJobStatus.AlreadyExists,
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					materialRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(materialRequest);
				mockFetch.mockResolvedValue({
					status: 200,
					json: () => Promise.resolve({ Results: [job] }),
				});

				await service.checkUnresolvedJobs();

				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					materialRequest.id,
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
					})
				);
			});
		});

		// https://meemoo.atlassian.net/browse/ARC-3573
		// describe('Retry logic simulation', () => {
		// 	it('should simulate complete retry cycle: fail 3 times then mark as permanently failed', async () => {
		// 		// Simulate first failure attempt (retry 0 -> 1)
		// 		const firstAttempt = createMockMaterialRequest({
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		// 		});
		// 		const failedJob = createMockMediahavenJob({
		// 			ExportJobId: firstAttempt.downloadJobId,
		// 			Status: MamJobStatus.Failed,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([firstAttempt]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [failedJob] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		// 		expect(createExportJobSpy).toHaveBeenCalledTimes(1);
		//
		// 		// Simulate second failure attempt (retry 1 -> 2)
		// 		createExportJobSpy.mockClear();
		// 		const secondAttempt = createMockMaterialRequest({
		// 			downloadRetries: 1,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		// 		});
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			secondAttempt,
		// 		]);
		//
		// 		await service.checkUnresolvedJobs();
		// 		expect(createExportJobSpy).toHaveBeenCalledTimes(1);
		//
		// 		// Simulate third failure attempt (retry 2 -> 3)
		// 		createExportJobSpy.mockClear();
		// 		const thirdAttempt = createMockMaterialRequest({
		// 			downloadRetries: 2,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		// 		});
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([thirdAttempt]);
		//
		// 		await service.checkUnresolvedJobs();
		// 		expect(createExportJobSpy).toHaveBeenCalledTimes(1);
		//
		// 		// Simulate final check - should mark as failed (retry 3 = max)
		// 		createExportJobSpy.mockClear();
		// 		const finalAttempt = createMockMaterialRequest({
		// 			downloadRetries: 3,
		// 			updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		// 		});
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([finalAttempt]);
		// 		mockMaterialRequestsService.updateMaterialRequest.mockResolvedValue(finalAttempt);
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		expect(createExportJobSpy).not.toHaveBeenCalled();
		// 		expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
		// 			finalAttempt.id,
		// 			expect.objectContaining({
		// 				download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
		// 			})
		// 		);
		// 	});
		// });

		describe('Multiple material requests', () => {
			it('should process multiple material requests with different statuses', async () => {
				const waitingRequest = createMockMaterialRequest({
					id: 'waiting-request',
					downloadJobId: 'waiting-job',
				});
				const completedRequest = createMockMaterialRequest({
					id: 'completed-request',
					downloadJobId: 'completed-job',
				});
				const failedRequest = createMockMaterialRequest({
					id: 'failed-request',
					downloadJobId: 'failed-job',
					downloadRetries: 3,
					updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
				});

				const waitingJob = createMockMediahavenJob({
					ExportJobId: 'waiting-job',
					Status: MamJobStatus.Waiting,
				});
				const completedJob = createMockMediahavenJob({
					ExportJobId: 'completed-job',
					Status: MamJobStatus.Completed,
					Progress: 1.0,
				});
				const failedJob = createMockMediahavenJob({
					ExportJobId: 'failed-job',
					Status: MamJobStatus.Failed,
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					waitingRequest,
					completedRequest,
					failedRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockImplementation((id) => {
					if (id === 'waiting-request') return Promise.resolve(waitingRequest);
					if (id === 'completed-request') return Promise.resolve(completedRequest);
					if (id === 'failed-request') return Promise.resolve(failedRequest);
				});
				mockFetch.mockResolvedValue({
					status: 200,
					json: () => Promise.resolve({ Results: [waitingJob, completedJob, failedJob] }),
				});

				await service.checkUnresolvedJobs();

				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					'waiting-request',
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Pending,
					})
				);
				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					'completed-request',
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Succeeded,
					})
				);
				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					'failed-request',
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
					})
				);
			});
		});

		// https://meemoo.atlassian.net/browse/ARC-3573
		// describe('Configurable retry delay', () => {
		// 	it('should respect MEDIAHAVEN_EXPORT_JOB_RETRY_DELAY_HOURS env var for retry delay', async () => {
		// 		// Configure a shorter delay (0.5 hours = 30 minutes)
		// 		mockConfigService.get.mockImplementation((key: string) => {
		// 			if (key === 'MEDIAHAVEN_EXPORT_JOB_RETRY_DELAY_HOURS') {
		// 				return '0.5'; // 30 minutes
		// 			}
		// 			return key;
		// 		});
		//
		// 		// Material request updated 45 minutes ago - should delay with 1-hour delay, but retry with 0.5-hour delay
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Failed,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		// With 0.5 hour delay, 45 minutes should be past the delay, so retry should happen
		// 		expect(createExportJobSpy).toHaveBeenCalledWith(materialRequest);
		//
		// 		// Reset mock
		// 		mockConfigService.get.mockImplementation((key: string) => {
		// 			if (key === 'MEDIAHAVEN_EXPORT_JOB_RETRY_DELAY_HOURS') {
		// 				return '1';
		// 			}
		// 			return key;
		// 		});
		// 	});
		//
		// 	it('should use default of 1 hour when MEDIAHAVEN_EXPORT_JOB_RETRY_DELAY_HOURS is not set', async () => {
		// 		// Configure to return undefined for the delay
		// 		mockConfigService.get.mockImplementation((key: string) => {
		// 			if (key === 'MEDIAHAVEN_EXPORT_JOB_RETRY_DELAY_HOURS') {
		// 				return undefined;
		// 			}
		// 			return key;
		// 		});
		//
		// 		// Material request updated 45 minutes ago - should delay with default 1 hour delay
		// 		const materialRequest = createMockMaterialRequest({
		// 			downloadRetries: 0,
		// 			updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
		// 		});
		// 		const job = createMockMediahavenJob({
		// 			ExportJobId: materialRequest.downloadJobId,
		// 			Status: MamJobStatus.Failed,
		// 		});
		//
		// 		mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
		// 			materialRequest,
		// 		]);
		// 		mockFetch.mockResolvedValue({
		// 			status: 200,
		// 			json: () => Promise.resolve({ Results: [job] }),
		// 		});
		//
		// 		const createExportJobSpy = vi.spyOn(service, 'createExportJob');
		// 		createExportJobSpy.mockResolvedValue('new-job-id');
		//
		// 		await service.checkUnresolvedJobs();
		//
		// 		// With default 1-hour delay, 45 minutes is not enough - should not retry
		// 		expect(createExportJobSpy).not.toHaveBeenCalled();
		//
		// 		// Reset mock
		// 		mockConfigService.get.mockImplementation((key: string) => {
		// 			if (key === 'MEDIAHAVEN_EXPORT_JOB_RETRY_DELAY_HOURS') {
		// 				return '1';
		// 			}
		// 			return key;
		// 		});
		// 	});
		// });

		describe('Error handling', () => {
			it('should continue processing other requests when one fails', async () => {
				const successRequest = createMockMaterialRequest({
					id: 'success-request',
					downloadJobId: 'success-job',
				});
				const errorRequest = createMockMaterialRequest({
					id: 'error-request',
					downloadJobId: 'error-job',
				});

				const successJob = createMockMediahavenJob({
					ExportJobId: 'success-job',
					Status: MamJobStatus.Waiting,
				});

				mockMaterialRequestsService.findAllWithUnresolvedDownload.mockResolvedValue([
					errorRequest,
					successRequest,
				]);
				mockMaterialRequestsService.updateMaterialRequest.mockImplementation((id) => {
					if (id === 'error-request') {
						return Promise.reject(new Error('Database error'));
					}
					return Promise.resolve(successRequest);
				});
				mockFetch.mockResolvedValue({
					status: 200,
					json: () =>
						Promise.resolve({
							Results: [successJob, { ...successJob, ExportJobId: 'error-job' }],
						}),
				});

				// Should not throw
				await expect(service.checkUnresolvedJobs()).resolves.not.toThrow();

				// Success request should still be processed
				expect(mockMaterialRequestsService.updateMaterialRequest).toHaveBeenCalledWith(
					'success-request',
					expect.objectContaining({
						download_status: Lookup_App_Material_Request_Download_Status_Enum.Pending,
					})
				);
			});
		});
	});
});
