import { DataService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';

import packageJson from '../../../../package.json';
import { StatusService } from '../services/status.service';

import type { GetFirstObjectIdQuery } from '~generated/graphql-db-types-hetarchief';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, MockInstance>> = {
	executeQuery: vi.fn(),
	getVisitorSpaceAccessInfoFromUser: vi.fn(() => ({
		objectIds: [],
		visitorSpaceIds: [],
	})),
};

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
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
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
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
			mockDataService.execute.mockResolvedValueOnce({
				graph_intellectual_entity: [{ schema_identifier: '1' }],
			} as GetFirstObjectIdQuery);
			mockIeObjectsService.executeQuery.mockReturnValueOnce({
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
				graph_intellectual_entity: [],
			} as GetFirstObjectIdQuery);
			mockIeObjectsService.executeQuery.mockResolvedValueOnce({
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
			mockIeObjectsService.executeQuery.mockRejectedValueOnce({ message: 'timeout' });
			expect(await statusService.getStatusFull()).toEqual({
				...mockStatus,
				graphql: 'not accessible',
				elasticsearch: 'not accessible',
			});
		});
	});
});
