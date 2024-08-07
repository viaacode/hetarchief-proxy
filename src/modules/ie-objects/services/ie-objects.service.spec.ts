import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Cache } from 'cache-manager';
import { cloneDeep } from 'lodash';
import nock from 'nock';

import { type Configuration } from '~config';

import { IeObjectsSearchFilterField, Operator } from '../elasticsearch/elasticsearch.consts';
import { type ElasticsearchResponse, IeObjectLicense } from '../ie-objects.types';
import {
	mockGqlIeObjectFindByCollectionId,
	mockGqlIeObjectFindByCollectionIdResult,
	mockGqlIeObjectTuples,
	mockGqlSitemapObject,
	mockIeObject,
	mockIeObjectDefaultLimitedMetadata,
	mockIeObjectLimitedInFolder,
	mockObjectIe,
	mockSitemapObject,
	mockUser,
} from '../mocks/ie-objects.mock';

import { IeObjectsService } from './ie-objects.service';

import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName } from '~modules/users/types';
import { mockVisitApproved } from '~modules/visits/services/__mocks__/cp_visit';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitAccessType } from '~modules/visits/types';
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
	findAll: jest.fn(),
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findAll: jest.fn(),
};

const mockCacheService: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	wrap: jest.fn().mockImplementation((key, cb) => cb()),
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
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheService,
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
			const result = await ieObjectsService.adaptESResponse(esResponse, 'referer', '');
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
			const result = await ieObjectsService.adaptESResponse(esResponse, 'referer', '');
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
			const result = await ieObjectsService.adaptESResponse(esResponse, 'referer', '');
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].key).toEqual('video');
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(1);
		});
	});

	describe('findMetadataBySchemaIdentifier', () => {
		it('returns the metadata object details', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const response = await ieObjectsService.findMetadataBySchemaIdentifier(
				mockObjectSchemaIdentifier,
				''
			);
			expect(response.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(response.representations).toBeUndefined();
			expect(response.thumbnailUrl).toBeUndefined();
		});
	});

	describe('findBySchemaIdentifier', () => {
		it('returns the full object details as retrieved from the DB', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const ieObjects = await ieObjectsService.findBySchemaIdentifiers(
				[mockObjectSchemaIdentifier],
				'referer',
				''
			);
			const ieObject = ieObjects[0];
			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.maintainerId).toEqual('OR-rf5kf25');
			expect(ieObject.copyrightHolder).toEqual('vrt');
			expect(ieObject.keywords.length).toBeGreaterThan(10);
		});

		it('returns an empty array if no representations were found', async () => {
			const objectIeMock = cloneDeep(mockObjectIe);
			objectIeMock.object_ie[0].premis_is_represented_by = null;
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			const ieObjects = await ieObjectsService.findBySchemaIdentifiers(
				[mockObjectSchemaIdentifier],
				'referer',
				''
			);

			const ieObject = ieObjects[0];
			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.representations).toEqual([]);
		});

		it('returns an empty array if no files were found', async () => {
			const objectIeMock = cloneDeep(mockObjectIe);
			objectIeMock.object_ie[0].premis_is_represented_by[0].premis_includes = null;
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			const ieObjects = await ieObjectsService.findBySchemaIdentifiers(
				[mockObjectSchemaIdentifier],
				'referer',
				''
			);

			const ieObject = ieObjects[0];
			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.representations[0].files).toEqual([]);
		});

		it('throws an error when no objects were found', async () => {
			const mockData = {
				object_ie: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const ieObjects = await ieObjectsService.findBySchemaIdentifiers(
				['invalidId'],
				'referer',
				''
			);
			expect(ieObjects).toEqual([]);
		});
	});

	describe('findAllObjectMetadataByCollectionId', () => {
		it('should throw an error when there are no objects found with the collectionId', async () => {
			const mockData = {
				users_folder_ie: [],
			};

			mockDataService.execute.mockResolvedValueOnce(mockData);

			try {
				await ieObjectsService.findAllObjectMetadataByCollectionId('ids', 'dontMatch');
				fail('findAllObjectMetadataByCollectionId should have thrown an error');
			} catch (err) {
				expect(err.name).toEqual('NotFoundException');
			}
		});
		it('should successfully return all objects by collectionId adapted', async () => {
			const mockData = {
				users_folder_ie: [mockGqlIeObjectFindByCollectionId],
			};

			mockDataService.execute.mockResolvedValueOnce(mockData);
			const result = await ieObjectsService.findAllObjectMetadataByCollectionId('1', '1');

			expect(result).toEqual([mockGqlIeObjectFindByCollectionIdResult]);
		});
	});

	describe('findObjectsForSitemap', () => {
		it('should throw an error when it fails to get object', async () => {
			mockDataService.execute.mockResolvedValueOnce('');
			try {
				await ieObjectsService.findIeObjectsForSitemap(
					[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
					0,
					50
				);
				fail('findIeObjectsForSitemap should have thrown an error');
			} catch (err) {
				expect(err.message).toEqual('Failed getting ieObjects for sitemap');
			}
		});

		it('should successfully return all objects adapted for sitemap', async () => {
			const mockData = {
				object_ie: [mockGqlSitemapObject],
			};

			mockDataService.execute.mockResolvedValueOnce(mockData);
			const result = await ieObjectsService.findIeObjectsForSitemap(
				[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
				0,
				50
			);

			expect(result.items).toEqual([mockSitemapObject]);
		});
	});

	describe('countRelated', () => {
		it('should succesfully count the related objects', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				object_ie: mockGqlIeObjectTuples,
			});

			const result = await ieObjectsService.countRelated(['1', '2', '3']);

			expect(result).toEqual({
				s46h14z19k: 1,
				w37kp8850k_001_wav: 1,
				x921c4s60t: 2,
			});
		});
	});

	describe('getRelated', () => {
		it('returns the related objects for a given id and meemooIdentifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockObjectIe);
			const response = await ieObjectsService.getRelated(
				mockObjectSchemaIdentifier,
				'8911p09j1g',
				'referer',
				'',
				{ maintainerId: 'my-index' }
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
				'referer',
				'',
				{ maintainerId: 'my-index' },
				4,
				undefined
			);
			expect(response.items.length).toBe(2);
			expect(response.items.length).toBe(2);
		});
	});

	describe('executeQuery', () => {
		it('should return the result when the fetch is successful', async () => {
			const esIndex = 'esIndexValue';
			nock('http://elasticsearch').post(`/${esIndex}/_search`).reply(200, {});

			const result = await ieObjectsService.executeQuery(esIndex, 'query');

			expect(result).toEqual({});
		});

		it('should log and throw an error when the fetch is unsuccessful', async () => {
			const esIndex = 'esIndexValue';
			nock('http://elasticsearch').post(`/${esIndex}/_search`).replyWithError('');

			try {
				await ieObjectsService.executeQuery(esIndex, 'query');
				fail('executeQuery should have thrown an error');
			} catch (err) {
				expect(err.name).toEqual('RequestError');
			}
		});
	});

	describe('getVisitorSpaceAccessInfoFromUser', () => {
		it('should return empty arrays when the user is not logged in', async () => {
			const user = { ...mockUser, id: null };
			const result = await ieObjectsService.getVisitorSpaceAccessInfoFromUser(
				new SessionUserEntity(user)
			);

			expect(result).toEqual({
				objectIds: [],
				visitorSpaceIds: [],
			});
			user.id = 'e791ecf1-e121-4c54-9d2e-34524b6467c6';
		});

		it('should return empty arrays when the user has no approved visits', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce({
				items: [],
			});

			const result = await ieObjectsService.getVisitorSpaceAccessInfoFromUser(
				new SessionUserEntity({
					...mockUser,
					groupId: GroupId.VISITOR,
					groupName: GroupName.VISITOR,
				})
			);

			expect(result).toEqual({
				objectIds: [],
				visitorSpaceIds: [],
			});
		});

		it('should return Visitor Access Info from user that has approved visits', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce({
				items: [{ ...mockVisitApproved, accessType: VisitAccessType.Full }],
			});

			const result = await ieObjectsService.getVisitorSpaceAccessInfoFromUser(
				new SessionUserEntity({
					...mockUser,
					groupId: GroupId.VISITOR,
					groupName: GroupName.VISITOR,
				})
			);

			expect(result).toEqual({
				objectIds: [mockVisitApproved?.accessibleObjectIds],
				visitorSpaceIds: [mockVisitApproved?.spaceMaintainerId],
			});
		});
	});

	describe('defaultLimitedMetadata', () => {
		it('should successfully parse the object', () => {
			const result = ieObjectsService.defaultLimitedMetadata(mockIeObject);
			expect(result).toEqual(mockIeObjectDefaultLimitedMetadata);
		});
	});

	describe('limitObjectInFolder', () => {
		it('should successfully parse the object', () => {
			const result = ieObjectsService.limitObjectInFolder(
				mockIeObject,
				new SessionUserEntity(mockUser),
				{ visitorSpaceIds: ['1'], objectIds: ['1'] }
			);
			expect(result).toEqual(mockIeObjectLimitedInFolder);
		});
	});

	describe('getSimpleSearchTermsFromBooleanExpression', () => {
		it('should return the value of the filter when the field is query', () => {
			const result = ieObjectsService.getSimpleSearchTermsFromBooleanExpression([
				{
					field: IeObjectsSearchFilterField.QUERY,
					operator: Operator.CONTAINS,
					value: 'example',
				},
			]);
			expect(result).toEqual(['example']);
		});

		it('should only return the value of the filter where the field is "query"', () => {
			const result = ieObjectsService.getSimpleSearchTermsFromBooleanExpression([
				{
					field: IeObjectsSearchFilterField.QUERY,
					operator: Operator.CONTAINS,
					value: 'example',
				},
				{
					field: IeObjectsSearchFilterField.NAME,
					operator: Operator.CONTAINS,
					value: 'example2',
				},
			]);
			expect(result).toEqual(['example']);
		});
		it('should return an empty array when there are no filter objects containing "field" with value "query"', () => {
			const result = ieObjectsService.getSimpleSearchTermsFromBooleanExpression([
				{
					field: IeObjectsSearchFilterField.NAME,
					operator: Operator.CONTAINS,
					value: 'example',
				},
			]);
			expect(result).toEqual([]);
		});
	});
});
