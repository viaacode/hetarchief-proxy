import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from '../services/spaces.service';

import { SpacesController } from './spaces.controller';

import { DataModule } from '~modules/data';

describe('SpacesController', () => {
	let spacesController: SpacesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpacesController],
			imports: [DataModule],
			providers: [SpacesService], // TODO mock?
		}).compile();

		spacesController = module.get<SpacesController>(SpacesController);
	});

	it('should be defined', () => {
		expect(spacesController).toBeDefined();
	});
});
