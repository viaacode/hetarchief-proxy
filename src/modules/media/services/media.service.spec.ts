import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { cloneDeep } from 'lodash';
import nock from 'nock';

import { Configuration } from '~config';

import { Media } from '../media.types';

import { MediaService } from './media.service';

import { GetObjectDetailBySchemaIdentifierQuery } from '~generated/graphql-db-types-hetarchief';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';
import { mockObjectIe } from '~modules/media/services/__mocks__/object_ie';
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

const mockObjectSchemaIdentifier = mockObjectIe.data.object_ie[0].schema_identifier;

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

		it('merges film aggregations with an existing video bucket', async () => {
			const esResponse = {
				aggregations: {
					dcterms_format: {
						buckets: [
							{ key: 'film', doc_count: 1 },
							{ key: 'video', doc_count: 1 },
						],
					},
				},
			};
			const result = await mediaService.adaptESResponse(esResponse, 'referer');
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(2);
		});

		it('converts film bucket to video bucket if there was no video buckets', async () => {
			const esResponse = {
				aggregations: {
					dcterms_format: {
						buckets: [{ key: 'film', doc_count: 1 }],
					},
				},
			};
			const result = await mediaService.adaptESResponse(esResponse, 'referer');
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].key).toEqual('video');
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(1);
		});
	});

	describe('adaptMetadata', () => {
		it('returns adapted metadata', () => {
			const media = mediaService.adapt(mockObjectIe.data.object_ie[0]);
			const result = mediaService.adaptMetadata(media);
			expect(result.representations).toBeUndefined();
			expect(result.thumbnailUrl).toBeUndefined();
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

	describe('findMetadataBySchemaIdentifier', () => {
		it('returns the metadata object details', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const response = await mediaService.findMetadataBySchemaIdentifier(
				mockObjectSchemaIdentifier
			);
			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.representations).toBeUndefined();
			expect(response.thumbnailUrl).toBeUndefined();
		});
	});

	describe('findBySchemaIdentifier', () => {
		it('returns the full object details as retrieved from the DB', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const response = await mediaService.findBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				'referer'
			);
			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.maintainerId).toEqual('OR-rf5kf25');
			expect(response.contactInfo.address.postalCode).toBe('1043');
			expect(response.copyrightHolder).toEqual('vrt');
			expect(response.keywords.length).toBeGreaterThan(10);
		});

		it('returns an empty array if no representations were found', async () => {
			const objectIeMock = cloneDeep(mockObjectIe);
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
			const objectIeMock = cloneDeep(mockObjectIe);
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
			const mockData: GetObjectDetailBySchemaIdentifierQuery = {
				object_ie: [],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
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

	describe('convertObjectToXml', () => {
		it('returns the xml version of an object', () => {
			const xml = mediaService.convertObjectToXml({ id: '1' } as unknown as Media);
			expect(xml.startsWith('<object>')).toBeTruthy();
		});
	});

	describe('convertObjectsToXml', () => {
		it('returns the xml version of an array of objects', () => {
			const metadata = mediaService.adaptMetadata(
				mediaService.adapt(mockObjectIe.data.object_ie[0])
			);
			const xml = mediaService.convertObjectsToXml([metadata]);
			expect(xml.startsWith('<objects>')).toBeTruthy();
		});
	});

	describe('findAllObjectMetadataByCollectionId', () => {
		it('returns the metadata objects for a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: { users_folder_ie: [{ ie: mockObjectIe.data.object_ie[0] }] },
			});
			const result = await mediaService.findAllObjectMetadataByCollectionId(
				'collection-1',
				'user-1'
			);
			expect(result.length).toEqual(1);
		});

		it('throws an exception if no objects were found', async () => {
			mockDataService.execute.mockResolvedValueOnce({ data: { users_folder_ie: [] } });
			let error;
			try {
				await mediaService.findAllObjectMetadataByCollectionId('collection-1', 'user-1');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({ message: 'Not Found', statusCode: 404 });
		});
	});

	describe('getLimitedMetadata', () => {
		it('returns a limited metadata set for a media object', () => {
			const t = mediaService.adapt(mockObjectIe.data.object_ie[0]);
			const limited = mediaService.getLimitedMetadata(t);
			expect(limited.keywords).toBeUndefined();
			expect(limited.representations).toBeUndefined();
			expect(limited.schemaIdentifier).toEqual(
				'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793'
			);
		});
	});

	describe('getRelated', () => {
		it('returns the related objects for a given id and meemooIdentifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
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
