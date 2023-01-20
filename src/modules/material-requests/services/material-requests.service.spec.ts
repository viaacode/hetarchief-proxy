import { DataService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import { FindMaterialRequestsQuery } from '../../../generated/graphql-db-types-hetarchief';
import { mockMaterialRequest, mockUserProfileId } from '../mocks/material-requests.mocks';

import { MaterialRequestsService } from './material-requests.service';

import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const getDefaultMaterialRequestsResponse = (): {
	app_material_requests: FindMaterialRequestsQuery[];
	app_material_requests_aggregate: { aggregate: { count: number } };
} => ({
	app_material_requests: [mockMaterialRequest as any],
	app_material_requests_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

describe('MaterialRequestsService', () => {
	let materialRequestsService: MaterialRequestsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MaterialRequestsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		materialRequestsService = module.get<MaterialRequestsService>(MaterialRequestsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(materialRequestsService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our material request interface', () => {
			const adapted = materialRequestsService.adapt(mockMaterialRequest);
			// test some sample keys
			expect(adapted.id).toEqual(mockMaterialRequest.id);
			expect(adapted.objectSchemaIdentifier).toEqual(
				mockMaterialRequest.object_schema_identifier
			);
			expect(adapted.profileId).toEqual(mockMaterialRequest.profile_id);
			expect(adapted.reason).toEqual(mockMaterialRequest.reason);
		});

		it('should return null when the material request does not exist', () => {
			const adapted = materialRequestsService.adapt(undefined);
			// test some sample keys
			expect(adapted).toBeNull();
		});

		it('returns null on invalid input', () => {
			const adapted = materialRequestsService.adapt(null);
			expect(adapted).toBeNull();
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all material requests', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
				{
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

		it('can filter on userProfileId', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
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
	});

	describe('findById', () => {
		it('returns a single material request', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findById('1');
			expect(response.id).toBe(mockMaterialRequest.id);
		});

		it('throws a notfoundexception if the material request was not found', async () => {
			const mockData: FindMaterialRequestsQuery = {
				app_material_requests: [],
				app_material_requests_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try {
				await materialRequestsService.findById('unknown-id');
			} catch (error) {
				expect(error.response).toEqual({
					error: 'Not Found',
					message: "Material Request with id 'unknown-id' not found",
					statusCode: 404,
				});
			}
		});
	});
});
