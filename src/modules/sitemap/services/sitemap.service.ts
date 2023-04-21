import { Readable } from 'stream';

import { ContentPagesService, DataService } from '@meemoo/admin-core-api';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';

import { SITEMAP_XML_OBJECTS_SIZE } from '../sitemap.consts';
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

	public async generateSitemap(sitemapConfig: SitemapConfig) {
		const contentPagesPaths = await this.getContentPagesPaths();

		const staticPages = ['/', '/bezoek', '/zoeken'];

		const activeSpaces = await this.spacesService.findAll(
			{ size: 1000, status: [VisitorSpaceStatus.Active] },
			null
		);

		const xmlUrls = []; // This will contain the urls for the index xml file

		// Create and upload sitemap for general pages
		const generalPages: SitemapItemInfo[] = this.blacklistAndPrioritizePages(
			[
				...staticPages.map((path) => ({
					loc: path,
					changefreq: 'monthly',
				})),
				...contentPagesPaths.map((path) => ({
					loc: path,
					changefreq: 'monthly',
				})),
				...activeSpaces.items.map((space) => ({
					loc: '/zoeken/?aanbieders=' + space.maintainerId,
					changefreq: 'weekly',
				})),
			],
			sitemapConfig
		);

		const renderedGeneralXml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${generalPages.map(this.renderPage).join('\n')}
		</urlset>
		`;

		xmlUrls.push(await this.uploadXml(renderedGeneralXml, 'general.xml'));

		// Create and upload sitemap for itemDetail pages
		const result = await this.ieObjectsService.findIeObjectsForSitemap(
			[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
			0,
			0
		);
		for (let i = 0; i < result.total; i += SITEMAP_XML_OBJECTS_SIZE) {
			const ieObjects = await this.ieObjectsService.findIeObjectsForSitemap(
				[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
				i,
				SITEMAP_XML_OBJECTS_SIZE
			);

			const itemDetailPages: SitemapItemInfo[] = this.blacklistAndPrioritizePages(
				[
					...ieObjects.items.map((object) => ({
						loc:
							'/zoeken/' +
							object.maintainerSlug +
							'/' +
							object.schemaIdentifier +
							'/' +
							_.kebabCase(object.name),
						changefreq: 'weekly',
						lastmod: moment(object.updatedAt).format('YYYY-MM-DD'),
					})),
				],
				sitemapConfig
			);

			const renderedXml = `<?xml version="1.0" encoding="UTF-8"?>
				<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
					${itemDetailPages.map(this.renderPage).join('\n')}
				</urlset>
				`;

			xmlUrls.push(await this.uploadXml(renderedXml, `item-detail-${ieObjects.page}.xml`));
		}

		// Generate index xml
		const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
		<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${xmlUrls.map(this.renderSitemapIndexEntry).join('\n')}
		</sitemapindex>
		`;
		await this.uploadXml(indexXml, `index.xml`);
		return renderedGeneralXml; // This is returned for unit tests
	}

	public async getSitemapConfig(): Promise<SitemapConfig> {
		try {
			const { app_config: config } = await this.dataService.execute<GetSitemapConfigQuery>(
				GetSitemapConfigDocument
			);
			if (!config) {
				throw new InternalServerErrorException(
					'Database value for SITEMAP_CONFIG is not defined in app.config. Aborting Sitemap generation.'
				);
			}
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

			return contentPages[0].map((cp) => cp?.path);
		} catch (err) {
			throw new InternalServerErrorException('Failed getting all the content pages', err);
		}
	}

	// Helpers
	// ------------------------------------------------------------------------
	private renderPage(pageInfo: SitemapItemInfo): string {
		return `<url>
			<loc>${process.env.CLIENT_HOST}${pageInfo.loc}</loc>
			${pageInfo.lastmod ? `<lastmod>${pageInfo.lastmod}</lastmod>` : ``}
			<changefreq>${pageInfo.changefreq}</changefreq>
			${pageInfo.priority ? `<priority>${pageInfo.priority}</priority>` : ``}
			</url>`;
	}

	private renderSitemapIndexEntry(url: string): string {
		return `<sitemap>
			<loc>${url}</loc>
			</sitemap>`;
	}

	private async uploadXml(xml: string, name: string): Promise<string> {
		return await this.assetsService.upload(
			AssetFileType.SITEMAP,
			{
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
			},
			name
		);
	}

	public blacklistAndPrioritizePages(
		pages: SitemapItemInfo[],
		config: SitemapConfig
	): SitemapItemInfo[] {
		const configPaths = config.value.map((c) => c.path);
		return _.compact(
			pages.map((page) => {
				if (configPaths.includes(page.loc)) {
					const configValue = config.value.find((c) => c.path === page.loc);
					if (configValue?.blacklisted) {
						return null;
					}
					if (configValue?.priority) {
						page.priority = configValue?.priority;
					}
				}
				return page;
			})
		);
	}
}
