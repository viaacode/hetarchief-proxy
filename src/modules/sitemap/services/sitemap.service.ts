import { Readable } from 'stream';

import {
	AssetsService,
	ContentPagesService,
	DataService,
	DbContentPage,
	Locale,
} from '@meemoo/admin-core-api';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AssetType } from '@viaa/avo2-types';
import { format } from 'date-fns';
import _, { uniqBy } from 'lodash';
import xmlFormat from 'xml-formatter';

import { SitemapConfig, SitemapItemInfo } from '../sitemap.types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import {
	GetSitemapConfigDocument,
	GetSitemapConfigQuery,
} from '~generated/graphql-db-types-hetarchief';
import { IeObjectLicense, IeObjectsSitemap } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SITEMAP_XML_OBJECTS_SIZE } from '~modules/sitemap/sitemap.consts';
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
		const staticPageSitemapEntries: SitemapItemInfo[] = [
			{
				loc: '/',
				changefreq: 'monthly',
				links: [
					{ href: '/', hreflang: Locale.en },
					{ href: '/', hreflang: Locale.nl },
				],
			},
			{
				loc: '/bezoek',
				changefreq: 'monthly',
				links: [
					{ href: '/visit', hreflang: Locale.en },
					{ href: '/bezoek', hreflang: Locale.nl },
				],
			},
			{
				loc: '/zoeken',
				changefreq: 'monthly',
				links: [
					{ href: '/search', hreflang: Locale.en },
					{ href: '/zoeken', hreflang: Locale.nl },
				],
			},
			{
				loc: '/gebruiksvoorwaarden',
				changefreq: 'monthly',
				links: [
					{ href: '/user-conditions', hreflang: Locale.en },
					{ href: '/gebruiksvoorwaarden', hreflang: Locale.nl },
				],
			},
			{
				loc: '/cookiebeleid',
				changefreq: 'monthly',
				links: [
					{ href: '/cookie-policy', hreflang: Locale.en },
					{ href: '/cookiebeleid', hreflang: Locale.nl },
				],
			},
			{
				loc: '/nieuwsbrief',
				changefreq: 'monthly',
				links: [
					{ href: '/newsletter', hreflang: Locale.en },
					{ href: '/nieuwsbrief', hreflang: Locale.nl },
				],
			},
		];

		const contentPageSitemapEntries = await this.getContentPageSitemapEntries();

		const activeSpaces = await this.spacesService.findAll(
			{ size: 1000, status: [VisitorSpaceStatus.Active] },
			null
		);

		const xmlUrls = []; // This will contain the urls for the index xml file

		// Create and upload sitemap for general pages
		const generalSitemapEntries: SitemapItemInfo[] = this.blacklistAndPrioritizePages(
			[
				...staticPageSitemapEntries,
				...contentPageSitemapEntries,
				...activeSpaces.items.map((space) => ({
					loc: '/zoeken/?aanbieders=' + space.maintainerId,
					links: [
						{
							href: '/zoeken/?aanbieders=' + space.maintainerId,
							hreflang: Locale.nl,
						},
						{
							href: '/search/?aanbieders=' + space.maintainerId,
							hreflang: Locale.en,
						},
					],
					changefreq: 'weekly',
				})),
			],
			sitemapConfig
		);

		const renderedGeneralXml = xmlFormat(
			`
			<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
			${generalSitemapEntries.map(this.renderPage).join('\n')}
			</urlset>
		`,
			{ lineSeparator: '\n' }
		);

		xmlUrls.push(await this.uploadXml(renderedGeneralXml, 'general.xml'));

		// Create sitemap files for all public ie_objects
		const publicIeObjectXmlUrls = await this.createAndUploadPublicIeObjectSitemapEntries(
			sitemapConfig,
			0
		);
		xmlUrls.push(...publicIeObjectXmlUrls);

		// Generate index xml
		const indexXml = xmlFormat(
			`
			<?xml version="1.0" encoding="UTF-8"?>
			<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				${xmlUrls.map(this.renderSitemapIndexEntry).join('\n')}
			</sitemapindex>
		`,
			{ lineSeparator: '\n' }
		);
		await this.uploadXml(indexXml, `index.xml`);
		return renderedGeneralXml; // This is returned for unit tests
	}

	public async getSitemapConfig(): Promise<SitemapConfig> {
		try {
			const { app_config: config } =
				await this.dataService.execute<GetSitemapConfigQuery>(GetSitemapConfigDocument);
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

	public async getContentPageSitemapEntries(): Promise<SitemapItemInfo[]> {
		try {
			const contentPagesResponse = await this.contentPagesService.fetchContentPages(
				0,
				50000,
				'title',
				'asc',
				'',
				{
					content_type: { _eq: 'PAGINA' },
					language: { _eq: Locale.nl },
					is_public: { _eq: true },
				}
			);

			return contentPagesResponse[0].map(
				(contentPage: DbContentPage): SitemapItemInfo => ({
					loc: contentPage.path,
					links: uniqBy(
						[
							...contentPage.translatedPages
								.filter((translated) => translated.isPublic)
								.map((translated) => ({
									href: translated.path,
									hreflang: translated.language as unknown as Locale,
								})),
							{
								href: contentPage.path,
								hreflang: Locale.nl,
							},
						],
						(entry) => entry.href + entry.hreflang
					),
					changefreq: 'monthly',
					lastmod: format(new Date(contentPage.updatedAt), 'yyyy-MM-dd'),
				})
			);
		} catch (err) {
			throw new InternalServerErrorException(
				'Failed to getContentPageSitemapEntries: ' + JSON.stringify(err, null, 2)
			);
		}
	}

	// Helpers
	// ------------------------------------------------------------------------
	private async createAndUploadPublicIeObjectSitemapEntries(
		sitemapConfig: SitemapConfig,
		pageOffset: number
	) {
		const result = await this.ieObjectsService.findIeObjectsForSitemap(
			[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
			0,
			0
		);
		const totalIeObjects = result.total;
		const xmlUrls: string[] = [];
		for (let i = 0; i < totalIeObjects; i += SITEMAP_XML_OBJECTS_SIZE) {
			const ieObjectsResponse = await this.ieObjectsService.findIeObjectsForSitemap(
				[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL],
				i,
				SITEMAP_XML_OBJECTS_SIZE
			);

			const xmlUrl = await this.formatAndUploadIeObjectAsSitemapXml(
				ieObjectsResponse.items,
				pageOffset + ieObjectsResponse.page,
				sitemapConfig
			);
			xmlUrls.push(xmlUrl);
		}
		return xmlUrls;
	}

	private renderPage(pageInfo: SitemapItemInfo): string {
		function renderPageLinks(links: { href: string; hreflang: Locale }[]) {
			if (!links?.length) {
				return '';
			}
			return links
				.map((translatedPage) => {
					const hreflang = translatedPage.hreflang;
					const href =
						process.env.CLIENT_HOST +
						(translatedPage.hreflang === Locale.nl
							? ''
							: '/' + translatedPage.hreflang) +
						translatedPage.href;
					return `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
				})
				.join('\n');
		}

		return `
			<url>
				<loc>${process.env.CLIENT_HOST}${pageInfo.loc}</loc>
				${renderPageLinks(pageInfo.links)}
				${pageInfo.lastmod ? `<lastmod>${pageInfo.lastmod}</lastmod>` : ''}
				<changefreq>${pageInfo.changefreq}</changefreq>
				${pageInfo.priority ? `<priority>${pageInfo.priority}</priority>` : ''}
			</url>`;
	}

	private renderSitemapIndexEntry(url: string): string {
		return `
		<sitemap>
			<loc>${url}</loc>
		</sitemap>`;
	}

	private async uploadXml(xml: string, name: string): Promise<string> {
		return this.assetsService.uploadAndTrack(
			AssetType.SITEMAP,
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
			name,
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

	private mapIeObjectToSitemapInfo(object: IeObjectsSitemap): SitemapItemInfo {
		const objectPath =
			object.maintainerSlug + '/' + object.schemaIdentifier + '/' + _.kebabCase(object.name);

		return {
			loc: '/zoeken/' + objectPath,
			links: [
				{
					href: '/search/' + objectPath,
					hreflang: Locale.en,
				},
				{
					href: '/zoeken/' + objectPath,
					hreflang: Locale.nl,
				},
			],
			changefreq: 'weekly',
			lastmod: format(new Date(object.updatedAt), 'yyyy-MM-dd'),
		};
	}

	private async formatAndUploadIeObjectAsSitemapXml(
		ieObjects: any[],
		pageIndex: number,
		sitemapConfig: SitemapConfig
	): Promise<string> {
		const ieObjectSitemapEntries: SitemapItemInfo[] = this.blacklistAndPrioritizePages(
			ieObjects.map(this.mapIeObjectToSitemapInfo),
			sitemapConfig
		);

		const renderedXml = xmlFormat(
			`
				<?xml version="1.0" encoding="UTF-8"?>
				<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
					${ieObjectSitemapEntries.map(this.renderPage).join('\n')}
				</urlset>
			`,
			{ lineSeparator: '\n' }
		);

		return await this.uploadXml(renderedXml, `item-detail-${pageIndex}.xml`);
	}
}
