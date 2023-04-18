import { Readable } from 'stream';

import { ContentPagesService } from '@meemoo/admin-core-api';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import moment from 'moment';

import { SitemapService } from '../services/sitemap.service';
import { SitemapItemConfig, SitemapItemInfo } from '../sitemap.types';

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
		this.generateSitemap(); // no await because this can take a while and we don't want FE to crash
		return `${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}/${AssetFileType.SITEMAP}/index`;
	}

	private async generateSitemap() {
		const sitemapConfig = await this.sitemapService.getSitemapConfig();
		const contentPagesPaths = await this.sitemapService.getContentPagesPaths();

		const staticPages = ['/', '/bezoek', '/geheime-content-pagina']; // /geheime-content-pagina is for testing

		const activeSpaces = await this.spacesService.findAll(
			{ size: 1000, status: [VisitorSpaceStatus.Active] },
			null
		);

		const publicObjects = await this.ieObjectsService.findObjectsForSitemap([
			IeObjectLicense.PUBLIEK_METADATA_LTD,
			IeObjectLicense.PUBLIEK_METADATA_ALL,
		]);

		// Create sitemap info for general pages
		const generalPages: SitemapItemInfo[] = SitemapController.blacklistAndPrioritizePages(
			[
				...staticPages.map((path) => ({
					loc: process.env.CLIENT_HOST + path,
					changefreq: 'monthly',
				})),
				...contentPagesPaths.map((path) => ({
					loc: process.env.CLIENT_HOST + path,
					changefreq: 'monthly',
				})),
				// /zoeken is seperate because of the required order
				{
					loc: process.env.CLIENT_HOST + '/zoeken',
					changefreq: 'monthly',
				},
				...activeSpaces.items.map((space) => ({
					loc: process.env.CLIENT_HOST + '/zoeken/?aanbieders=' + space.maintainerId,
					changefreq: 'weekly',
					lastmod: moment(space.updatedAt).format('YYYY-MM-DD'),
				})),
			],
			sitemapConfig
		);

		// Create sitemap info for item detail pages
		const itemDetailPages: SitemapItemInfo[] = SitemapController.blacklistAndPrioritizePages(
			[
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
			],
			sitemapConfig
		);
		const XML_OBJECTS_SIZE = 50; // amount of objects in 1 xml file, should be 50000
		const itemDetailPagesArray = []; // This contains arrays each containing a maximum of XML_OBJECTS_SIZE items

		for (let i = 0; i < itemDetailPages.length; i += XML_OBJECTS_SIZE) {
			const chunk = itemDetailPages.slice(i, i + XML_OBJECTS_SIZE);
			itemDetailPagesArray.push(chunk);
		}

		// Generate and upload all the xml files
		const xmlUrls = [];

		// Render general xml
		const renderedGeneralXml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${generalPages.map(SitemapController.renderPage).join('\n')}
		</urlset>
		`;
		xmlUrls.push(await this.uploadXml(renderedGeneralXml, 'general'));

		// Generate itemDetail xml
		await Promise.all(
			itemDetailPagesArray.map(async (pages: SitemapItemInfo[], index) => {
				const renderedXml = `<?xml version="1.0" encoding="UTF-8"?>
				<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
					${pages.map(SitemapController.renderPage).join('\n')}
				</urlset>
				`;
				xmlUrls.push(await this.uploadXml(renderedXml, `itemDetail${index}`));
			})
		);

		// Generate index xml
		const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
		<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${xmlUrls.map(SitemapController.renderIndexPage).join('\n')}
		</sitemapindex>
		`;
		await this.uploadXml(indexXml, `index`);
	}

	private static renderPage(pageInfo: SitemapItemInfo): string {
		return `<url>
			<loc>${pageInfo.loc}</loc>
			${pageInfo.lastmod ? `<lastmod>${pageInfo.lastmod}</lastmod>` : ``}
			<changefreq>${pageInfo.changefreq}</changefreq>
			${pageInfo.priority ? `<priority>${pageInfo.priority}</priority>` : ``}
			</url>`;
	}

	private static renderIndexPage(url: string): string {
		return `<sitemap>
			<loc>${url}</loc>
			</sitemap>`;
	}
	private async uploadXml(xml: string, name: string): Promise<string> {
		return await this.assetsService.uploadSitemap(AssetFileType.SITEMAP, {
			fieldname: name,
			originalname: name,
			encoding: '',
			mimetype: 'text/xml',
			size: 0,
			stream: new Readable(),
			destination: '',
			filename: name,
			path: '',
			buffer: Buffer.from(xml, 'utf-8'),
		});
	}

	// This function blacklists and adds priority using the config json in the database
	private static blacklistAndPrioritizePages(
		pages: SitemapItemInfo[],
		config: SitemapItemConfig
	): SitemapItemInfo[] {
		const configPaths = config.value.map((c) => c.path);

		return pages.reduce((result, page) => {
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
	}
}
