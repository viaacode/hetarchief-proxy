import { Test, TestingModule } from '@nestjs/testing';

import { MediaService } from '../services/media.service';

import { MediaController } from './media.controller';

const mockMediaService = {
	findAll: jest.fn(),
	findById: jest.fn(),
};

describe('MediaController', () => {
	let mediaController: MediaController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MediaController],
			imports: [],
			providers: [
				{
					provide: MediaService,
					useValue: mockMediaService,
				},
			],
		}).compile();

		mediaController = module.get<MediaController>(MediaController);
	});

	it('should be defined', () => {
		expect(mediaController).toBeDefined();
	});
});
