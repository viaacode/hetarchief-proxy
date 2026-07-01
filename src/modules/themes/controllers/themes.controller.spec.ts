import { AssetsService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TestingLogger } from '~shared/logging/test-logger';
import type { IeObjectsInThemeResponseDto } from '../dto/themes.dto';
import { ThemesService } from '../services/themes.service';
import { ThemesController } from './themes.controller';

const mockThemeSlug = 'culture-society';

const mockIeObjectsInThemeResponse: IeObjectsInThemeResponseDto = {
	id: 'theme-uuid-1',
	slug: mockThemeSlug,
	nameNl: 'Cultuur en samenleving',
	nameEn: 'Culture & Society',
	imageUrl: 'https://example.com/culture-society.jpg',
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
	getIeObjectsByThemeSlug: vi.fn(),
	getIeObjectsByThemeUuid: vi.fn(),
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
				{
					provide: AssetsService,
					useValue: { uploadAndTrack: vi.fn() },
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
			mockThemesService.getIeObjectsByThemeSlug.mockResolvedValueOnce(mockIeObjectsInThemeResponse);

			const result = await themesController.getIeObjects(mockThemeSlug, {
				limit: 20,
			});

			expect(result).toEqual(mockIeObjectsInThemeResponse);
			expect(mockThemesService.getIeObjectsByThemeSlug).toHaveBeenCalledWith(mockThemeSlug, 20);
		});

		it('forwards the limit query param to the service', async () => {
			mockThemesService.getIeObjectsByThemeSlug.mockResolvedValueOnce(mockIeObjectsInThemeResponse);

			await themesController.getIeObjects(mockThemeSlug, { limit: 5 });

			expect(mockThemesService.getIeObjectsByThemeSlug).toHaveBeenCalledWith(mockThemeSlug, 5);
		});

		it('throws CustomError with 404 when the theme does not exist', async () => {
			mockThemesService.getIeObjectsByThemeSlug.mockRejectedValueOnce(
				new CustomError(
					`Theme with slug '${mockThemeSlug}' not found`,
					null,
					{ mockThemeSlug },
					404
				)
			);

			await expect(themesController.getIeObjects(mockThemeSlug, { limit: 20 })).rejects.toThrow(
				CustomError
			);
		});
	});

	describe('getIeObjects (by UUID)', () => {
		const mockThemeId = '00000000-0000-0000-0000-000000000001';

		it('delegates to getIeObjectsByThemeUuid when a UUID is provided', async () => {
			mockThemesService.getIeObjectsByThemeUuid.mockResolvedValueOnce(mockIeObjectsInThemeResponse);

			const result = await themesController.getIeObjects(mockThemeId, { limit: 20 });

			expect(result).toEqual(mockIeObjectsInThemeResponse);
			expect(mockThemesService.getIeObjectsByThemeUuid).toHaveBeenCalledWith(mockThemeId, {
				limit: 20,
			});
			expect(mockThemesService.getIeObjectsByThemeSlug).not.toHaveBeenCalled();
		});
	});
});
