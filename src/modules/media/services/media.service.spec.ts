import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { MediaService } from './media.service';

const mockConfigService = {
	get: jest.fn((key: string): string | boolean => {
		if (key === 'elasticSearchUrl') {
			return 'http://elasticsearch'; // should be a syntactically valid url
		}
		return key;
	}),
};

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

	describe('findAll', () => {
		it('returns the es response from the main _search endpoint if no index is specified', async () => {
			nock('http://elasticsearch/').post('/_search').reply(201, getMockMediaResponse());
			const response = await mediaService.findAll({});
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});

		it('returns the es response from the specific index _search endpoint if the index is specified', async () => {
			nock('http://elasticsearch/')
				.post('/my-index/_search')
				.reply(201, getMockMediaResponse());
			const response = await mediaService.findAll({}, 'my-index');
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});

		it('returns a 404 not found if the index is unknown', async () => {
			nock('http://elasticsearch/').post('/my-index/_search').reply(404, 'not found');
			let error;
			try {
				await mediaService.findAll({}, 'my-index');
			} catch (e) {
				error = e.response;
			}
			expect(error).toEqual({ message: 'Not Found', statusCode: 404 });
		});

		it('throws an exception when a non-404 error occurs', async () => {
			nock('http://elasticsearch/').post('/my-index/_search').reply(500, 'unknown');
			let error;
			try {
				await mediaService.findAll({}, 'my-index');
			} catch (e) {
				error = e.response;
			}
			expect(error.statusCode).toEqual(500);
		});
	});

	describe('findById', () => {
		it('returns the es response from the main _search endpoint if no index is specified', async () => {
			nock('http://elasticsearch/').post('/_search').reply(201, getMockMediaResponse());
			const response = await mediaService.findById('123');
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});

		it('returns the es response from the specific index _search endpoint if the index is specified', async () => {
			nock('http://elasticsearch/')
				.post('/my-index/_search')
				.reply(201, getMockMediaResponse());
			const response = await mediaService.findById('123', 'my-index');
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});

		it('returns a 404 not found if the index is unknown', async () => {
			nock('http://elasticsearch/').post('/my-index/_search').reply(404, 'not found');
			let error;
			try {
				await mediaService.findById('123', 'my-index');
			} catch (e) {
				error = e.response;
			}
			expect(error).toEqual({ message: 'Not Found', statusCode: 404 });
		});
	});
});
