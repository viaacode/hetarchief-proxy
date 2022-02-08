import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MediaService } from './media.service';

const mockConfigService = {
	get: jest.fn((key: string): string | boolean => {
		if (key === 'elasticSearchUrl') {
			return 'http://elasticsearch'; // should be a syntactically valid url
		}
		return key;
	}),
};

describe('MediaService', () => {
	let mediaService: MediaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MediaService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		mediaService = module.get<MediaService>(MediaService);
	});

	it('services should be defined', () => {
		expect(mediaService).toBeDefined();
	});
});
