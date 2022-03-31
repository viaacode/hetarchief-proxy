import { Test, TestingModule } from '@nestjs/testing';

import { MediaService } from '../services/media.service';

import { MediaController } from './media.controller';

const getMockMediaResponse = () => ({
	hits: {
		total: {
			value: 2,
		},
		hits: [
			{
				_id: '4f1mg9x363',
				schema_name: 'Op de boerderij',
			},
			{
				_id: '8911p09j1g',
				schema_name: 'Durf te vragen R002 A0001',
			},
		],
	},
});

const mockMediaService: Partial<Record<keyof MediaService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findBySchemaIdentifier: jest.fn(),
	getPlayableUrl: jest.fn(),
	getRelated: jest.fn(),
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

	describe('getMedia', () => {
		it('should return all media items', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			const media = await mediaController.getMedia(null);
			expect(media.hits.total.value).toEqual(2);
			expect(media.hits.hits.length).toEqual(2);
		});
	});

	describe('getPlayableUrl', () => {
		it('should return a playable url', async () => {
			mockMediaService.getPlayableUrl.mockResolvedValueOnce('http://playme');
			const url = await mediaController.getPlayableUrl('referer', { id: '1' });
			expect(url).toEqual('http://playme');
		});
	});

	describe('getMediaById', () => {
		it('should return a media item by id', async () => {
			const mockResponse = getMockMediaResponse();
			mockResponse.hits.total.value = 1;
			mockResponse.hits.hits.shift();
			mockMediaService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);
			const media = await mediaController.getMediaById('1');
			expect(media.hits.total.value).toEqual(1);
			expect(media.hits.hits.length).toEqual(1);
		});
	});

	describe('getRelated', () => {
		it('should get related media items', async () => {
			const mockResponse = { items: [{ id: 2 }, { id: 3 }] };
			mockMediaService.getRelated.mockResolvedValueOnce(mockResponse);
			const media = await mediaController.getRelated('1', '8911p09j1g');
			expect(media.items.length).toEqual(2);
		});
	});

	describe('getMediaOnIndex', () => {
		it('should return all media items in a specific index', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			const media = await mediaController.getMediaOnIndex(null, 'test-index');
			expect(media.hits.total.value).toEqual(2);
			expect(media.hits.hits.length).toEqual(2);
		});
	});
});
