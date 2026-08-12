import { AssetsService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockUser } from '~modules/ie-objects/mocks/ie-objects.mock';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { TestingLogger } from '~shared/logging/test-logger';
import type { IeObjectsInThemeResponseDto, ThemeResponseDto } from '../dto/themes.dto';
import { ThemesService } from '../services/themes.service';
import { ThemesController } from './themes.controller';

const mockThemeSlug = 'culture-society';
const mockReferer = 'https://client.example.com';
const mockIp = '127.0.0.1';
const mockSessionUser = new SessionUserEntity(mockUser);

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
	updatedAt: '2026-07-20T14:33:30.571112+00:00',
	ieObjects: [
		{
			id: 'https://data-qas.hetarchief.be/id/entity/qsnk362q84',
			schemaIdentifier: 'qsnk362q84',
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
	getThemesByIds: vi.fn(),
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

			const result = await themesController.getIeObjects(
				mockThemeId,
				{ size: 20 },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(result).toEqual(mockIeObjectsInThemeResponse);
			expect(mockThemesService.getIeObjectsByThemeUuid).toHaveBeenCalledWith(
				mockThemeId,
				{ size: 20 },
				mockSessionUser,
				mockReferer,
				mockIp
			);
		});
	});

	describe('getThemesByIds', () => {
		it('delegates to themesService.getThemesByIds', async () => {
			const mockThemeIds = [
				'00000000-0000-0000-0000-000000000001',
				'00000000-0000-0000-0000-000000000002',
			];
			const mockThemesResponse: ThemeResponseDto[] = [
				{
					id: mockThemeIds[0],
					slug: mockThemeSlug,
					nameNl: 'Cultuur en samenleving',
					nameEn: 'Culture & Society',
					descriptionNl: null,
					descriptionEn: null,
					imageUrl: null,
					contentPagePathNl: null,
					contentPagePathEn: null,
					updatedAt: '2026-07-20T14:33:30.571112+00:00',
				},
			];
			mockThemesService.getThemesByIds.mockResolvedValueOnce(mockThemesResponse);

			const result = await themesController.getThemesByIds({ ids: mockThemeIds });

			expect(result).toEqual(mockThemesResponse);
			expect(mockThemesService.getThemesByIds).toHaveBeenCalledWith(mockThemeIds);
		});
	});
});
