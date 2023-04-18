import { Readable } from 'stream';

import { ContentPagesService, DataService } from '@meemoo/admin-core-api';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import moment from 'moment';

import { SitemapConfig, SitemapItemInfo } from '../sitemap.types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import {
	GetSitemapConfigDocument,
	GetSitemapConfigQuery,
} from '~generated/graphql-db-types-hetarchief';
import { AssetsService } from '~modules/assets/services/assets.service';
import { AssetFileType } from '~modules/assets/types';
import { IeObjectLicense } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';

@Injectable()
export class SitemapService {
	constructor(
		protected dataService: DataService,
		protected spacesService: SpacesService,
		protected contentPagesService: ContentPagesService,
		protected ieObjectsService: IeObjectsService,
		protected assetsService: AssetsService
	) {}

	public async generateSitemap() {
		const sitemapConfig = await this.getSitemapConfig();
		const contentPagesPaths = await this.getContentPagesPaths();

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
		const generalPages: SitemapItemInfo[] = this.blacklistAndPrioritizePages(
			[
				...staticPages.map((path) => ({
					loc: process.env.CLIENT_HOST + path,
					changefreq: 'monthly',
				})),
				...contentPagesPaths.map((path) => ({
					loc: process.env.CLIENT_HOST + path,
					changefreq: 'monthly',
				})),
				// '/zoeken' is seperate because of the required order
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
		const itemDetailPages: SitemapItemInfo[] = this.blacklistAndPrioritizePages(
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
		const XML_OBJECTS_SIZE = 50000; // amount of objects in 1 xml file, should be 50000
		const itemDetailPagesArray = []; // This contains arrays each containing a maximum of XML_OBJECTS_SIZE items

		for (let i = 0; i < itemDetailPages.length; i += XML_OBJECTS_SIZE) {
			const chunk = itemDetailPages.slice(i, i + XML_OBJECTS_SIZE);
			itemDetailPagesArray.push(chunk);
		}

		// Generate and upload all the xml files
		const xmlUrls = []; // This will contain the urls for the index xml file

		// Generate general xml
		const renderedGeneralXml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${generalPages.map(this.renderPage).join('\n')}
		</urlset>
		`;
		xmlUrls.push(await this.uploadXml(renderedGeneralXml, 'general'));

		// Generate itemDetail xml
		await Promise.all(
			itemDetailPagesArray.map(async (pages: SitemapItemInfo[], index) => {
				const renderedXml = `<?xml version="1.0" encoding="UTF-8"?>
				<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
					${pages.map(this.renderPage).join('\n')}
				</urlset>
				`;
				xmlUrls.push(await this.uploadXml(renderedXml, `itemDetail${index}`));
			})
		);

		// Generate index xml
		const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
		<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${xmlUrls.map(this.renderIndexPage).join('\n')}
		</sitemapindex>
		`;
		await this.uploadXml(indexXml, `index`);
	}

	public async getSitemapConfig(): Promise<SitemapConfig> {
		try {
			const { app_config: config } = await this.dataService.execute<GetSitemapConfigQuery>(
				GetSitemapConfigDocument
			);

			return config[0];
		} catch (err) {
			throw new InternalServerErrorException('Failed getting sitemap config', err);
		}
	}

	public async getContentPagesPaths(): Promise<string[]> {
		try {
			const contentPages = await this.contentPagesService.fetchContentPages(
				0,
				50000,
				'title',
				'asc',
				'',
				{ content_type: { _eq: 'PAGINA' } }
			);
			const paths = contentPages[0].map((cp) => cp?.path);
			return paths;
		} catch (err) {
			throw new InternalServerErrorException('Failed getting all the content pages', err);
		}
	}

	// Helpers
	// ------------------------------------------------------------------------
	private renderPage(pageInfo: SitemapItemInfo): string {
		return `<url>
			<loc>${pageInfo.loc}</loc>
			${pageInfo.lastmod ? `<lastmod>${pageInfo.lastmod}</lastmod>` : ``}
			<changefreq>${pageInfo.changefreq}</changefreq>
			${pageInfo.priority ? `<priority>${pageInfo.priority}</priority>` : ``}
			</url>`;
	}

	private renderIndexPage(url: string): string {
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

	private blacklistAndPrioritizePages(
		pages: SitemapItemInfo[],
		config: SitemapConfig
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
