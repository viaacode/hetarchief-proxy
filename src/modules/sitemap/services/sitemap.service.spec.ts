import { ContentPagesService, DataService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import { mockContentPage, mockSitemapConfig } from '../mocks/sitemap.mocks';

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
	findIeObjectsForSitemap: jest.fn(),
};
const mockAssetsService: Partial<Record<keyof AssetsService, jest.SpyInstance>> = {
	upload: jest.fn(),
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

	describe('getSitemapConfig', () => {
		it('returns a SitemapItemConfig object', async () => {
			const mockdata = {
				app_config: [mockSitemapConfig],
			};
			mockDataService.execute.mockResolvedValueOnce(mockdata);

			const response = await sitemapService.getSitemapConfig();
			expect(response).toEqual(mockSitemapConfig);
		});

		it('throw an error when it fails to get the sitemap config', async () => {
			mockDataService.execute.mockRejectedValueOnce('');

			try {
				await sitemapService.getSitemapConfig();
				fail('getSitemapConfig should have thrown an error');
			} catch (err) {
				expect(err.message).toEqual('Failed getting sitemap config');
			}
		});
	});

	describe('getContentPagesPaths', () => {
		it('returns a SitemapItemConfig object', async () => {
			const mockdata = [[mockContentPage], 1];
			mockContentPagesService.fetchContentPages.mockResolvedValueOnce(mockdata);

			const response = await sitemapService.getContentPagesPaths();
			expect(response).toEqual([mockContentPage.path]);
		});

		it('throw an error when it fails to get the content pages', async () => {
			mockContentPagesService.fetchContentPages.mockRejectedValueOnce('');

			try {
				await sitemapService.getContentPagesPaths();
				fail('getContentPagesPaths should have thrown an error');
			} catch (err) {
				expect(err.message).toEqual('Failed getting all the content pages');
			}
		});
	});
});
