import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { cloneDeep } from 'lodash';
import {
	type MockInstance,
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import { HetArchiefIeObjectRepresentation } from '@viaa/avo2-types';
import { HetArchiefIeObjectLicense, HetArchiefIeObjectType } from '@viaa/avo2-types';
import {
	IeObjectsSearchFilterField,
	Operator,
	RightsLabel,
} from '../elasticsearch/elasticsearch.consts';
import { AutocompleteField, type ElasticsearchResponse } from '../ie-objects.types';
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
	mockIeObjectRightsInfo,
	mockParentIeObject,
	mockSitemapObject,
	mockUser,
} from '../mocks/ie-objects.mock';

import { IeObjectsService } from './ie-objects.service';

import type {
	FindIeObjectsForSitemapQuery,
	GetIeObjectDetailQuery,
} from '~generated/graphql-db-types-hetarchief';
import {
	cleanupRepresentations1,
	cleanupRepresentations2,
	cleanupRepresentations3,
	cleanupRepresentations4,
	cleanupRepresentations5,
	mockAutocompleteQueryResponseCreators,
	mockAutocompleteQueryResponseMentionPersons,
	mockAutocompleteQueryResponseNewspaperSeries,
	representationsNewspaper,
} from '~modules/ie-objects/services/ie-objects.service.mocks';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName } from '~modules/users/types';
import { mockVisitApproved } from '~modules/visits/services/__mocks__/cp_visit';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitAccessType } from '~modules/visits/types';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, MockInstance>> = {
	getPlayerToken: vi.fn(),
	getPlayableUrl: vi.fn(),
	getBrowseUrl: vi.fn(),
	resolveThumbnailUrl: vi.fn(),
	getThumbnailUrl: vi.fn(),
	getThumbnailPath: vi.fn(),
};

const mockVisitsService: Partial<Record<keyof VisitsService, MockInstance>> = {
	hasAccess: vi.fn(),
	findAll: vi.fn(),
};

const mockSpacesService: Partial<Record<keyof SpacesService, MockInstance>> = {
	findAll: vi.fn(),
};

const mockCacheService: Partial<Record<keyof Cache, MockInstance>> = {
	wrap: vi.fn().mockImplementation((key, cb) => cb()),
};

const mockIeObject2Metadata = mockIeObject2.getIeObject[0];
const mockObjectSchemaIdentifier = mockIeObject2Metadata.schema_identifier;
const mockObjectId = mockIeObject2Metadata.id;

