import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { cloneDeep } from 'lodash';

import { IeObjectsSearchFilterField, Operator } from '../elasticsearch/elasticsearch.consts';
import {
	AutocompleteField,
	type ElasticsearchResponse,
	IeObjectLicense,
	IeObjectRepresentation,
	IeObjectType,
} from '../ie-objects.types';
import {
	mockChildrenIeObjects,
	mockGqlIeObjectFindByFolderId,
	mockGqlIeObjectFindByFolderIdResult,
	mockGqlSitemapObject,
	mockIeObject1,
	mockIeObject2,
	mockIeObjectDefaultLimitedMetadata,
	mockIeObjectEmpty,
	mockIeObjectLimitedInFolder,
	mockParentIeObject,
	mockSitemapObject,
	mockUser,
} from '../mocks/ie-objects.mock';

import { IeObjectsService } from './ie-objects.service';

import type { FindIeObjectsForSitemapQuery } from '~generated/graphql-db-types-hetarchief';
import {
	cleanupRepresentations1,
	cleanupRepresentations2,
	cleanupRepresentations3,
	cleanupRepresentations4,
	cleanupRepresentations5,
	mockAutocompleteQueryResponseCreators,
	mockAutocompleteQueryResponseNewspaperSeries,
	representationsNewspaper,
} from '~modules/ie-objects/services/ie-objects.service.mocks';
import {
	IeObjectDetailResponseIndex,
	type IeObjectDetailResponseTypes,
} from '~modules/ie-objects/services/ie-objects.service.types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName } from '~modules/users/types';
import { mockVisitApproved } from '~modules/visits/services/__mocks__/cp_visit';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitAccessType } from '~modules/visits/types';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	getPlayerToken: jest.fn(),
	getPlayableUrl: jest.fn(),
	getEmbedUrl: jest.fn(),
	resolveThumbnailUrl: jest.fn(),
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

const mockIeObject2Metadata =
	mockIeObject2[IeObjectDetailResponseIndex.IeObject].graph_intellectual_entity[0];
