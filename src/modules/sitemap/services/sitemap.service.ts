import { ContentPagesService, DataService } from '@meemoo/admin-core-api';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { SitemapItemConfig } from '../sitemap.types';

import {
	GetSitemapConfigDocument,
	GetSitemapConfigQuery,
} from '~generated/graphql-db-types-hetarchief';

@Injectable()
export class SitemapService {
	constructor(
		protected dataService: DataService,
		protected contentPagesService: ContentPagesService
	) {}

	public async getSitemapConfig(): Promise<SitemapItemConfig> {
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
				100000,
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
}
