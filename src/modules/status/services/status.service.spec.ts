import { DataService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import packageJson from '../../../../package.json';
import { StatusService } from '../services/status.service';

import { MediaService } from '~modules/media/services/media.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockMediaService: Partial<Record<keyof MediaService, jest.SpyInstance>> = {
	executeQuery: jest.fn(),
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockStatus = {
	name: 'HetArchief proxy service',
	version: packageJson.version,
};

describe('StatusService', () => {
	let statusService: StatusService;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			providers: [
				StatusService,
				{
					provide: MediaService,
					useValue: mockMediaService,
				},
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		statusService = app.get<StatusService>(StatusService);
	});

	describe('getStatus', () => {
		it('should return the name and version of the app', () => {
			expect(statusService.getStatus()).toEqual(mockStatus);
		});
	});

	describe('getStatusFull', () => {
		it('should return the name and version of the app and the graphql and elasticsearch connectivity', async () => {
			mockDataService.execute.mockReturnValueOnce({
				data: { object_ie: [{ schema_identifier: '1' }] },
			});
			mockMediaService.executeQuery.mockReturnValueOnce({
				hits: {
					hits: [{ _id: '1' }],
				},
			});
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'reachable',
				elasticsearch: 'reachable',
			});
		});

		it('should return graphql and elasticsearch unreachable if no data is returned', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { object_ie: [] },
			});
			mockMediaService.executeQuery.mockResolvedValueOnce({
				hits: {
					hits: [],
				},
			});
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'not accessible',
				elasticsearch: 'not accessible',
			});
		});

		it('should return graphql and elasticsearch unreachable if throw error', async () => {
			mockDataService.execute.mockRejectedValueOnce({ message: 'timeout' });
			mockMediaService.executeQuery.mockRejectedValueOnce({ message: 'timeout' });
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'not accessible',
				elasticsearch: 'not accessible',
			});
		});
	});
});
