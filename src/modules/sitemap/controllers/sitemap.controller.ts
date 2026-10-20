import { ConflictException, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AvoFileUploadAssetType } from '@viaa/avo2-types';
import { APIKEY, ApiKeyGuard } from '~shared/guards/api-key.guard';
import { customError } from '~shared/helpers/custom-error';
import { SitemapService } from '../services/sitemap.service';

@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
	constructor(private sitemapService: SitemapService) {}

	@Post()
	@UseGuards(ApiKeyGuard)
	public async generateSitemap(@Headers(APIKEY) apikey: string): Promise<string> {
		if (this.sitemapService.isGenerating) {
			throw new ConflictException('Sitemap generation is already in progress');
		}
		const sitemapConfig = await this.sitemapService.getSitemapConfig();
		// No await because this can take a while, and we don't want FE to crash
		// The catch is required: an unhandled promise rejection would crash the node process and restart the pod
		this.sitemapService.generateSitemap(sitemapConfig).catch((err) => {
			console.error(customError('Sitemap generation failed', err));
		});
		return `${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AvoFileUploadAssetType.SITEMAP}/index.xml`;
	}
}
