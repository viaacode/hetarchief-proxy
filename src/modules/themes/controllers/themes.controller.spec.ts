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
	descriptionNl: null,
	descriptionEn: null,
	imageUrl: 'https://example.com/culture-society.jpg',
	contentPagePathNl: null,
	contentPagePathEn: null,
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
	total: 1,
};

const mockThemesService: Partial<Record<keyof ThemesService, MockInstance>> = {
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

	describe('getIeObjects (by UUID)', () => {
		const mockThemeId = '00000000-0000-0000-0000-000000000001';

		it('delegates to getIeObjectsByThemeUuid when a UUID is provided', async () => {
			mockThemesService.getIeObjectsByThemeUuid.mockResolvedValueOnce(mockIeObjectsInThemeResponse);

			const result = await themesController.getIeObjects(mockThemeId, { size: 20 });

			expect(result).toEqual(mockIeObjectsInThemeResponse);
			expect(mockThemesService.getIeObjectsByThemeUuid).toHaveBeenCalledWith(mockThemeId, {
				size: 20,
			});
		});
	});
});
