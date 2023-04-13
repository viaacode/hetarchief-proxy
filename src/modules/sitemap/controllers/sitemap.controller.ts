import { Controller, Header, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import moment from 'moment';

import { SitemapService } from '../services/sitemap.service';
import { SitemapItemInfo } from '../sitemap.types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import { IeObjectLicense } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';

@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
	constructor(
		private sitemapService: SitemapService,
		private spacesService: SpacesService,
		private ieObjectsService: IeObjectsService
	) {}

	@Post()
	@Header('Content-Type', 'text/xml')
	public async getSitemap(): Promise<string> {
		/*	From Jira:	// Comment can be removed once this feature is complete
					items in sitemap:
						-homepage (static): '/' done
						-landingspagina bzt (static): '/bezoek' done
						-andere contentpagina’s: '' admincore : fetchContentPages //like: import { DataService } from '@meemoo/admin-core-api';
						-zoekpagina algemeen (static): '/zoeken' done
						-zoekpagina per cp: '/zoeken/?aanbieders={or id van aanbieder}' done
						-item-detailpagina’s: '/zoeken/{maintainerSlug}/{objectSchemaId}' done
		*/
		const staticPages = ['/', '/bezoek', '/zoeken'];

		const activeSpaces = await this.spacesService.findAll(
			{ size: 1000, status: [VisitorSpaceStatus.Active] },
			null
		);

		const publicObjects = await this.ieObjectsService.findObjectsForSitemap([
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
		]);

		const allPages: SitemapItemInfo[] = [
			//TODO: Put everything in correct order like big comment above
			...staticPages.map((path) => ({
				loc: process.env.CLIENT_HOST + path,
				changefreq: 'monthly',
			})),
			...activeSpaces.items.map((space) => ({
				loc: process.env.CLIENT_HOST + '/zoeken/?aanbieders=' + space.maintainerId,
				changefreq: 'weekly',
				lastmod: moment(space.updatedAt).format('YYYY-MM-DD'),
			})),
			...publicObjects.map((object) => ({
				loc:
					process.env.CLIENT_HOST +
					'/zoeken/' +
					object.maintainerSlug +
					'/' +
					object.schemaIdentifier,
				changefreq: 'weekly',
				lastmod: moment(object.updatedAt).format('YYYY-MM-DD'),
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
