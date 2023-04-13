import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SitemapService } from '../services/sitemap.service';
import { SitemapItemInfo } from '../sitemap.types';
@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
	constructor(private sitemapService: SitemapService) {}

	@Get('xml')
	@Header('Content-Type', 'text/xml')
	public async getSitemap(): Promise<string> {
		/*	From Jira:	// Comment can be removed once this feature is complete
					items in sitemap:
						-homepage (static): '/'
						-landingspagina bzt (static): '/bezoek'
						-andere contentpagina’s: '' admincore : fetchContentPages //like: import { DataService } from '@meemoo/admin-core-api';
						-zoekpagina algemeen: '/zoeken'
						-zoekpagina per cp: '/zoeken/?aanbieders={'
						-item-detailpagina’s: '/zoeken/{maintainerSlug}/{objectSchemaId}'
		*/
		const staticPages = ['/', '/bezoek'];

		// const searchPages = await Promise.all(

		// )

		const allPages: SitemapItemInfo[] = [
			...staticPages.map((path) => ({
				loc: process.env.CLIENT_HOST + path,
				changefreq: 'monthly',
			})),
		];

		return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(SitemapController.renderPage).join('\n')}
</urlset>
`;
	}

	private static renderPage(pageInfo: SitemapItemInfo): string {
		return `<url>
  <loc>${pageInfo.loc}</loc>
  ${pageInfo.lastmod ? `<lastmod>${pageInfo.lastmod}</lastmod>` : ``}
  <changefreq>${pageInfo.changefreq}</changefreq>
</url>`;
	}
}
