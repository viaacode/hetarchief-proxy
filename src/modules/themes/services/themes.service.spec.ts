import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { GetThemeWithObjectsInRandomOrderQuery } from '~generated/graphql-db-types-hetarchief';
import { TestingLogger } from '~shared/logging/test-logger';
import { SortDirectionWithRandom } from '~shared/types';
import { ThemesService } from './themes.service';

const mockThemeSlug = 'culture-society';
const mockThemeUuid = 'c619c4b1-5cd6-4277-95e8-8137f10a09ea';

const mockGetIeObjectsInThemeResponse: GetThemeWithObjectsInRandomOrderQuery = {
	app_theme_by_pk: {
		id: 'theme-uuid-1',
		slug: mockThemeSlug,
		name_nl: 'Cultuur en samenleving',
		name_en: 'Culture & Society',
		image_url: 'https://example.com/nature.jpg',
		ieObjectLinksRandomOrder: [
			{
				ieObject: {
					id: 'ie-uuid-1',
					schema_name: 'Natuur documentaire',
					dctermsFormat: [{ dcterms_format: 'video' }],
					schemaThumbnail: { schema_thumbnail_url: 'https://example.com/thumb1.jpg' },
					schemaMaintainer: { id: 'or-abc123', skos_pref_label: 'VRT' },
				},
			},
			{
				ieObject: {
					id: 'ie-uuid-2',
					schema_name: 'Natuur foto',
					dctermsFormat: [{ dcterms_format: 'image' }],
					schemaThumbnail: null,
					schemaMaintainer: { id: 'or-def456', skos_pref_label: 'RTBF' },
				},
			},
			{
				ieObject: null,
			},
		],
	},
};

const mockIeObjectSchemaIdentifier = 'qsnk362q84';
const mockIeObjectEntityId = `https://data-qas.hetarchief.be/id/entity/${mockIeObjectSchemaIdentifier}`;

// Responses of getIeObjectIdBySchemaIdentifier, used to turn a schema identifier into an entity uri
const mockLookupHit = {
	graph_intellectual_entity: [
		{ id: mockIeObjectEntityId, schema_identifier: mockIeObjectSchemaIdentifier },
	],
};
const mockLookupMiss = { graph_intellectual_entity: [] };

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

