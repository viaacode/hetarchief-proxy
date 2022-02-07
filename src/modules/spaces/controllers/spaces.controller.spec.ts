import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from '../services/spaces.service';

import { SpacesController } from './spaces.controller';

const mockSpacesResponse = {
	items: [
		{
			id: '1',
			name: 'Space Mountain',
		},
		{
			id: '2',
			name: 'Space X',
		},
	],
};

const mockSpacesService = {
	findAll: jest.fn(),
	findById: jest.fn(),
};

describe('SpacesController', () => {
	let spacesController: SpacesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpacesController],
			imports: [],
			providers: [
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
			],
		}).compile();

		spacesController = module.get<SpacesController>(SpacesController);
	});

	it('should be defined', () => {
		expect(spacesController).toBeDefined();
	});

	describe('getSpaces', () => {
		it('should return all spaces', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces(null);
			expect(spaces.items.length).toEqual(2);
		});
	});

	describe('getSpaceById', () => {
		it('should return a space by id', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.getSpaceById('1');
			expect(space.id).toEqual('1');
		});
	});
});
