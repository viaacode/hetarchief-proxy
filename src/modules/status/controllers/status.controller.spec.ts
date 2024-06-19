import { Test, type TestingModule } from '@nestjs/testing';

import { StatusService } from '../services/status.service';

import { StatusController } from './status.controller';

const mockStatusService: Partial<Record<keyof StatusService, jest.SpyInstance>> = {
	getStatus: jest.fn(),
	getStatusFull: jest.fn(),
};

const mockStatus = {
	name: 'HetArchief proxy service',
	version: '0.10.0',
};

describe('StatusController', () => {
	let statusController: StatusController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [StatusController],
			providers: [
				{
					provide: StatusService,
					useValue: mockStatusService,
				},
			],
		}).compile();

		statusController = app.get<StatusController>(StatusController);
	});

	describe('root', () => {
		it('should return the name and version of the app', () => {
			mockStatusService.getStatus.mockReturnValue(mockStatus);
			expect(statusController.getStatusRoot()).toEqual(mockStatus);
		});
	});

	describe('/status', () => {
		it('should return the name and version of the app', () => {
			mockStatusService.getStatus.mockReturnValue(mockStatus);
			expect(statusController.getStatus()).toEqual(mockStatus);
		});
	});

	describe('/status-full', () => {
		it('should return the name and version of the app and the graphql and elasticsearch connectivity', () => {
			mockStatusService.getStatusFull.mockReturnValue(mockStatus);
			expect(statusController.getStatusFull()).toEqual(mockStatus);
		});
	});
});
