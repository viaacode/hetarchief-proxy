import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SitemapService } from '../services/sitemap.service';

import { AssetFileType } from '~modules/assets/types';

@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
	constructor(private sitemapService: SitemapService) {}

	@Post()
	public async getSitemap(): Promise<string> {
		/*	From Jira:	// Comment can be removed once this feature is complete
					items in sitemap:
						-homepage (static): '/' done
						-landingspagina bzt (static): '/bezoek' done
						-andere contentpagina’s: '' admincore : fetchContentPages //like: import { DataService } from '@meemoo/admin-core-api'; done
						-zoekpagina algemeen (static): '/zoeken' done
						-zoekpagina per cp: '/zoeken/?aanbieders={or id van aanbieder}' done
						-item-detailpagina’s: '/zoeken/{maintainerSlug}/{objectSchemaId}' done
		*/
		this.sitemapService.generateSitemap(); // no await because this can take a while and we don't want FE to crash
		return `${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AssetFileType.SITEMAP}/index`;
	}
}
