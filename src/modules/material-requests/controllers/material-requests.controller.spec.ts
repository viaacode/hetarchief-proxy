import { Test, TestingModule } from '@nestjs/testing';

import {
	mockMaterialRequest1,
	mockMaterialRequestsResponse,
	mockUser,
} from '../mocks/material-requests.mocks';
import { MaterialRequestsService } from '../services/material-requests.service';

import { MaterialRequestsController } from './material-requests.controller';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockMaterialRequestsService: Partial<
	Record<keyof MaterialRequestsService, jest.SpyInstance>
> = {
	findAll: jest.fn(),
	findById: jest.fn(),
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
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		materialRequestsController = module.get<MaterialRequestsController>(
			MaterialRequestsController
		);
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
					permissions: [Permission.VIEW_ANY_MATERIAL_REQUESTS],
				})
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
					permissions: [Permission.VIEW_OWN_MATERIAL_REQUESTS],
				})
			);

			expect(materialRequests).toEqual(mockMaterialRequestsResponse);
		});
	});

	describe('getMaterialRequestById', () => {
		it('should return a material request by id', async () => {
			mockMaterialRequestsService.findById.mockResolvedValueOnce(mockMaterialRequest1);
			const visit = await materialRequestsController.getMaterialRequestById('1');
			expect(visit).toEqual(mockMaterialRequest1);
		});
	});
});
