import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { cloneDeep } from 'lodash';
import nock from 'nock';

import { Configuration } from '~config';

import { ElasticsearchResponse } from '../ie-objects.types';
import { mockObjectIe } from '../mocks/ie-objects.mock';

import { IeObjectsService } from './ie-objects.service';

import { VisitsService } from '~modules/visits/services/visits.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'ELASTIC_SEARCH_URL') {
			return 'http://elasticsearch'; // should be a syntactically valid url
		}
		if (key === 'TICKET_SERVICE_URL') {
			return 'http://ticketservice';
		}
		if (key === 'MEDIA_SERVICE_URL') {
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

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	hasAccess: jest.fn(),
};

const mockObjectSchemaIdentifier = mockObjectIe.object_ie[0].schema_identifier;

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

describe('ieObjectsService', () => {
	let ieObjectsService: IeObjectsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				IeObjectsService,
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
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		ieObjectsService = module.get<IeObjectsService>(IeObjectsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(ieObjectsService).toBeDefined();
	});

	describe('adaptESResponse', () => {
		it('returns the input if no hits were found', async () => {
			const esResponse = { hits: { hits: [], total: { value: 0 } } } as ElasticsearchResponse;
			const result = await ieObjectsService.adaptESResponse(esResponse, 'referer');
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
			} as ElasticsearchResponse;
			const result = await ieObjectsService.adaptESResponse(esResponse, 'referer');
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
			} as ElasticsearchResponse;
			const result = await ieObjectsService.adaptESResponse(esResponse, 'referer');
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].key).toEqual('video');
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(1);
		});
	});

	describe('findMetadataBySchemaIdentifier', () => {
		it('returns the metadata object details', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const response = await ieObjectsService.findMetadataBySchemaIdentifier(
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
			const response = await ieObjectsService.findBySchemaIdentifier(
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
			objectIeMock.object_ie[0].premis_is_represented_by = null;
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			const response = await ieObjectsService.findBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				'referer'
			);

			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.representations).toEqual([]);
		});

		it('returns an empty array if no files were found', async () => {
			const objectIeMock = cloneDeep(mockObjectIe);
			objectIeMock.object_ie[0].premis_is_represented_by[0].premis_includes = null;
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			const response = await ieObjectsService.findBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				'referer'
			);

			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.representations[0].files).toEqual([]);
		});
	});

	describe('getRelated', () => {
		it('returns the related objects for a given id and meemooIdentifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const response = await ieObjectsService.getRelated(
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
			const response = await ieObjectsService.getSimilar(
				mockObjectSchemaIdentifier,
				'my-index',
				'referer'
			);
			expect(response.items.length).toBe(2);
			expect(response.items.length).toBe(2);
		});
	});
});
