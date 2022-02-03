import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from './spaces.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

describe('SpacesService', () => {
	let spacesService: SpacesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpacesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		spacesService = module.get<SpacesService>(SpacesService);
	});

	it('services should be defined', () => {
		expect(spacesService).toBeDefined();
	});
});
