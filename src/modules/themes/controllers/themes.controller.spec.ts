import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemesController } from './themes.controller';
import { ThemesService } from '../services/themes.service';
import type { IeObjectsInThemeResponseDto } from '../dto/themes.dto';
import { TestingLogger } from '~shared/logging/test-logger';

const mockThemeSlug = 'nature';

const mockIeObjectsInThemeResponse: IeObjectsInThemeResponseDto = {
	id: 'theme-uuid-1',
	slug: mockThemeSlug,
	nameNl: 'Natuur',
	nameEn: 'Nature',
	imageUrl: 'https://example.com/nature.jpg',
	ieObjects: [
		{
			id: 'ie-uuid-1',
			name: 'Natuur documentaire',
			format: 'video',
			thumbnailUrl: 'https://example.com/thumb1.jpg',
			maintainerId: 'or-abc123',
			maintainerName: 'VRT',
		},
	],
};

const mockThemesService: Partial<Record<keyof ThemesService, MockInstance>> = {
	getIeObjectsInTheme: vi.fn(),
	getIeObjectsByThemeId: vi.fn(),
};

describe('ThemesController', () => {
	let themesController: ThemesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ThemesController],
			providers: [
				{
					provide: ThemesService,
					useValue: mockThemesService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		themesController = module.get<ThemesController>(ThemesController);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(themesController).toBeDefined();
	});

	describe('getIeObjects (by slug)', () => {
		it('returns the theme with its linked ie-objects for a slug', async () => {
			mockThemesService.getIeObjectsInTheme.mockResolvedValueOnce(
				mockIeObjectsInThemeResponse
			);

			const result = await themesController.getIeObjects(mockThemeSlug, {
				limit: 20,
			});

			expect(result).toEqual(mockIeObjectsInThemeResponse);
			expect(mockThemesService.getIeObjectsInTheme).toHaveBeenCalledWith(mockThemeSlug, 20);
		});

		it('forwards the limit query param to the service', async () => {
			mockThemesService.getIeObjectsInTheme.mockResolvedValueOnce(
				mockIeObjectsInThemeResponse
			);

			await themesController.getIeObjects(mockThemeSlug, { limit: 5 });

			expect(mockThemesService.getIeObjectsInTheme).toHaveBeenCalledWith(mockThemeSlug, 5);
		});

		it('throws CustomError with 404 when the theme does not exist', async () => {
			mockThemesService.getIeObjectsInTheme.mockRejectedValueOnce(
				new CustomError(`Theme with slug '${mockThemeSlug}' not found`, null, { mockThemeSlug }, 404)
			);

			await expect(
				themesController.getIeObjects(mockThemeSlug, { limit: 20 })
			).rejects.toThrow(CustomError);
		});
	});

	describe('getIeObjects (by UUID)', () => {
		const mockThemeId = 'theme-uuid-0000-0000-000000000001';

		it('delegates to getIeObjectsByThemeId when a UUID is provided', async () => {
			mockThemesService.getIeObjectsByThemeId.mockResolvedValueOnce(
				mockIeObjectsInThemeResponse
			);

			const result = await themesController.getIeObjects(mockThemeId, { limit: 20 });

			expect(result).toEqual(mockIeObjectsInThemeResponse);
			expect(mockThemesService.getIeObjectsByThemeId).toHaveBeenCalledWith(mockThemeId);
			expect(mockThemesService.getIeObjectsInTheme).not.toHaveBeenCalled();
		});
	});
});
