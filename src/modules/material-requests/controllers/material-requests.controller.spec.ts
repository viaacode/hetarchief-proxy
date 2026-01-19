import { vi, type MockInstance } from 'vitest';
import { Lookup_App_Material_Request_Requester_Capacity_Enum } from '@meemoo/admin-core-api/dist/src/modules/shared/generated/graphql-db-types-hetarchief';
import { Test, type TestingModule } from '@nestjs/testing';

import { MaterialRequestType } from '../material-requests.types';
import {
	mockMaintainerWithMaterialRequest,
	mockMaterialRequest1,
	mockMaterialRequestsResponse,
	mockUser,
} from '../mocks/material-requests.mocks';
import { MaterialRequestsService } from '../services/material-requests.service';

import { MaterialRequestsController } from './material-requests.controller';

import { PermissionName } from '@viaa/avo2-types';
import { EventsService } from '~modules/events/services/events.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { TestingLogger } from '~shared/logging/test-logger';

const mockMaterialRequestsService: Partial<
	Record<keyof MaterialRequestsService, MockInstance>
> = {
	findAll: vi.fn(),
	findById: vi.fn(),
	findMaintainers: vi.fn(),
	createMaterialRequest: vi.fn(),
	updateMaterialRequestForUser: vi.fn(),
	deleteMaterialRequest: vi.fn(),
};

const mockEventsService: Partial<Record<keyof EventsService, MockInstance>> = {
	insertEvents: vi.fn(),
};

describe('MaterialRequestsController', () => {
	let materialRequestsController: MaterialRequestsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MaterialRequestsController],
			imports: [],
			providers: [
				{
					provide: MaterialRequestsService,
					useValue: mockMaterialRequestsService,
				},
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		materialRequestsController = module.get<MaterialRequestsController>(MaterialRequestsController);
	});

	afterEach(() => {
		mockMaterialRequestsService.findAll.mockRestore();
	});

	it('should be defined', () => {
		expect(materialRequestsController).toBeDefined();
	});

	describe('getMaterialRequests', () => {
		it('should return all material requests for meemoo admin', async () => {
			mockMaterialRequestsService.findAll.mockResolvedValueOnce(mockMaterialRequestsResponse);

			const materialRequests = await materialRequestsController.getMaterialRequests(
				null,
				new SessionUserEntity({
					...mockUser,
					permissions: [PermissionName.VIEW_ANY_MATERIAL_REQUESTS],
				}),
				'referer',
				''
			);

			expect(materialRequests).toEqual(mockMaterialRequestsResponse);
		});
	});

	describe('getPersonalMaterialRequests', () => {
		it('should return all material requests for a user', async () => {
			mockMaterialRequestsService.findAll.mockResolvedValueOnce(mockMaterialRequestsResponse);

			const materialRequests = await materialRequestsController.getPersonalMaterialRequests(
				null,
				new SessionUserEntity({
					...mockUser,
					permissions: [PermissionName.VIEW_OWN_MATERIAL_REQUESTS],
				}),
				'referer',
				''
			);

			expect(materialRequests).toEqual(mockMaterialRequestsResponse);
		});
	});

	describe('getMaterialRequestById', () => {
		it('should return a material request by id', async () => {
			mockMaterialRequestsService.findById.mockResolvedValueOnce(mockMaterialRequest1);
			const response = await materialRequestsController.getMaterialRequestById(
				'1',
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(response).toEqual(mockMaterialRequest1);
		});
	});

	describe('getMaintainersWithMaterialRequests', () => {
		it('should return maintainers with material requests', async () => {
			mockMaterialRequestsService.findMaintainers.mockResolvedValueOnce(
				mockMaintainerWithMaterialRequest
			);
			const response = await materialRequestsController.getMaintainers();
			expect(response).toEqual(mockMaintainerWithMaterialRequest);
		});
	});

	describe('createMaterialRequest', () => {
		it('should create a material request', async () => {
			mockMaterialRequestsService.createMaterialRequest.mockResolvedValueOnce(mockMaterialRequest1);
			const createdMaterialRequest = await materialRequestsController.createMaterialRequest(
				{
					objectSchemaIdentifier: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
					reason: 'voor mijn onderzoek en studie',
					type: MaterialRequestType.VIEW,
					requesterCapacity: Lookup_App_Material_Request_Requester_Capacity_Enum.Education,
					reuseForm: undefined,
				},
				new SessionUserEntity({
					...mockUser,
					permissions: [PermissionName.CREATE_MATERIAL_REQUESTS],
				}),
				'referer',
				''
			);
			expect(createdMaterialRequest).toEqual(mockMaterialRequest1);
		});
	});

	describe('updateMaterialRequest', () => {
		it('should update a material request by id', async () => {
			mockMaterialRequestsService.updateMaterialRequestForUser.mockResolvedValueOnce(
				mockMaterialRequest1
			);
			const updatedMaterialRequest = await materialRequestsController.updateMaterialRequest(
				mockMaterialRequest1.id,
				{
					type: MaterialRequestType.REUSE,
					reason: 'test',
					reuseForm: undefined,
				},
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(updatedMaterialRequest).toEqual(mockMaterialRequest1);
		});
	});

	describe('deleteMaterialRequest', () => {
		it('should delete a material request by id', async () => {
			mockMaterialRequestsService.deleteMaterialRequest.mockResolvedValueOnce(1);

			const response = await materialRequestsController.deleteMaterialRequest(
				mockMaterialRequest1.id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'Material request has been deleted' });
		});

		it('should delete a material request by id', async () => {
			mockMaterialRequestsService.deleteMaterialRequest.mockResolvedValueOnce(0);

			const response = await materialRequestsController.deleteMaterialRequest(
				mockMaterialRequest1.id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({
				status: 'no material requests found with that id: 9471f49f-5ac0-43f5-a74a-09c4c56463a4',
			});
		});
	});
});
