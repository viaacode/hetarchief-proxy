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
});