const mockObjectSchemaIdentifier = mockIeObject2Metadata.schema_identifier;
const mockObjectId = mockIeObject2Metadata.id;

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
			const result = await ieObjectsService.adaptESResponse(esResponse);
			expect(result).toEqual(esResponse);
		});

		it('merges film aggregations with an existing video bucket', async () => {
			const esResponse = {
				aggregations: {
					dcterms_format: {
						buckets: [
							{ key: IeObjectType.VIDEO, doc_count: 1 },
							{ key: IeObjectType.FILM, doc_count: 1 },
							{ key: IeObjectType.VIDEO_FRAGMENT, doc_count: 1 },
						],
					},
				},
			} as ElasticsearchResponse;
			const result = await ieObjectsService.adaptESResponse(esResponse);
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(3);
		});

		it('converts film bucket to video bucket if there was no video buckets', async () => {
			const esResponse = {
				aggregations: {
					dcterms_format: {
						buckets: [{ key: IeObjectType.FILM, doc_count: 1 }],
					},
				},
			} as ElasticsearchResponse;
			const result = await ieObjectsService.adaptESResponse(esResponse);
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].key).toEqual(IeObjectType.VIDEO);
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(1);
		});
	});

	describe('findMetadataBySchemaIdentifier', () => {
		it('returns the metadata object details', async () => {
			const mockFindByIeObjectIdFunc = jest.fn();
			mockFindByIeObjectIdFunc.mockResolvedValueOnce(mockIeObject1);
			ieObjectsService.findByIeObjectId = mockFindByIeObjectIdFunc;
			const response = await ieObjectsService.findMetadataByIeObjectId(
				mockObjectId,
				'referer',
				'127.0.0.1'
			);
			expect(response.schemaIdentifier).toEqual(mockIeObject1.schemaIdentifier);
			expect(response.pages).toBeUndefined();
			expect(response.thumbnailUrl).toBeUndefined();
		});
	});

	describe('findBySchemaIdentifier', () => {
		it('returns the full object details as retrieved from the DB', async () => {
			// Mock the ie object
			for (const mockObject2Response of mockIeObject2) {
				mockDataService.execute.mockResolvedValueOnce(mockObject2Response);
			}

			// Mock the parent object
			const mockParentIeObject = cloneDeep(mockIeObject2);
			mockParentIeObject[
				IeObjectDetailResponseIndex.IeObject
			].graph_intellectual_entity[0].bibframe_edition = 'test_bibframe_edition';
			mockParentIeObject[IeObjectDetailResponseIndex.IsPartOf] = {
				isPartOf: [],
			};
			for (const mockParentIeObjectResponse of mockParentIeObject) {
				mockDataService.execute.mockResolvedValueOnce(mockParentIeObjectResponse);
			}

			// Fetch the object
			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				'referer',
				'127.0.0.1'
			);

			// Validate the object
			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.maintainerId).toEqual(mockIeObject2Metadata.schemaMaintainer.org_identifier);
			expect(ieObject.copyrightHolder).toEqual(
				mockIeObject2[IeObjectDetailResponseIndex.SchemaCopyrightHolder].schemaCopyrightHolder
					.map((item) => item.schema_copyright_holder)
					.join(', ') || undefined
			);
			expect(ieObject.keywords?.length || 0).toEqual(
				mockIeObject2[IeObjectDetailResponseIndex.SchemaKeywords].schemaKeywords.length
			);

			// Check parent ie and current ie info is merged: https://meemoo.atlassian.net/browse/ARC-2135
			expect(ieObject.bibframeEdition).toEqual(
				mockParentIeObject[IeObjectDetailResponseIndex.IeObject].graph_intellectual_entity[0]
					.bibframe_edition
			);
		});

		it('returns an empty array if no representations were found', async () => {
			const objectIeMock = cloneDeep(mockIeObject2);

			// set representations of object to empty array
			objectIeMock[
				IeObjectDetailResponseIndex.IsRepresentedBy
			].graph__intellectual_entity[0].isRepresentedBy = [];
			// set representations of child objects to empty array
			objectIeMock[
				IeObjectDetailResponseIndex.HasPart
			].graph_intellectual_entity[0].isRepresentedBy = [];

			mockDataService.execute.mockReset();
			for (const mockObject2Response of objectIeMock) {
				mockDataService.execute.mockResolvedValueOnce(mockObject2Response);
			}

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.schemaIdentifier).toEqual(mockIeObject2Metadata.schema_identifier);
			expect(ieObject.pages).toEqual([]);
		});

		it('returns an empty array if no files were found', async () => {
			const objectIeMock = cloneDeep(mockIeObject2);
			objectIeMock[IeObjectDetailResponseIndex.HasPart].graph_intellectual_entity = [];
			objectIeMock[IeObjectDetailResponseIndex.IsRepresentedBy].graph__intellectual_entity[0] = {
				isRepresentedBy: [
					{
						...(objectIeMock[IeObjectDetailResponseIndex.IsRepresentedBy]
							.graph__intellectual_entity[0]?.isRepresentedBy || {}),
						includes: [],
					},
				],
			};
			for (const mockObject2Response of objectIeMock) {
				mockDataService.execute.mockResolvedValueOnce(mockObject2Response);
			}

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.pages[0]?.representations[0].files).toEqual([]);
		});

		it('throws an error when no objects were found', async () => {
			const mockData: Readonly<IeObjectDetailResponseTypes> = mockIeObjectEmpty;
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const ieObject = await ieObjectsService.findByIeObjectId('invalidId', 'referer', '127.0.0.1');
			expect(ieObject).toEqual(null);
		});
	});

	describe('findAllObjectMetadataByFolderId', () => {
		it('should return an empty list if there are no objects found in the folder', async () => {
			const mockData = {
				users_folder_ie: [],
			};

			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await ieObjectsService.findAllIeObjectMetadataByFolderId('ids', 'dontMatch');
			expect(response).toHaveLength(0);
		});
		it('should successfully return all objects by folderId adapted', async () => {
			const mockData = {
				users_folder_ie: [mockGqlIeObjectFindByFolderId],
			};

			mockDataService.execute.mockResolvedValueOnce(mockData);
			const result = await ieObjectsService.findAllIeObjectMetadataByFolderId('1', '1');

			expect(result).toEqual([mockGqlIeObjectFindByFolderIdResult]);
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
			const mockData: FindIeObjectsForSitemapQuery = {
				graph_intellectual_entity: [mockGqlSitemapObject],
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

	describe('getParentIeObject', () => {
		it('should return the parent ieObject for a given ieObject', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockParentIeObject);
			const response = await ieObjectsService.getParentIeObject(
				'https://data-int.hetarchief.be/id/entity/2222222222',
				'referer',
				'127.0.0.1'
			);
			expect(response.schemaIdentifier).toEqual(
				mockParentIeObject.graph_intellectual_entity[0].isPartOf.schema_identifier
			);
		});

		it('should return the children for a given ieObject', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockChildrenIeObjects);
			const response = await ieObjectsService.getChildIeObjects(
				'https://data-int.hetarchief.be/id/entity/2222222222',
				'referer',
				'127.0.0.1'
			);
			expect(response.length).toEqual(2);
			expect(response[0].schemaIdentifier).toEqual(
				mockChildrenIeObjects.graph_intellectual_entity[0].hasPart[0].schema_identifier
			);
			expect(response[1].schemaIdentifier).toEqual(
				mockChildrenIeObjects.graph_intellectual_entity[0].hasPart[1].schema_identifier
			);
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
			const result = ieObjectsService.defaultLimitedMetadata(mockIeObject1);
			expect(result).toEqual(mockIeObjectDefaultLimitedMetadata);
		});
	});

	describe('limitObjectInFolder', () => {
		it('should successfully parse the object', () => {
			const result = ieObjectsService.limitObjectInFolder(
				mockIeObject1,
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
			expect(result.plainTextSearchTerms).toEqual(['example']);
			expect(result.parsedSuccessfully).toEqual(true);
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
			expect(result.plainTextSearchTerms).toEqual(['example']);
			expect(result.parsedSuccessfully).toEqual(true);
		});

		it('should return an empty array when there are no filter objects containing "field" with value "query"', () => {
			const result = ieObjectsService.getSimpleSearchTermsFromBooleanExpression([
				{
					field: IeObjectsSearchFilterField.NAME,
					operator: Operator.CONTAINS,
					value: 'example',
				},
			]);
			expect(result.plainTextSearchTerms).toEqual([]);
			expect(result.parsedSuccessfully).toEqual(true);
		});

		it("should return the value without quotes when it's not a valid boolean expression", () => {
			const result = ieObjectsService.getSimpleSearchTermsFromBooleanExpression([
				{
					field: IeObjectsSearchFilterField.QUERY,
					operator: Operator.CONTAINS,
					value: '"example\'',
				},
			]);
			expect(result.plainTextSearchTerms).toEqual(['example']);
			expect(result.parsedSuccessfully).toEqual(false);
		});
	});

	describe('getMetadataAutocomplete', () => {
		it('should return a list of autocomplete strings for newspaper series', async () => {
			ieObjectsService.executeQuery = jest
				.fn()
				.mockResolvedValue(mockAutocompleteQueryResponseNewspaperSeries);
			const result = await ieObjectsService.getMetadataAutocomplete(
				AutocompleteField.newspaperSeriesName,
				'volks',
				{
					filters: [],
					page: 1,
					size: 4,
				}
			);
			expect(result).toEqual([
				'De volksbonder: orgaan van den Liberale Volksbond, Antwerpen',
				'De volksstem: dagblad',
				'Ons volksonderwijs: orgaan van den Bond van Oud-Leerlingen der Stadsscholen van Gent',
				'Het katholiek onderwijs: orgaan der katholieke volksscholen van Vlaamsch België',
			]);
		});

		it('should return a list of autocomplete strings for creator names', async () => {
			ieObjectsService.executeQuery = jest
				.fn()
				.mockResolvedValue(mockAutocompleteQueryResponseCreators);
			const result = await ieObjectsService.getMetadataAutocomplete(
				AutocompleteField.creator,
				'Dirk',
				{
					filters: [],
					page: 1,
					size: 4,
				}
			);
			expect(result).toEqual([
				'Dirk Van Mechelen',
				'Kabinet Dirk Van Mechelen, Vlaams minister van Financiën en Begroting en Ruimtelijk Ordening (2001-2009)',
			]);
		});
	});

	describe('cleanupRepresentations', () => {
		it('should return a list of representations that can be played by the flowplayer with mp4 and without m4a and without mp3', () => {
			const result: IeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations1);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the flowplayer with mp4 and without m4a', () => {
			const result: IeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations2);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the flowplayer with mp3 and without m4a', () => {
			const result: IeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations3);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mpeg');
		});

		it('should return a list of representations that can be played by the flowplayer with mp4 and without mp3', () => {
			const result: IeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations4);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the flowplayer with mp4', () => {
			const result: IeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations5);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the iiif viewer with jp2 and alto.xml and jpeg', () => {
			const result: IeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(representationsNewspaper);
			expect(result).toHaveLength(3);
		});
	});
});
