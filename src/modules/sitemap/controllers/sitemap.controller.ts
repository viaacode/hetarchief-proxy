import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SitemapService } from '../services/sitemap.service';

import { AssetFileType } from '~modules/assets/types';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';

@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
	constructor(private sitemapService: SitemapService) {}

	@Post()
	@UseGuards(ApiKeyGuard)
	public async generateSitemap(): Promise<string> {
		const sitemapConfig = await this.sitemapService.getSitemapConfig();
		this.sitemapService.generateSitemap(sitemapConfig); // no await because this can take a while and we don't want FE to crash
		return `${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AssetFileType.SITEMAP}/index.xml`;
	}
}
