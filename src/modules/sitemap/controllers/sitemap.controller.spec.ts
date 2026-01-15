import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { AvoFileUploadAssetType } from '@viaa/avo2-types';

import { mockSitemapConfig } from '../mocks/sitemap.mocks';
import { SitemapService } from '../services/sitemap.service';

import { SitemapController } from './sitemap.controller';

import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockSitemapService = {
	generateSitemap: jest.fn(),
	getSitemapConfig: jest.fn(),
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
				mockConfigService.get('PROXY_API_KEY') as string
			);

			expect(result).toEqual(
				`${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AvoFileUploadAssetType.SITEMAP}/index.xml`
			);
		});
	});
});
