import { Readable } from 'stream';

import { ContentPagesService } from '@meemoo/admin-core-api';
import { Controller, Header, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import moment from 'moment';

import { SitemapService } from '../services/sitemap.service';
import { SitemapItemInfo } from '../sitemap.types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import { AssetsService } from '~modules/assets/services/assets.service';
import { AssetFileType } from '~modules/assets/types';
import { IeObjectLicense } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';

@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
	constructor(
		private sitemapService: SitemapService,
		private spacesService: SpacesService,
		private ieObjectsService: IeObjectsService,
		private assetsService: AssetsService,
		private contentPagesService: ContentPagesService
	) {}

	@Post()
	@Header('Content-Type', 'text/xml')
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

		const config = await this.sitemapService.getSitemapConfig();
		const configPaths = config.value.map((c) => c.path);
		const contentPagesPaths = await this.sitemapService.getContentPagesPaths();

		const staticPages = ['/', '/emiletest', '/bezoek', '/zoeken', '/geheime-content-pagina']; // /geheime-content-pagina is for testing

		const activeSpaces = await this.spacesService.findAll(
			{ size: 1000, status: [VisitorSpaceStatus.Active] },
			null
		);

		const publicObjects = await this.ieObjectsService.findObjectsForSitemap([
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
		]);

		// Create sitemap info for general pages
		const generalPages: SitemapItemInfo[] = [
			//TODO: Put everything in correct order like big comment above
			...staticPages.map((path) => ({
				loc: process.env.CLIENT_HOST + path,
				changefreq: 'monthly',
			})),
			...contentPagesPaths.map((path) => ({
				loc: process.env.CLIENT_HOST + path,
				changefreq: 'monthly',
			})),
			...activeSpaces.items.map((space) => ({
				loc: process.env.CLIENT_HOST + '/zoeken/?aanbieders=' + space.maintainerId,
				changefreq: 'weekly',
				lastmod: moment(space.updatedAt).format('YYYY-MM-DD'),
			})),
		];

		// Create sitemap info for item detail pages
		const itemDetailPages: SitemapItemInfo[] = [
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
		const PAGE_SIZE = 5; // amount of objects in 1 xml file, should be 50000
		const itemDetailPagesArray = [];

		for (let i = 0; i < itemDetailPages.length; i += PAGE_SIZE) {
			const chunk = itemDetailPages.slice(i, i + PAGE_SIZE);
			itemDetailPagesArray.push(chunk);
		}

		// blacklist and add priority
		const filteredPages = generalPages.reduce((result, page) => {
			const path = page.loc.substring(process.env.CLIENT_HOST.length);
			if (configPaths.includes(path)) {
				const configValue = config.value.find((c) => c.path === path);
				if (configValue?.blacklisted === true) {
					return result;
				} else {
					return [...result, { ...page, priority: configValue?.priority }];
				}
			}
			return [...result, page];
		}, []);

		const renderedXml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${filteredPages.map(SitemapController.renderPage).join('\n')}
		</urlset>
		`;

		// const url = await this.assetsService.uploadSitemap(AssetFileType.SITEMAP, {
		// 	fieldname: 'indexSitemap',
		// 	originalname: 'general',
		// 	encoding: '',
		// 	mimetype: 'text/xml',
		// 	size: 0,
		// 	stream: new Readable(),
		// 	destination: '',
		// 	filename: 'indexSitemap',
		// 	path: '',
		// 	buffer: Buffer.from(renderedXml, 'utf-8'),
		// });
		// return url;
		return renderedXml;
	}

	private static renderPage(pageInfo: SitemapItemInfo): string {
		return `<url>
			<loc>${pageInfo.loc}</loc>
			${pageInfo.lastmod ? `<lastmod>${pageInfo.lastmod}</lastmod>` : ``}
			<changefreq>${pageInfo.changefreq}</changefreq>
			${pageInfo.priority ? `<priority>${pageInfo.priority}</priority>` : ``}
			</url>`;
	}
}
