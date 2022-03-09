import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import objectIe from './__mocks__/object_ie';
import { MediaService } from './media.service';

import { DataService } from '~modules/data/services/data.service';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: string): string | boolean => {
		if (key === 'elasticSearchUrl') {
			return 'http://elasticsearch'; // should be a syntactically valid url
		}
		if (key === 'ticketServiceUrl') {
			return 'http://ticketservice';
		}
		if (key === 'mediaServiceUrl') {
			return 'http://mediaservice';
		}
		return key;
	}),
};

const mockDataService = {
	execute: jest.fn(),
};

const mockObjectId = objectIe.data.object_ie[0].schema_identifier;

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
				{
					provide: DataService,
					useValue: mockDataService,
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
		it('returns the full object details as retrieved from the DB', async () => {
			mockDataService.execute.mockResolvedValueOnce(objectIe);
			const response = await mediaService.findById(mockObjectId);
			expect(response.id).toEqual(mockObjectId);
			expect(response.partOfSeries.length).toBe(1);
			expect(response.maintainerId).toEqual('OR-rf5kf25');
			expect(response.contactInfo.address.postalCode).toBe('1043');
			expect(response.copyrightHolder).toEqual('vrt');
			expect(response.keywords.length).toBeGreaterThan(10);
		});

		it('throws a notfoundexception if the object was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					object_ie: [],
				},
			});
			let error;
			try {
				await mediaService.findById(mockObjectId);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: `Object IE with id '${mockObjectId}' not found`,
				statusCode: 404,
			});
		});
	});

	describe('getPlayableUrl', () => {
		it('returns a playable url', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { object_ie_by_pk: { schema_embed_url: '/vrt/item-1' } },
			});
			nock('http://ticketservice/')
				.get('/vrt/item-1')
				.query(true)
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await mediaService.getPlayableUrl('vrt-id', 'referer');
			expect(url).toEqual('http://mediaservice/vrt/item-1?token=secret-jwt-token');
		});

		it('uses the fallback referer if none was set', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { object_ie_by_pk: { schema_embed_url: '/vrt/item-1' } },
			});
			nock('http://ticketservice/')
				.get('/vrt/item-1')
				.query({
					app: 'OR-avo2',
					client: '',
					referer: 'host',
					maxage: 'ticketServiceMaxAge',
				})
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await mediaService.getPlayableUrl('vrt-id', undefined);
			expect(url).toEqual('http://mediaservice/vrt/item-1?token=secret-jwt-token');
		});
	});

	describe('getEmbedUrl', () => {
		it('returns the embedUrl for an item', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { object_ie_by_pk: { schema_embed_url: '/vrt/item-1' } },
			});
			const url = await mediaService.getEmbedUrl('vrt-id');
			expect(url).toEqual('/vrt/item-1');
		});

		it('throws a notfoundexception if the item was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					object_ie_by_pk: null,
				},
			});
			let error;
			try {
				await mediaService.getEmbedUrl('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: "Object IE with id 'unknown-id' not found",
				statusCode: 404,
			});
		});
	});
});