describe('ThemesService', () => {
	let themesService: ThemesService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ThemesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		themesService = module.get<ThemesService>(ThemesService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(themesService).toBeDefined();
	});

	describe('getIeObjectsInTheme', () => {
		it('returns the theme with its linked ie-objects', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(mockThemeUuid, {
				size: 20,
				orderDirection: SortDirectionWithRandom.random,
			});

			expect(result.slug).toEqual(mockThemeSlug);
			expect(result.nameNl).toEqual('Cultuur en samenleving');
			expect(result.nameEn).toEqual('Culture & Society');
			expect(result.imageUrl).toEqual('https://example.com/nature.jpg');
			// null ieObjects entries are filtered out
			expect(result.ieObjects).toHaveLength(2);
		});

		it('correctly maps ie-object fields', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(mockThemeUuid, {
				size: 20,
				orderDirection: SortDirectionWithRandom.random,
			});
			const [first] = result.ieObjects;

			expect(first.id).toEqual('ie-uuid-1');
			expect(first.name).toEqual('Natuur documentaire');
			expect(first.format).toEqual('video');
			expect(first.thumbnailUrl).toEqual('https://example.com/thumb1.jpg');
			expect(first.maintainerId).toEqual('or-abc123');
			expect(first.maintainerName).toEqual('VRT');
		});

		it('returns null for missing optional fields', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(mockThemeUuid, {
				size: 20,
				orderDirection: SortDirectionWithRandom.random,
			});
			const second = result.ieObjects[1];

			expect(second.thumbnailUrl).toBeNull();
		});

		it('throws CustomError with 404 when the theme does not exist', async () => {
			mockDataService.execute.mockResolvedValueOnce({ app_theme_by_pk: null });

			await expect(
				themesService.getIeObjectsByThemeUuid('non-existing-uuid', {
					size: 20,
					orderDirection: SortDirectionWithRandom.random,
				})
			).rejects.toThrow(CustomError);
		});

		it('passes the limit to the query', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			await themesService.getIeObjectsByThemeUuid(mockThemeUuid, {
				size: 5,
				orderDirection: SortDirectionWithRandom.random,
			});

			expect(mockDataService.execute).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ objectsLimit: 5 })
			);
		});
	});

	describe('addIeObjectsToTheme', () => {
		it('resolves schema identifiers and reports one result per submitted identifier', async () => {
			// One lookup per unique identifier, in submission order, then the insert
			mockDataService.execute
				.mockResolvedValueOnce(mockLookupHit)
				.mockResolvedValueOnce(mockLookupMiss)
				.mockResolvedValueOnce({
					insert_app_theme_intellectual_entity: {
						returning: [
							{
								id: 'link-1',
								theme_id: mockThemeUuid,
								intellectual_entity_id: mockIeObjectEntityId,
							},
						],
					},
				});

			const result = await themesService.addIeObjectsToTheme(mockThemeUuid, [
				mockIeObjectSchemaIdentifier,
				mockIeObjectSchemaIdentifier,
				'does-not-exist',
			]);

			expect(result).toEqual([
				{ schemaIdentifier: mockIeObjectSchemaIdentifier, result: 'added' },
				{ schemaIdentifier: mockIeObjectSchemaIdentifier, result: 'alreadyLinked' },
				{ schemaIdentifier: 'does-not-exist', result: 'notFound' },
			]);
		});

		it('links the resolved entity uri, not the schema identifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupHit).mockResolvedValueOnce({
				insert_app_theme_intellectual_entity: { returning: [] },
			});

			await themesService.addIeObjectsToTheme(mockThemeUuid, [mockIeObjectSchemaIdentifier]);

			expect(mockDataService.execute).toHaveBeenLastCalledWith(
				expect.anything(),
				expect.objectContaining({
					objects: [{ theme_id: mockThemeUuid, intellectual_entity_id: mockIeObjectEntityId }],
				})
			);
		});

		it('reports alreadyLinked when the insert returns no new rows', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupHit).mockResolvedValueOnce({
				insert_app_theme_intellectual_entity: { returning: [] },
			});

			const result = await themesService.addIeObjectsToTheme(mockThemeUuid, [
				mockIeObjectSchemaIdentifier,
			]);

			expect(result).toEqual([
				{ schemaIdentifier: mockIeObjectSchemaIdentifier, result: 'alreadyLinked' },
			]);
		});

		it('skips the insert entirely when nothing resolves', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupMiss);

			const result = await themesService.addIeObjectsToTheme(mockThemeUuid, ['does-not-exist']);

			expect(result).toEqual([{ schemaIdentifier: 'does-not-exist', result: 'notFound' }]);
			// Only the lookup ran, no insert
			expect(mockDataService.execute).toHaveBeenCalledTimes(1);
		});
	});

	describe('deleteIeObjectFromTheme', () => {
		it('resolves the schema identifier and deletes by entity uri', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupHit).mockResolvedValueOnce({
				delete_app_theme_intellectual_entity: { affected_rows: 1 },
			});

			const affectedRows = await themesService.deleteIeObjectFromTheme(
				mockThemeUuid,
				mockIeObjectSchemaIdentifier
			);

			expect(affectedRows).toEqual(1);
			expect(mockDataService.execute).toHaveBeenLastCalledWith(
				expect.anything(),
				expect.objectContaining({ themeId: mockThemeUuid, ieObjectId: mockIeObjectEntityId })
			);
		});

		it('returns 0 without deleting when the schema identifier does not resolve', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupMiss);

			const affectedRows = await themesService.deleteIeObjectFromTheme(
				mockThemeUuid,
				'does-not-exist'
			);

			expect(affectedRows).toEqual(0);
			expect(mockDataService.execute).toHaveBeenCalledTimes(1);
		});
	});
});
