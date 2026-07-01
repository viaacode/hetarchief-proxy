import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { GetIeObjectsInThemeQuery } from '~generated/graphql-db-types-hetarchief';
import { TestingLogger } from '~shared/logging/test-logger';
import { ThemesService } from './themes.service';

const mockThemeSlug = 'nature';

const mockGetIeObjectsInThemeResponse: GetIeObjectsInThemeQuery = {
	app_theme: [
		{
			id: 'theme-uuid-1',
			slug: mockThemeSlug,
			name_nl: 'Natuur',
			name_en: 'Nature',
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
	],
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

			const result = await themesService.getIeObjectsByThemeSlug(mockThemeSlug, 20);

			expect(result.slug).toEqual(mockThemeSlug);
			expect(result.nameNl).toEqual('Natuur');
			expect(result.nameEn).toEqual('Nature');
			expect(result.imageUrl).toEqual('https://example.com/nature.jpg');
			// null ieObjects entries are filtered out
			expect(result.ieObjects).toHaveLength(2);
		});

		it('correctly maps ie-object fields', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeSlug(mockThemeSlug, 20);
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

			const result = await themesService.getIeObjectsByThemeSlug(mockThemeSlug, 20);
			const second = result.ieObjects[1];

			expect(second.thumbnailUrl).toBeNull();
		});

		it('throws CustomError with 404 when the theme does not exist', async () => {
			mockDataService.execute.mockResolvedValueOnce({ app_theme: [] });

			await expect(themesService.getIeObjectsByThemeSlug('non-existing-slug', 20)).rejects.toThrow(
				CustomError
			);
		});

		it('passes the limit to the query', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			await themesService.getIeObjectsByThemeSlug(mockThemeSlug, 5);

			expect(mockDataService.execute).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ objectsLimit: 5 })
			);
		});
	});
});
