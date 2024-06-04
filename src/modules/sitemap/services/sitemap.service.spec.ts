import { AssetsService, ContentPagesService, DataService, Locale } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import {
	mockContentPage,
	mockGeneralXml,
	mockSitemapConfig,
	mockSitemapSpaces,
} from '../mocks/sitemap.mocks';
import { SitemapItemInfo } from '../sitemap.types';

import { SitemapService } from './sitemap.service';

import { mockSitemapObject } from '~modules/ie-objects/mocks/ie-objects.mock';
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
	uploadAndTrack: jest.fn(),
};

describe('SitemapService', () => {
	let sitemapService: SitemapService;
	const env = process.env;

	beforeEach(async () => {
		process.env.CLIENT_HOST = 'http://hetarchief.be';

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

	afterEach(() => {
		process.env = env;
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

			const response = await sitemapService.getContentPageSitemapEntries();
			expect(response).toEqual([
				{
					loc: mockContentPage.path,
					links: [
						{
							href: mockContentPage.translatedPages[0].path,
							hreflang: 'en',
						},
						{
							href: mockContentPage.path,
							hreflang: 'nl',
						},
					],
					changefreq: 'monthly',
					lastmod: '2023-04-18',
				},
			]);
		});

		it('throw an error when it fails to get the content pages', async () => {
			mockContentPagesService.fetchContentPages.mockRejectedValueOnce('');

			try {
				await sitemapService.getContentPageSitemapEntries();
				fail('getContentPagesPaths should have thrown an error');
			} catch (err) {
				expect(err.message).toEqual('Failed to getContentPageSitemapEntries: ""');
			}
		});
	});

	describe('blacklistAndPrioritizePages', () => {
		it('should remove the blacklisted items and add priority', async () => {
			const mockPages: SitemapItemInfo[] = [
				{
					loc: '/bezoek',
					links: [
						{ href: '/visit', hreflang: Locale.en },
						{ href: '/bezoek', hreflang: Locale.nl },
					],
					changefreq: 'monthly',
				},
				{
					loc: '/dynamic',
					links: [
						{ href: '/dynamic-en', hreflang: Locale.en },
						{ href: '/dynamic', hreflang: Locale.nl },
					],
					changefreq: 'monthly',
				},
				{
					loc: '/geheime-content-pagina',
					links: [
						{ href: '/secret-content-pagina', hreflang: Locale.en },
						{
							href: '/geheime-content-pagina',
							hreflang: Locale.nl,
						},
					],
					changefreq: 'weekly',
				},
			];

			const response = sitemapService.blacklistAndPrioritizePages(
				mockPages,
				mockSitemapConfig
			);
			expect(response).toEqual([
				{
					loc: '/bezoek',
					links: [
						{ href: '/visit', hreflang: Locale.en },
						{ href: '/bezoek', hreflang: Locale.nl },
					],
					changefreq: 'monthly',
					priority: 1,
				},
				{
					loc: '/dynamic',
					links: [
						{ href: '/dynamic-en', hreflang: Locale.en },
						{ href: '/dynamic', hreflang: Locale.nl },
					],
					changefreq: 'monthly',
				},
			]);
		});
	});

	describe('generateSitemap', () => {
		it('should return the xml for the general sitemap xml', async () => {
			mockContentPagesService.fetchContentPages.mockResolvedValueOnce([[mockContentPage], 1]);
			mockSpacesService.findAll.mockResolvedValueOnce(mockSitemapSpaces);

			// Public ie objects
			mockIeObjectsService.findIeObjectsForSitemap.mockResolvedValueOnce({ total: 1 });
			mockIeObjectsService.findIeObjectsForSitemap.mockResolvedValueOnce({
				items: [mockSitemapObject],
			});

			// Non-public ie objects
			mockIeObjectsService.findIeObjectsForSitemap.mockResolvedValueOnce({ total: 1 });
			mockIeObjectsService.findIeObjectsForSitemap.mockResolvedValueOnce({
				items: [mockSitemapObject],
			});

			mockAssetsService.uploadAndTrack.mockResolvedValueOnce(
				'https://asset-server.be/bucketname/SITEMAP/general'
			);
			mockAssetsService.uploadAndTrack.mockResolvedValueOnce(
				'https://asset-server.be/bucketname/SITEMAP/object-detail-0'
			);
			mockAssetsService.uploadAndTrack.mockResolvedValueOnce(
				'https://asset-server.be/bucketname/SITEMAP/index'
			);

			const result = await sitemapService.generateSitemap(mockSitemapConfig);
			expect(result).toEqual(mockGeneralXml);
		});
	});
});
