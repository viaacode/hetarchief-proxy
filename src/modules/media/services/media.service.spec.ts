import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { cloneDeep } from 'lodash';
import nock from 'nock';

import { Configuration } from '~config';

import objectIe from './__mocks__/object_ie';
import { MediaService } from './media.service';

import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
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

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	getPlayerToken: jest.fn(),
	getPlayableUrl: jest.fn(),
	getEmbedUrl: jest.fn(),
	resolveThumbnailUrl: jest.fn(),
	getThumbnailToken: jest.fn(),
	getThumbnailUrl: jest.fn(),
	getThumbnailPath: jest.fn(),
};

const mockObjectSchemaIdentifier = objectIe.data.object_ie[0].schema_identifier;

const getMockMediaResponse = () => ({
	hits: {
		total: {
			value: 2,
		},
		hits: [
			{
				_source: {
					_id: '4f1mg9x363',
					schema_name: 'Op de boerderij',
				},
			},
			{
				_source: {
					_id: '8911p09j1g',
					schema_name: 'Durf te vragen R002 A0001',
				},
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
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		mediaService = module.get<MediaService>(MediaService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(mediaService).toBeDefined();
	});

	describe('adaptESResponse', () => {
		it('returns the input if no hits were found', async () => {
			const esResponse = { hits: { total: { value: 0 } } };
			const result = await mediaService.adaptESResponse(esResponse, 'referer');
			expect(result).toEqual(esResponse);
		});
	});

	describe('findAll', () => {
		it('returns the es response from the main _search endpoint if no index is specified', async () => {
			nock('http://elasticsearch/').post('/_search').reply(201, getMockMediaResponse());
			const response = await mediaService.findAll({}, null, 'referer');
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});

		it('returns the es response from the specific index _search endpoint if the index is specified', async () => {
			nock('http://elasticsearch/')
				.post('/my-index/_search')
				.reply(201, getMockMediaResponse());
			const response = await mediaService.findAll({}, 'my-index', 'referer');
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});

		it('returns a 404 not found if the index is unknown', async () => {
			nock('http://elasticsearch/').post('/my-index/_search').reply(404, 'not found');
			let error;
			try {
				await mediaService.findAll({}, 'my-index', 'referer');
			} catch (e) {
				error = e.response;
			}
			expect(error.body).toEqual('not found');
			expect(error.statusCode).toEqual(404);
		});

		it('throws an exception when a non-404 error occurs', async () => {
			nock('http://elasticsearch/').post('/my-index/_search').reply(500, 'unknown');
			let error;
			try {
				await mediaService.findAll({}, 'my-index', 'referer');
			} catch (e) {
				error = e.response;
			}
			expect(error.statusCode).toEqual(500);
		});
	});

	describe('findBySchemaIdentifier', () => {
		it('returns the full object details as retrieved from the DB', async () => {
			mockDataService.execute.mockResolvedValueOnce(objectIe);
			const response = await mediaService.findBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				'referer'
			);
			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.partOfSeries.length).toBe(1);
			expect(response.maintainerId).toEqual('OR-rf5kf25');
			expect(response.contactInfo.address.postalCode).toBe('1043');
			expect(response.copyrightHolder).toEqual('vrt');
			expect(response.keywords.length).toBeGreaterThan(10);
		});

		it('returns an empty array if no representations were found', async () => {
			const objectIeMock = cloneDeep(objectIe);
			objectIeMock.data.object_ie[0].premis_is_represented_by = null;
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			const response = await mediaService.findBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				'referer'
			);

			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.representations).toEqual([]);
		});

		it('returns an empty array if no files were found', async () => {
			const objectIeMock = cloneDeep(objectIe);
			objectIeMock.data.object_ie[0].premis_is_represented_by[0].premis_includes = null;
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			const response = await mediaService.findBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				'referer'
			);

			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.representations[0].files).toEqual([]);
		});

		it('throws a notfoundexception if the object was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					object_ie: [],
				},
			});
			let error;
			try {
				await mediaService.findBySchemaIdentifier(mockObjectSchemaIdentifier, 'referer');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: `Object IE with id '${mockObjectSchemaIdentifier}' not found`,
				statusCode: 404,
			});
		});
	});

	describe('getRelated', () => {
		it('returns the related objects for a given id and meemooIdentifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(objectIe);
			const response = await mediaService.getRelated(
				'es-index-1',
				mockObjectSchemaIdentifier,
				'8911p09j1g',
				'referer'
			);
			expect(response.items.length).toEqual(1);
		});
	});

	describe('getSimilar', () => {
		it('returns similar objects for a given id', async () => {
			nock('http://elasticsearch/')
				.post('/my-index/_search')
				.reply(201, getMockMediaResponse());
			const response = await mediaService.getSimilar(
				mockObjectSchemaIdentifier,
				'my-index',
				'referer'
			);
			expect(response.hits.total.value).toBe(2);
			expect(response.hits.hits.length).toBe(2);
		});
	});
});
