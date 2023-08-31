import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AssetType } from '@viaa/avo2-types';

import { Configuration } from '~config';

import { mockSitemapConfig } from '../mocks/sitemap.mocks';
import { SitemapService } from '../services/sitemap.service';

import { SitemapController } from './sitemap.controller';

import { TestingLogger } from '~shared/logging/test-logger';

const mockSitemapService = {
	generateSitemap: jest.fn(),
	getSitemapConfig: jest.fn(),
};

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string => {
		if (key === 'PROXY_API_KEY') {
			return 'test api key for the proxy';
		}

		return key;
	}),
};

describe('SitemapController', () => {
	let sitemapController: SitemapController;
	const env = process.env;

	beforeEach(async () => {
		process.env.ASSET_SERVER_ENDPOINT = 'https://asset-server.be';
		process.env.ASSET_SERVER_BUCKET_NAME = 'bucketname';

		const module: TestingModule = await Test.createTestingModule({
			controllers: [SitemapController],
			imports: [],
			providers: [
				{
					provide: SitemapService,
					useValue: mockSitemapService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		sitemapController = module.get<SitemapController>(SitemapController);
	});

	afterEach(() => {
		process.env = env;
	});

	it('should be defined', () => {
		expect(sitemapController).toBeDefined();
	});

	describe('generateSitemap', () => {
		it('should return the url of the index xml file', async () => {
			mockSitemapService.getSitemapConfig.mockResolvedValueOnce({
				app_config: [mockSitemapConfig],
			});
			mockSitemapService.generateSitemap.mockResolvedValueOnce('');

			const result = await sitemapController.generateSitemap(
				mockConfigService.get('PROXY_API_KEY')
			);

			expect(result).toEqual(
				`${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AssetType.SITEMAP}/index.xml`
			);
		});
	});
});