describe('ieObjectsService', () => {
	let module: TestingModule;
	let ieObjectsService: IeObjectsService;

	beforeAll(async () => {
		module = await Test.createTestingModule({
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

	afterAll(async () => {
		await module.close();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('services should be defined', () => {
		expect(ieObjectsService).toBeDefined();
	});

	describe('adaptESResponse', () => {
		it('returns the input if the response is undefined', async () => {
			const result = await ieObjectsService.adaptESResponse(undefined);
			expect(result).toEqual(undefined);
		});

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
							{ key: HetArchiefIeObjectType.VIDEO, doc_count: 1 },
							{ key: HetArchiefIeObjectType.FILM, doc_count: 1 },
							{ key: HetArchiefIeObjectType.VIDEO_FRAGMENT, doc_count: 1 },
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
						buckets: [{ key: HetArchiefIeObjectType.FILM, doc_count: 1 }],
					},
				},
			} as ElasticsearchResponse;
			const result = await ieObjectsService.adaptESResponse(esResponse);
			expect(result.aggregations.dcterms_format.buckets.length).toEqual(1);
			expect(result.aggregations.dcterms_format.buckets[0].key).toEqual(
				HetArchiefIeObjectType.VIDEO
			);
			expect(result.aggregations.dcterms_format.buckets[0].doc_count).toEqual(1);
		});
	});

	describe('findMetadataBySchemaIdentifier', () => {
		it('returns the metadata object details', async () => {
			vi.spyOn(ieObjectsService, 'findByIeObjectId').mockResolvedValueOnce(mockIeObject1);

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
			const objectIeMock = cloneDeep(mockIeObject2);
			(objectIeMock.getIeObject[0] as any).rights = {
				reuse_label: mockIeObjectRightsInfo.reuseLabel,
				reuse_category_id: mockIeObjectRightsInfo.reuseCategoryUrl,
				ha_des_license_distributor: mockIeObjectRightsInfo.licenseDistributor,
				reuse_category: {
					id: mockIeObjectRightsInfo.reuseCategoryId,
					label: mockIeObjectRightsInfo.reuseCategoryLabel,
					group: mockIeObjectRightsInfo.reuseCategoryGroup,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);

			// Mock the parent object
			const mockParentIeObject = cloneDeep(mockIeObject2);
			mockParentIeObject.getIeObject[0].bibframe_edition = 'test_bibframe_edition';
			mockParentIeObject.getIsPartOf = [];
			mockDataService.execute.mockResolvedValueOnce(mockParentIeObject);

			// Fetch the object
			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				true,
				'referer',
				'127.0.0.1'
			);

			// Validate the object
			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.maintainerId).toEqual(mockIeObject2Metadata.schemaMaintainer.org_identifier);
			// TODO ARC-3604/ARC-3652: Restore this assertion once ha_des_purl is available in Hasura.
			expect(ieObject.providerPurl).toBeUndefined();
			expect(ieObject.copyrightHolder).toEqual(
				mockIeObject2.getSchemaCopyrightHolder
					.map((item) => item.schema_copyright_holder)
					.join(', ') || undefined
			);
			expect(ieObject.keywords?.length || 0).toEqual(mockIeObject2.getSchemaKeywords.length);
			expect(ieObject.rightsInfo).toEqual(mockIeObjectRightsInfo);

			// Check parent ie and current ie info is merged: https://meemoo.atlassian.net/browse/ARC-2135
			expect(ieObject.bibframeEdition).toEqual(mockParentIeObject.getIeObject[0].bibframe_edition);
		});

		/**
		 * mockIeObject2 is a visitor space object, so it carries no public content licence and
		 * therefore exposes no themes. Themes are only returned for publicly disclosed objects.
		 */
		const mockPublicIeObject = () => {
			const mock = cloneDeep(mockIeObject2);
			mock.getSchemaLicense = [
				...mock.getSchemaLicense,
				{ schema_license: 'VIAA-PUBLIEK-CONTENT' },
			];
			return mock;
		};

		it('maps the themes the object belongs to, keeping the query order', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockPublicIeObject());
			mockDataService.execute.mockResolvedValueOnce(mockPublicIeObject());

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				true,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.themes).toEqual([
				{
					id: '7c4f8d1a-9b2e-4c3d-8a1f-2e5b6c7d8e9f',
					slug: 'pukkelpop',
					nameNl: 'Pukkelpop',
					nameEn: 'Pukkelpop',
					contentPagePathNl: '/themas/pukkelpop',
					contentPagePathEn: '/themes/pukkelpop',
					ieObjectCount: 150,
				},
				{
					id: '3a1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
					slug: 'memorial-van-damme',
					nameNl: 'Memorial Van Damme',
					nameEn: 'Memorial Van Damme',
					contentPagePathNl: null,
					contentPagePathEn: null,
					ieObjectCount: 42,
				},
			]);
		});

		it('returns an empty theme list when the object belongs to no themes', async () => {
			const objectIeMock = mockPublicIeObject();
			objectIeMock.getThemes = [];
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(mockPublicIeObject());

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				true,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.themes).toEqual([]);
		});

		it('withholds the themes of an object without a public content licence', async () => {
			// The client hides them too, but the data must not travel in the response at all
			mockDataService.execute.mockResolvedValueOnce(cloneDeep(mockIeObject2));
			mockDataService.execute.mockResolvedValueOnce(cloneDeep(mockIeObject2));

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				true,
				'referer',
				'127.0.0.1'
			);

			expect(mockIeObject2.getThemes.length).toBeGreaterThan(0);
			expect(ieObject.themes).toEqual([]);
		});

		it('maps rights info from graph.rights when available', async () => {
			const objectIeMock = cloneDeep(mockIeObject2);
			(objectIeMock.getIeObject[0] as any).rights = {
				reuse_label: 'CC0',
				reuse_category_id: RightsLabel.CC0,
				ha_des_license_distributor: 'VRT',
				reuse_category: {
					id: RightsLabel.CC0,
					label: 'CC0',
					group: 'Publiek domein',
				},
			};

			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(mockIeObjectEmpty);

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.rightsInfo).toEqual({
				reuseLabel: 'CC0',
				reuseCategoryUrl: RightsLabel.CC0,
				reuseCategoryId: RightsLabel.CC0,
				reuseCategoryLabel: 'CC0',
				reuseCategoryGroup: 'Publiek domein',
				licenseDistributor: 'VRT',
			});
		});

		it('maps rights info from graph.rights for intra-CP AV content', async () => {
			const objectIeMock = cloneDeep(mockIeObject2);
			objectIeMock.getSchemaLicense = [
				{
					schema_license: HetArchiefIeObjectLicense.INTRA_CP_CONTENT,
				},
			];
			(objectIeMock.getIeObject[0] as any).rights = {
				reuse_label: 'Auteursrechtelijk beschermd',
				reuse_category_id: RightsLabel.IN_COPYRIGHT,
				ha_des_license_distributor: 'ATV',
				reuse_category: {
					id: RightsLabel.IN_COPYRIGHT,
					label: 'Auteursrechtelijk beschermd',
					group: 'Auteursrecht',
				},
			};

			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(mockIeObjectEmpty);

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.rightsInfo).toEqual({
				reuseLabel: 'Auteursrechtelijk beschermd',
				reuseCategoryUrl: RightsLabel.IN_COPYRIGHT,
				reuseCategoryId: RightsLabel.IN_COPYRIGHT,
				reuseCategoryLabel: 'Auteursrechtelijk beschermd',
				reuseCategoryGroup: 'Auteursrecht',
				licenseDistributor: 'ATV',
			});
		});

		it('leaves rights info empty when graph.rights is not available', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockIeObject2);
			mockDataService.execute.mockResolvedValueOnce(mockIeObjectEmpty);

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.rightsInfo).toBeUndefined();
		});

		it('returns an empty array if no representations were found', async () => {
			const objectIeMock = cloneDeep(mockIeObject2);

			// set representations of object to empty array
			objectIeMock.getIsRepresentedBy[0].isRepresentedBy = [];
			// set representations of child objects to empty array
			objectIeMock.getHasPart[0].isRepresentedBy = [];

			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(mockIeObjectEmpty);

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.schemaIdentifier).toEqual(mockIeObject2Metadata.schema_identifier);
			expect(ieObject.pages).toEqual([]);
		});

		it('returns an empty array if no files were found', async () => {
			const objectIeMock = cloneDeep(mockIeObject2);
			objectIeMock.getHasPart = [];
			objectIeMock.getIsRepresentedBy[0] = {
				isRepresentedBy: [
					{
						...objectIeMock.getIsRepresentedBy[0]?.isRepresentedBy?.[0],
						id: 'https://data-int.hetarchief.be/id/entity/mock-representation',
						schemaTranscriptUrls: [],
						includes: [],
					},
				],
			};
			mockDataService.execute.mockResolvedValueOnce(objectIeMock);
			mockDataService.execute.mockResolvedValueOnce(mockIeObjectEmpty);

			const ieObject = await ieObjectsService.findByIeObjectId(
				mockObjectId,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(ieObject.schemaIdentifier).toEqual(mockObjectSchemaIdentifier);
			expect(ieObject.pages[0]?.representations[0].files).toEqual([]);
		});

		it('throws an error when no objects were found', async () => {
			const mockData: Readonly<GetIeObjectDetailQuery> = mockIeObjectEmpty;
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const ieObject = await ieObjectsService.findByIeObjectId(
				'invalidId',
				false,
				'referer',
				'127.0.0.1'
			);
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
					[
						HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
						HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
					],
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
				[
					HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
					HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
				],
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
				objectIds: mockVisitApproved?.accessibleObjectIds ?? [],
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
			expect(result.plainTextSearchTerms).toEqual([{ value: 'example', isLiteral: false }]);
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
			expect(result.plainTextSearchTerms).toEqual([{ value: 'example', isLiteral: false }]);
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
			expect(result.plainTextSearchTerms).toEqual([{ value: 'example', isLiteral: true }]);
			expect(result.parsedSuccessfully).toEqual(false);
		});
	});

	describe('getMetadataAutocomplete', () => {
		it('should return a list of autocomplete strings for newspaper series', async () => {
			vi.spyOn(ieObjectsService, 'executeQuery').mockResolvedValueOnce(
				mockAutocompleteQueryResponseNewspaperSeries
			);

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
			vi.spyOn(ieObjectsService, 'executeQuery').mockResolvedValueOnce(
				mockAutocompleteQueryResponseCreators
			);
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

		// The FA of ARC-3806 asks for every value that holds the typed characters in order, not
		// only the values that start with them
		it('looks for the typed characters anywhere in the value', async () => {
			const executeQuery = vi
				.spyOn(ieObjectsService, 'executeQuery')
				.mockResolvedValueOnce(mockAutocompleteQueryResponseCreators);

			await ieObjectsService.getMetadataAutocomplete(AutocompleteField.creator, 'Dirk', {
				filters: [],
				page: 1,
				size: 4,
			});

			const esQuery = executeQuery.mock.calls[0][1] as any;
			expect(esQuery.query.bool.must).toContainEqual({
				wildcard: {
					'schema_creator_text.keyword': { value: '*dirk*', case_insensitive: true },
				},
			});
		});

		it('escapes a wildcard the user types, so it cannot widen the search on its own', async () => {
			const executeQuery = vi
				.spyOn(ieObjectsService, 'executeQuery')
				.mockResolvedValueOnce(mockAutocompleteQueryResponseCreators);

			await ieObjectsService.getMetadataAutocomplete(AutocompleteField.creator, 'a*b', {
				filters: [],
				page: 1,
				size: 4,
			});

			const esQuery = executeQuery.mock.calls[0][1] as any;
			expect(esQuery.query.bool.must[0].wildcard['schema_creator_text.keyword'].value).toEqual(
				'*a\\*b*'
			);
		});

		it('queries the AI mention field for a key user', async () => {
			mockVisitsService.findAll.mockResolvedValueOnce({ items: [] });
			const executeQuery = vi
				.spyOn(ieObjectsService, 'executeQuery')
				.mockResolvedValueOnce(mockAutocompleteQueryResponseMentionPersons);

			const result = await ieObjectsService.getMetadataAutocomplete(
				AutocompleteField.mentionPerson,
				'jan',
				{ filters: [], page: 1, size: 4 },
				new SessionUserEntity({ ...mockUser, isKeyUser: true })
			);

			const esQuery = executeQuery.mock.calls[0][1] as any;
			expect(esQuery.fields).toEqual(['schema_mentions_person_ai.sayt']);
			expect(esQuery.query.bool.must).toContainEqual({
				wildcard: {
					'schema_mentions_person_ai.keyword': { value: '*jan*', case_insensitive: true },
				},
			});
			expect(result).toEqual(['Jan Jansen', 'Jan Peeters']);
		});

		it('refuses an AI mention field for a non key user', async () => {
			const executeQuery = vi.spyOn(ieObjectsService, 'executeQuery');

			await expect(
				ieObjectsService.getMetadataAutocomplete(
					AutocompleteField.mentionPerson,
					'jan',
					{ filters: [], page: 1, size: 4 },
					new SessionUserEntity({ ...mockUser, isKeyUser: false })
				)
			).rejects.toThrowError("Field 'mentionPerson' is only available to key users.");
			expect(executeQuery).not.toHaveBeenCalled();
		});
	});

	describe('cleanupRepresentations', () => {
		it('should return a list of representations that can be played by the flowplayer with mp4 and without m4a and without mp3', () => {
			const result: HetArchiefIeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations1);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the flowplayer with mp4 and without m4a', () => {
			const result: HetArchiefIeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations2);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the flowplayer with mp3 and without m4a', () => {
			const result: HetArchiefIeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations3);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mpeg');
		});

		it('should return a list of representations that can be played by the flowplayer with mp4 and without mp3', () => {
			const result: HetArchiefIeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations4);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the flowplayer with mp4', () => {
			const result: HetArchiefIeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(cleanupRepresentations5);
			expect(result).toHaveLength(1);
			expect(result[0].files[0].mimeType).toEqual('audio/mp4');
		});

		it('should return a list of representations that can be played by the iiif viewer with jp2 and alto.xml and jpeg', () => {
			const result: HetArchiefIeObjectRepresentation[] =
				ieObjectsService.cleanupRepresentations(representationsNewspaper);
			expect(result).toHaveLength(3);
		});
	});

	describe('adaptRepresentations', () => {
		// Every fragment cut from a video is represented by the same full video file, so that file's
		// hasMediaFragment lists the windows of all of its fragments. Taking the first one handed the
		// player another fragment's footage under the requested fragment's metadata. ARC-3690
		const buildFragmentRepresentation = (id: string) => ({
			id,
			schema_name: id,
			schema_in_language: null,
			schema_start_time: '00:10:00',
			schema_end_time: '00:10:30',
			schemaTranscriptUrls: null,
			edm_is_next_in_sequence: null,
			updated_at: '2025-01-01T00:00:00Z',
			is_media_fragment_of: 'shared-file-id',
			schema_thumbnail_url: null,
			includes: [
				{
					file: {
						id: 'shared-file-id',
						schema_name: 'full-video.mp4',
						ebucore_has_mime_type: 'video/mp4',
						premis_stored_at: '/path/to/full-video.mp4',
						schema_thumbnail_url: null,
						schema_duration: null,
						edm_is_next_in_sequence: null,
						created_at: null,
						hasMediaFragment: [
							{
								id: 'sibling-fragment',
								schema_start_time: '00:00:00',
								schema_end_time: '00:00:30',
								schema_name: 'sibling-fragment',
							},
							{
								id: 'requested-fragment',
								schema_start_time: '00:10:00',
								schema_end_time: '00:10:30',
								schema_name: 'requested-fragment',
							},
						],
					},
				},
			],
		});

		it('resolves the media fragment window of the representation itself, not the first one on the shared file', async () => {
			const result = await ieObjectsService.adaptRepresentations(
				[buildFragmentRepresentation('requested-fragment')] as any,
				false,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(result[0].files[0].id).toEqual('shared-file-id');
			expect(result[0].files[0].mediaFragment).toEqual({ startTime: 600, endTime: 630 });
		});

		it('has no media fragment window when the file holds none for this representation', async () => {
			const mainRepresentation = {
				...buildFragmentRepresentation('main-representation'),
				is_media_fragment_of: null,
			};

			const result = await ieObjectsService.adaptRepresentations(
				[mainRepresentation] as any,
				false,
				false,
				'referer',
				'127.0.0.1'
			);

			expect(result[0].files[0].mediaFragment).toBeNull();
		});
	});

	describe('adaptRepresentationsPaged', () => {
		const baseRepresentation = {
			schema_in_language: null,
			schema_start_time: null,
			schema_end_time: null,
			schemaTranscriptUrls: null,
			edm_is_next_in_sequence: null,
			updated_at: '2025-01-01T00:00:00Z',
			includes: [],
		};

		it('filters out cut-fragment representations when a main representation (is_media_fragment_of: null) exists', async () => {
			const adaptRepresentationsSpy = vi
				.spyOn(ieObjectsService, 'adaptRepresentations')
				.mockResolvedValue([]);

			const mainRepresentation = {
				...baseRepresentation,
				id: 'main-rep-id',
				schema_name: 'main-rep',
				is_media_fragment_of: null,
			};
			const cutFragmentRepresentation = {
				...baseRepresentation,
				id: 'cut-fragment-rep-id',
				schema_name: 'cut-fragment-rep',
				is_media_fragment_of: 'parent-id',
			};

			const ieObjectSelf = [{ isRepresentedBy: [mainRepresentation, cutFragmentRepresentation] }];

			await ieObjectsService.adaptRepresentationsPaged(
				ieObjectSelf as any,
				null,
				false,
				false,
				'referer',
				'127.0.0.1'
			);

			// Only the main representation should be passed through; cut fragment must be removed
			expect(adaptRepresentationsSpy).toHaveBeenCalledWith(
				[mainRepresentation],
				false,
				false,
				'referer',
				'127.0.0.1'
			);
		});

		it('keeps all representations when no main representation exists (cut-fragment object)', async () => {
			const adaptRepresentationsSpy = vi
				.spyOn(ieObjectsService, 'adaptRepresentations')
				.mockResolvedValue([]);

			const cutFragmentRepresentation1 = {
				...baseRepresentation,
				id: 'cut-fragment-rep-1',
				schema_name: 'cut-fragment-rep-1',
				is_media_fragment_of: 'parent-id',
			};
			const cutFragmentRepresentation2 = {
				...baseRepresentation,
				id: 'cut-fragment-rep-2',
				schema_name: 'cut-fragment-rep-2',
				is_media_fragment_of: 'parent-id',
			};

			const ieObjectSelf = [
				{ isRepresentedBy: [cutFragmentRepresentation1, cutFragmentRepresentation2] },
			];

			await ieObjectsService.adaptRepresentationsPaged(
				ieObjectSelf as any,
				null,
				false,
				false,
				'referer',
				'127.0.0.1'
			);

			// Both cut-fragment representations must be kept — no filtering applied
			expect(adaptRepresentationsSpy).toHaveBeenCalledWith(
				[cutFragmentRepresentation1, cutFragmentRepresentation2],
				false,
				false,
				'referer',
				'127.0.0.1'
			);
		});
	});

	describe('getMentionsByFileId', () => {
		const mockFileId = 'https://data-int.hetarchief.be/id/entity/file-1';

		const buildAnnotation = (overrides: Record<string, unknown> = {}) => ({
			id: 'annotation-1',
			annotation_type: 'face',
			annotation_confidence: 0.9,
			is_ai_generated: true,
			has_annotation_related_artefact_thing: {
				id: 'https://data-int.hetarchief.be/id/entity/thing-1',
				type: 'person',
				wiki_id: 'Q2723306',
				schema_name: 'Els Ampe',
				schema_thumbnail_url: 'https://assets.viaa.be/thing-1.jpg',
			},
			is_annotated_media_resource: [{ start_offset: 30, end_offset: 35 }],
			...overrides,
		});

		const mockGetMentions = (annotations: unknown[], schemaDuration: unknown = 600) => {
			mockDataService.execute.mockResolvedValueOnce({
				graph_file: [
					{ id: mockFileId, schema_duration: schemaDuration, has_annotations: annotations },
				],
			});
		};

		it('throws a NotFoundException when the file does not exist', async () => {
			mockDataService.execute.mockResolvedValueOnce({ graph_file: [] });

			await expect(
				ieObjectsService.getMentionsByFileId(mockFileId, 'referer', '127.0.0.1')
			).rejects.toThrow(`File with id '${mockFileId}' not found`);
		});

		it('returns the duration of the file alongside the mentions', async () => {
			mockGetMentions([buildAnnotation()], '1234.5');

			const result = await ieObjectsService.getMentionsByFileId(mockFileId, 'referer', '127.0.0.1');

			expect(result.durationSeconds).toEqual(1234.5);
			expect(result.mentions).toHaveLength(1);
		});

		it('collapses the same wikidata entity recognised under different thing iris into one mention', async () => {
			mockGetMentions([
				buildAnnotation({
					id: 'annotation-face',
					is_annotated_media_resource: [{ start_offset: 90, end_offset: 95 }],
				}),
				buildAnnotation({
					id: 'annotation-ner',
					annotation_type: 'named-entity',
					has_annotation_related_artefact_thing: {
						// Different thing row, same person: must not produce a second avatar
						id: 'https://data-int.hetarchief.be/id/entity/thing-2',
						type: 'person',
						wiki_id: 'Q2723306',
						schema_name: 'Els Ampe',
						schema_thumbnail_url: null,
					},
					is_annotated_media_resource: [{ start_offset: 12, end_offset: 20 }],
				}),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions).toHaveLength(1);
			expect(mentions[0].id).toEqual('Q2723306');
			expect(mentions[0].wikidataUrl).toEqual('https://www.wikidata.org/wiki/Q2723306');
			// Occurrences of both recognition methods, sorted by start time
			expect(mentions[0].occurrences.map((occurrence) => occurrence.startTime)).toEqual([12, 90]);
			expect(mentions[0].occurrences.map((occurrence) => occurrence.annotationType)).toEqual([
				'named-entity',
				'face',
			]);
		});

		it('keeps entities without a wiki id separate, keyed on their thing iri', async () => {
			mockGetMentions([
				buildAnnotation({
					has_annotation_related_artefact_thing: {
						id: 'https://data-int.hetarchief.be/id/entity/thing-a',
						type: 'place',
						wiki_id: null,
						schema_name: 'Brussel',
						schema_thumbnail_url: null,
					},
				}),
				buildAnnotation({
					has_annotation_related_artefact_thing: {
						id: 'https://data-int.hetarchief.be/id/entity/thing-b',
						type: 'organization',
						wiki_id: null,
						schema_name: 'VRT',
						schema_thumbnail_url: null,
					},
					is_annotated_media_resource: [{ start_offset: 60, end_offset: 65 }],
				}),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions).toHaveLength(2);
			expect(mentions.map((mention) => mention.id)).toEqual([
				'https://data-int.hetarchief.be/id/entity/thing-a',
				'https://data-int.hetarchief.be/id/entity/thing-b',
			]);
			expect(mentions.map((mention) => mention.type)).toEqual(['place', 'organization']);
			expect(mentions.map((mention) => mention.wikidataId)).toEqual([null, null]);
			expect(mentions.map((mention) => mention.wikidataUrl)).toEqual([null, null]);
		});

		it('drops annotations without an entity', async () => {
			mockGetMentions([
				buildAnnotation(),
				buildAnnotation({ has_annotation_related_artefact_thing: null }),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions).toHaveLength(1);
		});

		it('yields one timeless occurrence for an annotation without media fragments', async () => {
			mockGetMentions([
				buildAnnotation({ annotation_type: 'named-entity', is_annotated_media_resource: [] }),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions[0].occurrences).toEqual([
				{
					startTime: null,
					endTime: null,
					confidence: 0.9,
					annotationType: 'named-entity',
					isAiGenerated: true,
				},
			]);
		});

		it('emits one occurrence per media fragment of a single annotation', async () => {
			mockGetMentions([
				buildAnnotation({
					is_annotated_media_resource: [
						{ start_offset: 50, end_offset: 55 },
						{ start_offset: 10, end_offset: 15 },
					],
				}),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions[0].occurrences.map((occurrence) => occurrence.startTime)).toEqual([10, 50]);
			expect(mentions[0].occurrences.map((occurrence) => occurrence.endTime)).toEqual([15, 55]);
		});

		it('sorts entities chronologically, with timeless entities last', async () => {
			mockGetMentions([
				buildAnnotation({
					has_annotation_related_artefact_thing: {
						id: 'thing-late',
						type: 'person',
						wiki_id: null,
						schema_name: 'Late',
						schema_thumbnail_url: null,
					},
					is_annotated_media_resource: [{ start_offset: 500, end_offset: 505 }],
				}),
				buildAnnotation({
					has_annotation_related_artefact_thing: {
						id: 'thing-timeless',
						type: 'person',
						wiki_id: null,
						schema_name: 'Timeless',
						schema_thumbnail_url: null,
					},
					is_annotated_media_resource: [],
				}),
				buildAnnotation({
					has_annotation_related_artefact_thing: {
						id: 'thing-early',
						type: 'person',
						wiki_id: null,
						schema_name: 'Early',
						schema_thumbnail_url: null,
					},
					is_annotated_media_resource: [{ start_offset: 5, end_offset: 9 }],
				}),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions.map((mention) => mention.name)).toEqual(['Early', 'Late', 'Timeless']);
		});

		it('resolves the entity thumbnail once per entity and nulls it when there is none', async () => {
			mockPlayerTicketService.resolveThumbnailUrl.mockResolvedValue(
				'https://assets.viaa.be/thing-1.jpg?token=abc'
			);
			mockGetMentions([
				buildAnnotation({ id: 'annotation-face' }),
				// Same entity, second recognition: must not trigger a second token
				buildAnnotation({ id: 'annotation-speaker', annotation_type: 'speaker' }),
				buildAnnotation({
					has_annotation_related_artefact_thing: {
						id: 'thing-no-still',
						type: 'place',
						wiki_id: null,
						schema_name: 'Brussel',
						schema_thumbnail_url: null,
					},
				}),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mockPlayerTicketService.resolveThumbnailUrl).toHaveBeenCalledTimes(1);
			expect(mentions.find((mention) => mention.name === 'Els Ampe').thumbnailUrl).toEqual(
				'https://assets.viaa.be/thing-1.jpg?token=abc'
			);
			expect(mentions.find((mention) => mention.name === 'Brussel').thumbnailUrl).toBeNull();
		});

		it('passes unknown annotation types and entity types through as null', async () => {
			mockGetMentions([
				buildAnnotation({
					annotation_type: 'something-new',
					has_annotation_related_artefact_thing: {
						id: 'thing-x',
						type: 'event',
						wiki_id: null,
						schema_name: 'Iets',
						schema_thumbnail_url: null,
					},
				}),
			]);

			const { mentions } = await ieObjectsService.getMentionsByFileId(
				mockFileId,
				'referer',
				'127.0.0.1'
			);

			expect(mentions[0].type).toBeNull();
			expect(mentions[0].occurrences[0].annotationType).toBeNull();
		});
	});
});
