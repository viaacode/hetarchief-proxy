import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { mockSitemapConfig } from '../mocks/sitemap.mocks';
import { SitemapService } from '../services/sitemap.service';

import { SitemapController } from './sitemap.controller';

import { AssetFileType } from '~modules/assets/types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockSitemapService = {
	generateSitemap: jest.fn(),
	getSitemapConfig: jest.fn(),
};

describe('SitemapController', () => {
	let sitemapController: SitemapController;
	const env = process.env;

	beforeEach(async () => {
		process.env.ASSET_SERVER_ENDPOINT = 'https://asset-server.be/';
		process.env.ASSET_SERVER_BUCKET_NAME = 'bucketname';

		const module: TestingModule = await Test.createTestingModule({
			controllers: [SitemapController],
			imports: [ConfigModule],
			providers: [
				{
					provide: SitemapService,
					useValue: mockSitemapService,
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

			const result = await sitemapController.generateSitemap();

			expect(result).toEqual(
				`${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AssetFileType.SITEMAP}/index.xml`
			);
		});
	});
});
