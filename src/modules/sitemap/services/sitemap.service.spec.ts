import { ContentPagesService, DataService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import { mockSitemapConfig } from '../mocks/sitemap.mocks';

import { SitemapService } from './sitemap.service';

import { AssetsService } from '~modules/assets/services/assets.service';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};
const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findAll: jest.fn(),
};
const mockContentPagesService: Partial<Record<keyof ContentPagesService, jest.SpyInstance>> = {
	fetchContentPages: jest.fn(),
};
const mockIeObjectsService: Partial<Record<keyof IeObjectsService, jest.SpyInstance>> = {
	findObjectsForSitemap: jest.fn(),
};
const mockAssetsService: Partial<Record<keyof AssetsService, jest.SpyInstance>> = {
	uploadSitemap: jest.fn(),
};

describe('SitemapService', () => {
	let sitemapService: SitemapService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SitemapService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: ContentPagesService,
					useValue: mockContentPagesService,
				},
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
				{
					provide: AssetsService,
					useValue: mockAssetsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		sitemapService = module.get<SitemapService>(SitemapService);
	});

	it('services should be defined', () => {
		expect(sitemapService).toBeDefined();
	});

	describe('renderPage', () => {
		it('returns a SitemapItemConfig object', async () => {
			const mockdata = {
				app_config: [mockSitemapConfig],
			};
			mockDataService.execute.mockResolvedValueOnce(mockdata);

			const response = await sitemapService.getSitemapConfig();
			expect(response).toEqual(mockSitemapConfig);
		});
	});
});
