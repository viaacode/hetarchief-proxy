import { Test, TestingModule } from '@nestjs/testing';

import packageJson from '../../../package.json';

import { StatusController } from './status.controller';
import { StatusService } from './status.service';

describe('StatusController', () => {
	let statusController: StatusController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [StatusController],
			providers: [StatusService],
		}).compile();

		statusController = app.get<StatusController>(StatusController);
	});

	describe('root', () => {
		it('should return the name and version of the app', () => {
			expect(statusController.getStatus()).toEqual({
				name: 'HetArchief proxy service',
				version: packageJson.version,
			});
		});
	});
});
